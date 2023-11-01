import { db } from '@/lib/db'

async function getTeams() {
  return db.query.teams.findMany({})
}
export default async function TeamsPage() {
  const teams = await getTeams()
  return (
    <div>
      <h1>All Teams</h1>
      {teams.map((team) => (
        <p>{team.slug}</p>
      ))}
    </div>
  )
}
