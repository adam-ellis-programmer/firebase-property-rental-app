import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons'
import logo from '../svgs/logo.svg'
import temp from '../temp/user.jpg'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useSelector, useDispatch } from 'react-redux'
import SmallSearchNavForm from '../components/search/SmallSearchNavForm'
import UseAuthCheck from '../hooks/UseAuthCheck'
import { getMessages } from '../features/properties/propertiesAction'
import { setMessages } from '../features/properties/propertiesSlice'
const Header = () => {
  const dispatch = useDispatch()
  const { loggedInUser } = UseAuthCheck()
  const { messages } = useSelector((state) => state.property)
  const { signUpChange } = useSelector((state) => state.property)

  const [profileURL, setProfileURL] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navRef = useRef()

  const auth = getAuth()

  useEffect(() => {
    if (loggedInUser) {
      setProfileURL(loggedInUser.photoURL)
      setIsLoggedIn(true)
      const getData = async () => {
        const msgRes = await getMessages(loggedInUser.uid)
        dispatch(setMessages(msgRes))
      }
      getData()
    } else {
      // User is signed out
      setIsLoggedIn(false)
      setProfileURL('')
    }

    // rename change to reRender
  }, [signUpChange, loggedInUser])

  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isprofileOpen, setIsprofileOpen] = useState(false)

  const handleToggleNav = () => {
    setIsNavOpen(!isNavOpen)
    setIsprofileOpen(false)
  }
  const handleToggleProfile = () => {
    setIsprofileOpen(!isprofileOpen)
    setIsNavOpen(false)
  }

  const handleLogout = () => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('logged out')
        setIsprofileOpen(false)
      })
      .catch((error) => {
        // An error happened.
        console.log('error')
      })
  }

  const handleTopNavClick = () => {
    setIsprofileOpen(false)
  }

  return (
    <header>
      <nav ref={navRef}>
        <div className="nav-center">
          {/* change class name of inner */}
          <div className="nav-center-inner">
            <button onClick={handleToggleNav} className="toggle-mob-nav">
              <FontAwesomeIcon icon={faBarsStaggered} />
            </button>
            <div className="nav-logo-box">
              <Link to="/">
                <img className="top-logo" src={logo} alt="" />
              </Link>
            </div>

            <div className="top-nav-links-container">
              <div className="top-nav-btn-container">
                {/* -------------  TOP NAV  ------------------- */}
                <ul className="top-nav-ul">
                  <li className="top-nav-li">
                    <Link onClick={handleTopNavClick} className="top-nav-link" to="/">
                      home
                    </Link>
                  </li>

                  {isLoggedIn && (
                    <li className="top-nav-li">
                      <Link
                        onClick={handleTopNavClick}
                        className="top-nav-link"
                        to="/register"
                      >
                        add property
                      </Link>
                    </li>
                  )}
                  <li className="top-nav-li">
                    <Link onClick={handleTopNavClick} className="top-nav-link" to="/all">
                      properties
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="loging-btn-wrap">
                {isLoggedIn ? (
                  <Link
                    onClick={() => handleLogout()}
                    to="signin"
                    className="nav-login-btn"
                  >
                    logout{' '}
                  </Link>
                ) : (
                  <Link to="signin" className="nav-login-btn">
                    login{' '}
                  </Link>
                )}

                <div className="nav-profile-img-container">
                  {isLoggedIn && (
                    <>
                      <div className="nav-msg-am">{messages?.length}</div>
                      <img
                        onClick={handleToggleProfile}
                        className="nav-profile-img"
                        src={profileURL}
                        alt=""
                      />
                    </>
                  )}
                  <div className={`${isprofileOpen && 'showProfileNav'} profile-wrap`}>
                    <ul className="profile-nav-ul">
                      <li className="profile-nav-li">
                        <Link
                          onClick={() => setIsprofileOpen(!isprofileOpen)}
                          to="/profile"
                          className="profile-link"
                        >
                          my profile
                        </Link>
                      </li>

                      <li className="profile-nav-li">
                        <Link
                          onClick={() => setIsprofileOpen(!isprofileOpen)}
                          to="/@me"
                          className="profile-link"
                        >
                          my account
                        </Link>
                      </li>

                      <li className="profile-nav-li">
                        <Link
                          onClick={() => setIsprofileOpen(!isprofileOpen)}
                          to="/messages"
                          className="profile-link"
                        >
                          messages
                        </Link>
                      </li>
                      <li className="profile-nav-li">
                        <Link
                          onClick={() => setIsprofileOpen(!isprofileOpen)}
                          to="/bookmarked"
                          className="profile-link"
                        >
                          bookmarked
                        </Link>
                      </li>
                      <li className="profile-nav-li">
                        <Link
                          onClick={() => handleLogout()}
                          to="/signin"
                          className="profile-link"
                        >
                          logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${isNavOpen && 'showMobileNav'} mobile-nav-container`}>
            <div className="small-search-wrap">
              <SmallSearchNavForm setIsNavOpen={setIsNavOpen} />
            </div>
            {/* -----------   MOBILE NAV  ---------- */}
            <div className="mobile-nav-grid">
              <ul className="mobile-nav-ul">
                <li className="mobile-nav-li">
                  <Link
                    onClick={() => setIsNavOpen(false)}
                    className="mobile-nav-link"
                    to="/register"
                  >
                    list a property
                  </Link>
                </li>
                <li className="mobile-nav-li">
                  <Link
                    onClick={() => setIsNavOpen(false)}
                    className="mobile-nav-link"
                    to="/all"
                  >
                    browse properties
                  </Link>
                </li>
                <li className="mobile-nav-li">
                  <Link
                    onClick={() => setIsNavOpen(false)}
                    className="mobile-nav-link"
                    to="/"
                  >
                    home
                  </Link>
                </li>
                <li className="mobile-nav-li">
                  <Link
                    onClick={() => setIsNavOpen(false)}
                    className="mobile-nav-link"
                    to="/@me"
                  >
                    my account
                  </Link>
                </li>
                <li className="mobile-nav-li">
                  <Link
                    onClick={() => setIsNavOpen(false)}
                    className="mobile-nav-link"
                    to="/profile"
                  >
                    my profile
                  </Link>
                </li>
              </ul>

              <div className="mobile-nav-img-container">
                <img className="mobile-nav-img" src={logo} alt="" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
