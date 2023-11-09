import { auth, clerkClient } from '@clerk/nextjs'

export async function POST(req: Request): Promise<Response> {
  const { userId } = auth()
  console.log('inside api/create-team')
  if (!userId) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const rawBody = await req.text()
    const jsonBody = JSON.parse(rawBody)
    console.log('jsonBody: ', jsonBody)

    const result = await clerkClient.organizations.createOrganization({
      name: jsonBody.teamName,
      slug: jsonBody.teamName.replace(/ /g, '-'),
      createdBy: userId,
      publicMetadata: jsonBody,
    })

    return Response.json(
      { message: 'Success', orgId: result.id },
      { status: 200 }
    )
  } catch (e) {
    console.error('Request error', e) // eslint-disable-line no-console
    return Response.json({ error: e }, { status: 500 })
  }
}
