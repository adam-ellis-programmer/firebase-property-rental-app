import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const UseAuthCheck = () => {
  const [loggedInUser, setLoggedInUser] = useState(null)
  // Without the loading state, PrivateRoute assumes the user is unauthenticated until loggedInUser is updated.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user)
      } else {
        setLoggedInUser(null)
      }
      setLoading(false) // Auth state has been checked
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  return { loggedInUser, loading }
}

export default UseAuthCheck
