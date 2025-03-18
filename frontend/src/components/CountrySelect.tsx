import ReactFlagsSelect from 'react-flags-select'
import { supabase } from '../services/supabase.ts'
import { useSettings } from '../hooks/useSettings'
import { notifySuccess, notifyError } from '../services/toastService'

const API_URL = import.meta.env.VITE_API_URL

export default function CountrySelect() {
  const { country, setCountry } = useSettings()

  const updateCountry = async (countryCode: string) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      console.log(countryCode)

      // Send the pronouns to the backend to be updated on the db
      const response = await fetch(`${API_URL}/api/update-country`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryCode }),
      })

      const data = await response.json()
      if (response.ok) {
        console.log('Successfully updated country to: ', data.countryData.country)
        notifySuccess('Country updated successfully!')

        setCountry(data.countryData.country)
        const profileFromLocalStorage = localStorage.getItem('profile')
        const profile = profileFromLocalStorage ? JSON.parse(profileFromLocalStorage) : {}
        profile.country = data.countryData.country
        localStorage.setItem('profile', JSON.stringify(profile))
      } else {
        console.error('Country update failed:', data.error)
        notifyError('Something went wrong')
      }
    } catch (error) {
      console.error('Error updating country: ', error)
      notifyError('Something went wrong')
    }
  }

  return (
    <div className="">
      <p className="regular pb-2 font-bold">Country</p>
      <ReactFlagsSelect selected={country as string} onSelect={updateCountry} />
    </div>
  )
}
