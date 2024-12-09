import { useState } from 'react'
import SignupForm from '../components/forms/SignupForm'
import bgImg from '../temp/images/properties/update-bg.webp'
import FormSubmitLoader from '../components/loaders/FormSubmitLoader'
const Signup = () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  if (isSubmiting) {
    return <FormSubmitLoader />
  }
  return (
    <section className="form-page-container  access-page-grid">
      <img className="access-grid-img" src={bgImg} alt="" />
      <div className="access-grid-overlay"></div>
      <div></div>
      <div className="access-form-container">
        <SignupForm setIsSubmiting={setIsSubmiting} />
      </div>
    </section>
  )
}

export default Signup
