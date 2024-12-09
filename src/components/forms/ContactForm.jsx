import { useState, useEffect } from 'react'
import SectionHeader from '../../layout/SectionHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faLock } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import UseAuthCheck from '../../hooks/UseAuthCheck'
import { fetchProperty } from '../../features/properties/propertiesAction'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase-config'
import PageAlert from '../alerts/PageAlert'

const ContactForm = () => {
  const [propertyDetails, setPropertyDetails] = useState(null)
  const { loggedInUser } = UseAuthCheck()
  const [showAlert, setShowAlert] = useState(false)
  const [alertMSG, setAlertMSG] = useState(false)
  const [alertStyle, setAlertStyle] = useState('')
  const { id: propertyIDRef } = useParams('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  useEffect(() => {
    const getData = async () => {
      const propRes = await fetchProperty('listings', propertyIDRef)
      setPropertyDetails(propRes.data)
    }
    getData()

    return () => {}
  }, [loggedInUser])

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      name: loggedInUser?.displayName || '',
      email: loggedInUser?.email || '',
      phone: loggedInUser?.phoneNumber || '',
    }))
    return () => {}
  }, [loggedInUser])

  const { name, email, phone, message } = formData

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (phone === '' || message === '') {
      handleAlert(2000, 'must include msg and number!')
      return
    }

    if (loggedInUser.uid === propertyDetails.propertyOwner) {
      handleAlert(2000, 'cannot send msg to self!')
      return
    }

    try {
      // can use serverTimeStamp()
      const data = {
        ...formData,
        propertyIDRef,
        propertyAddress: propertyDetails.address,
        propertyType: propertyDetails.propertyType,
        senderProfileImg: loggedInUser.photoURL,
        propertyImg: propertyDetails.imgURLS[0].url,
        senderID: loggedInUser.uid,
        propertyOwnerID: propertyDetails.propertyOwner,
        sentDate: new Date().toLocaleDateString('en-GB'),
        read: false,
        dateStamp: Date.now(),
      }

      console.log(data)
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, 'messages'), data)

      handleAlert(2000, 'message sent!', 'success')
      resetForm()

      console.log('Document written with ID: ', docRef.id)
    } catch (error) {
      console.log(error)
    }
  }
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  // one function to handle alert
  const handleAlert = (delay, text, style) => {
    setShowAlert(true)
    setAlertMSG(text)
    setAlertStyle(style)

    setTimeout(() => {
      setAlertMSG('')
      setShowAlert(false)
      setAlertStyle('')
    }, delay)
  }

  // reset data
  const resetForm = () => {
    setFormData((prevState) => ({
      ...prevState,
      phone: '',
      message: '',
    }))
  }
  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {showAlert && <PageAlert text={alertMSG} alertStyle={alertStyle} />}
      {!loggedInUser && (
        <div className="contact-form-overlay">
          <FontAwesomeIcon className="lock-icon" icon={faLock} />
        </div>
      )}
      <SectionHeader text={`contact the owner`} />

      <div className="contact-form-control">
        <label className="contact-label" htmlFor="name">
          name
        </label>
        <input
          onChange={handleChange}
          className="contact-input"
          id="name"
          type="text"
          placeholder="name"
          value={name}
          disabled={true}
        />
      </div>

      <div className="contact-form-control">
        <label className="contact-label" htmlFor="email">
          email
        </label>
        <input
          onChange={handleChange}
          className="contact-input"
          id="email"
          type="text"
          placeholder="email"
          value={email}
          disabled={true}
        />
      </div>

      <div className="contact-form-control">
        <label className="contact-label" htmlFor="phone">
          phone
        </label>
        <input
          onChange={handleChange}
          className="contact-input"
          id="phone"
          type="text"
          placeholder="phone"
          value={phone}
        />
      </div>
      <div className="contact-form-control">
        <label id="message" className="contact-label" htmlFor="message">
          message
        </label>
        <textarea
          onChange={handleChange}
          className="contact-text-area"
          id="message"
          name=""
          value={message}
        ></textarea>
      </div>

      <div className="contact-btn-container">
        <button className="contact-submit">
          <FontAwesomeIcon icon={faPaperPlane} /> send
        </button>
      </div>
    </form>
  )
}

export default ContactForm
