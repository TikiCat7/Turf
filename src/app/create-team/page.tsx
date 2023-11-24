import TeamCreationFormWrapper from '@/components/team-creation-form-wrapper'

export default function CreateTeam() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="pl-4 font-bold text-2xl pt-8">New team</p>
      <p className="text-sm text-muted-foreground">
        Create a team to start manage.
      </p>
      <TeamCreationFormWrapper />
    </div>
  )
}
