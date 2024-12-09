import { useState } from 'react'
import SectionHeader from '../../layout/SectionHeader'
import { Link } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import PageAlert from '../alerts/PageAlert'
const SigninForm = ({ setisSubmiting }) => {
  const navigate = useNavigate('')
  const [showAlert, setShowAlert] = useState(false)
  const [checking, setChecking] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSignin = async (e) => {
    e.preventDefault()

    try {
      setChecking(true)
      const auth = getAuth()
      const res = await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
      setChecking(false)
    } catch (error) {
      handleAlert()
      setChecking(false)
      console.log(error)
      const errorCode = error.code
      const errorMessage = error.message
    }
  }

  function handleAlert() {
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 2000)
  }

  return (
    <form onSubmit={handleSignin} className="access-form">
      <SectionHeader text={`signin`} />
      {showAlert && <PageAlert text={`incorrect credentials`} alertStyle={'signin'} />}
      <div className="access-form-control">
        <label className="access-label" htmlFor="email">
          email
        </label>
        <input
          onChange={handleChange}
          type="text"
          className="access-input"
          id="email"
          value={email}
        />
      </div>
      <div className="access-form-control">
        <label className="access-label" htmlFor="password">
          password
        </label>
        <input
          onChange={handleChange}
          type="text"
          className="access-input"
          id="password"
          value={password}
        />
      </div>
      <div className="access-form-control">
        <Link className="access-link" to="/signup">
          signup
        </Link>
      </div>
      <div className="access-form-control access-btn-container">
        <button className="access-btn">{checking ? 'checking' : 'sign in'}</button>
      </div>
    </form>
  )
}

export default SigninForm
