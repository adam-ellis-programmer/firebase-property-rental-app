import { useState } from 'react'
const EmailSignUpForm = () => {
  const [email, setEmail] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('you are signed up...')
  }
  return (
    <form onSubmit={handleSubmit} className="email-signup-form">
      <input className="email-signup-input" type="text" placeholder="enter email" />
      <button className="email-signup-btn">sign up</button>
    </form>
  )
}

export default EmailSignUpForm
