import { Navigate, Outlet } from 'react-router-dom'
import UseAuthCheck from '../hooks/UseAuthCheck'

const PrivateRoute = () => {
  const { loggedInUser, loading } = UseAuthCheck()

  if (loading) {
    // You can return a loading spinner or placeholder here
    return <div>Loading...</div>
  }

  // Check if the user is authenticated
  return loggedInUser ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoute
