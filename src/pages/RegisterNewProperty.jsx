import React from 'react'
import AddNewProperty from '../components/forms/AddNewProperty'
import bgIMG from '../temp/images/properties/update-bg.webp'
const RegisterNewProperty = () => {
  return (
    <div className="register-bg">
      <img className='register-bg-img' src={bgIMG} alt="" />
      <div className="register-bg-overlay"></div>
      <div className="register-container">
        <AddNewProperty />
      </div>
    </div>
  )
}

export default RegisterNewProperty
