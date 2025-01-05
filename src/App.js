import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './layout/Header'
import PropertyDetails from './pages/PropertyDetails'
import AllProperties from './pages/AllProperties'
import MyProfile from './pages/MyProfile'
import MyAccount from './pages/MyAccount'
import RegisterNewProperty from './pages/RegisterNewProperty'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import ManageImages from './pages/ManageImages'
import BookmarkedProperties from './pages/BookmarkedProperties'
import Messages from './pages/Messages'
import SearchResultsPage from './pages/SearchResultsPage'
import UpdateProperty from './pages/UpdateProperty'
import Footer from './layout/Footer'
import PrivateRoute from './components/PrivateRoute'
import NotFound from './pages/NotFound'
import GlobalAlert from './components/alerts/GlobalAlert'
function App() {
  return (
    <div>
      <GlobalAlert />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property-details/:id" element={<PropertyDetails />} />
          <Route path="/all" element={<AllProperties />} />

          {/* frontend protected */}
          <Route element={<PrivateRoute />}>
            <Route path="@me" element={<MyAccount />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/manage/:id" element={<ManageImages />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/bookmarked" element={<BookmarkedProperties />} />
            <Route path="/update" element={<UpdateProperty />} />
            <Route path="/register" element={<RegisterNewProperty />} />
          </Route>

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchResultsPage />} />

          {/* Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </Router>
    </div>
  )
}

export default App
