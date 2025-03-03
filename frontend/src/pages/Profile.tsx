import { useParams } from 'react-router'

export default function Profile() {
  const { username } = useParams()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <p> {username} </p>
    </div>
  )
}
