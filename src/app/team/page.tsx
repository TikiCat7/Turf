import { auth, clerkClient } from '@clerk/nextjs'
import { InstagramIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import InviteForm from '@/components/invite-form'
import RevokeForm from '@/components/revoke-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/db'
import { SelectUsers } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

async function getTeam() {
  const clerkUser = auth()
  if (!clerkUser.sessionClaims?.org_slug) {
    return redirect('/')
  }
  return await db.query.teams.findFirst({
    where: (teams, { eq }) =>
      eq(teams.slug, clerkUser.sessionClaims?.org_slug ?? ''),
    with: {
      videos: true,
      usersToTeams: {
        with: {
          user: true,
        },
      },
    },
  })
}

function MemberRow({ user }: { user: SelectUsers }) {
  return (
    <div className="flex items-center justify-between" key={user.clerkId}>
      <div className="flex items-center space-x-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://avatar.vercel.sh/personal.png" />
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-primary">
            {user.firstName + ' ' + user.lastName}
          </p>
          <div className="flex space-x-1">
            <p className="text-xs text-muted-foreground">#21</p>
            <p className="text-xs text-muted-foreground">MF</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function Team() {
  const team = await getTeam()
  const user = auth()
  const isAdmin = user.orgRole === 'admin'
  const invitations =
    await clerkClient.organizations.getOrganizationInvitationList({
      organizationId: user.orgId ?? '',
    })

  const pendingInvitationCount = invitations.filter(
    (inv) => inv.status === 'pending'
  ).length

  return (
    <div className="flex-col py-16 w-4/5">
      {/* <OrganizationSwitcher /> */}
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={
                (user.sessionClaims?.orgImageUrl as string) ??
                'https://avatar.vercel.sh/personal.png'
              }
            />
            <AvatarFallback />
          </Avatar>
          <p className="text-4xl font-bold text-primary">{team?.name}</p>
          <div className="pt-3 flex items-center space-x-2">
            <Link
              href="https://instagram.com/bigpoppas.fc?igshid=YmMyMTA2M2Y="
              className="text-muted-foreground"
            >
              <InstagramIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground py-4">
        {team?.name} is an amateur team that plays in Singapore.
      </p>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-1">
          <Tabs defaultValue="members" className="">
            {isAdmin && (
              <TabsList className="mt-2 ml-2" defaultValue={'members'}>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="invite">Invite</TabsTrigger>
                <TabsTrigger value="pending">
                  {pendingInvitationCount > 0
                    ? `Pending (${pendingInvitationCount})`
                    : 'Pending'}
                </TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="members" className="mt-0">
              <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  {team?.usersToTeams.length} members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 overflow-y-scroll max-h-[200px]">
                {team?.usersToTeams.map((user, i) => (
                  <MemberRow user={user.user} key={i} />
                ))}
              </CardContent>
            </TabsContent>
            {isAdmin && (
              <>
                <TabsContent value="invite">
                  <CardHeader>
                    <CardTitle>Invite</CardTitle>
                    <CardDescription>
                      Manage invitations to {team?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InviteForm />
                  </CardContent>
                </TabsContent>
                <TabsContent value="pending">
                  <CardHeader>
                    <CardTitle>Pending</CardTitle>
                    <CardDescription>
                      Manage pending invitations for {team?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {invitations
                      .filter((invitation) => invitation.status === 'pending')
                      .map((invitation, i) => {
                        return (
                          <div key={i}>
                            <RevokeForm
                              id={invitation.id}
                              email={invitation.emailAddress}
                              createdAt={invitation.createdAt}
                              role={invitation.role}
                              orgId={invitation.organizationId}
                              requestingUserId={user.userId ?? ''}
                            />
                          </div>
                        )
                      })}
                  </CardContent>
                </TabsContent>
              </>
            )}
          </Tabs>
        </Card>
        <Card className="col-span-1 bg-black/10 opacity-50 pointer-events-none">
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>
              <>
                <span>Next match: Nov 8th vs Uchiha FC.</span>
              </>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start xs:space-x-2 space-x-0 space-y-4 xs:space-y-0 justify-between flex-col xs:flex-row">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://avatar.vercel.sh/personal.png" />
                  <AvatarFallback />
                </Avatar>
                <div>
                  <p>Uchiha FC</p>
                  <p className="text-xs text-muted-foreground">
                    November 8th, 19:00pm
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Link
                      href="https://maps.app.goo.gl/PpHkKRKBKrrf87jq7"
                      className="underline"
                    >
                      Turf-City pitch 4
                    </Link>
                  </p>
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Attending" />
                </SelectTrigger>
                <SelectContent className="w-8">
                  <SelectItem value="Attending">Attending</SelectItem>
                  <SelectItem value="Skip">Skip</SelectItem>
                  <SelectItem value="Undecided">Undecided</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 bg-black/10 opacity-50 pointer-events-none">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>4-1 win vs FC Uchiha 🔥</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                className="flex items-center space-x-2 justify-between"
                key={i}
              >
                <div className="flex items-center space-x-2">
                  <p>Uchiha FC</p>
                  <p className="font-bold text-xl">4-1</p>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
