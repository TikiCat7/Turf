import { Cuepoints } from '@/lib/db/schema'

export default function CuePointList({
  cuepoints,
}: {
  cuepoints: Cuepoints[]
}) {
  return (
    <>
      <p>Cuepoints on video: {cuepoints.length}</p>
      {cuepoints.map((cuepoint) => (
        <div key={cuepoint.id}>
          <p>Description {cuepoint.description}</p>
          <p>Time {cuepoint.time}</p>
          <p>Category {cuepoint.playCategory}</p>
        </div>
      ))}
    </>
  )
}
