import { createContext, useState, useEffect } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

export const UserStatusContext = createContext()

export const UserStatusProvider = ({ children }) => {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [isPaidUser, setIsPaidUser] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchUserStatus = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('is_paid_user, is_admin')
        .eq('id', user?.id)

      if (error) {
        console.log(error)
      } else if (data) {
        setIsPaidUser(data[0]?.is_paid_user)
        setIsAdmin(data[0]?.is_admin)
      }
    }

    fetchUserStatus()
  }, [supabase, user?.id])

  return (
    <UserStatusContext.Provider value={{ isPaidUser, isAdmin }}>
      {children}
    </UserStatusContext.Provider>
  )
}
