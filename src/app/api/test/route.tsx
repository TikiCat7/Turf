import { auth } from '@clerk/nextjs'

export async function GET(): Promise<Response> {
  const { userId } = auth()
  console.log('inside api/test GET')
  if (!userId) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    return Response.json({ message: 'Test Success' }, { status: 200 })
  } catch (e) {
    console.error('Request error', e) // eslint-disable-line no-console
    return Response.json({ error: e }, { status: 500 })
  }
}
