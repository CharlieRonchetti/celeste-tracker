import { getRuns } from '../services/api'

export default function Leaderboard() {
  console.log(getRuns())
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      <p>Leaderboard data...</p>
    </div>
  )
}
