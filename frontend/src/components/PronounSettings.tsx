import { useSettings } from '../hooks/useSettings.ts'
import { supabase } from '../services/supabase.ts'

const API_URL = import.meta.env.VITE_API_URL

export default function PronounSettings() {
  const { pronouns, setPronouns } = useSettings()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPronoun = e.target.value

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token

      // Send the pronouns to the backend to be updated on the db
      const response = await fetch(`${API_URL}/api/update-pronouns`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPronoun }),
      })

      const data = await response.json()
      if (response.ok) {
        console.log('Successfully updated pronouns to: ', data.pronounData.pronouns)
        setPronouns(data.pronounData.pronouns)
        const profileFromLocalStorage = localStorage.getItem('profile')
        const profile = profileFromLocalStorage ? JSON.parse(profileFromLocalStorage) : {}
        profile.pronouns = data.pronounData.pronouns
        localStorage.setItem('profile', JSON.stringify(profile))
      } else {
        console.error('Pronoun update failed:', data.error)
      }
    } catch (error) {
      console.error('Error updating pronouns: ', error)
    }
  }

  return (
    <div>
      <p className="regular font-bold">Pronouns</p>
      <div className="flex gap-4">
        <div>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="pronouns"
              value="None"
              checked={pronouns === 'None'}
              onChange={handleChange}
              className="mr-1 cursor-pointer"
            ></input>
            None
          </label>
        </div>
        <div>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="pronouns"
              value="He/Him"
              checked={pronouns === 'He/Him'}
              onChange={handleChange}
              className="mr-1 cursor-pointer"
            ></input>
            He/Him
          </label>
        </div>
        <div>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="pronouns"
              value="She/Her"
              checked={pronouns === 'She/Her'}
              onChange={handleChange}
              className="mr-1 cursor-pointer"
            ></input>
            She/Her
          </label>
        </div>
        <div>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="pronouns"
              value="They/Them"
              checked={pronouns === 'They/Them'}
              onChange={handleChange}
              className="mr-1 cursor-pointer"
            ></input>
            They/Them
          </label>
        </div>
        <div>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="pronouns"
              value="It/Its"
              checked={pronouns === 'It/Its'}
              onChange={handleChange}
              className="mr-1 cursor-pointer"
            ></input>
            It/Its
          </label>
        </div>
        <div>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="pronouns"
              value="Any/All"
              checked={pronouns === 'Any/All'}
              onChange={handleChange}
              className="mr-1 cursor-pointer"
            ></input>
            Any/All
          </label>
        </div>
      </div>
    </div>
  )
}
