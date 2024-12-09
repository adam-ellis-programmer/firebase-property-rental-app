import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionHeader from '../../layout/SectionHeader'
import { Link } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../../firebase-config' // init somewher in the app
import { useDispatch, useSelector } from 'react-redux'
import { setLoginChange } from '../../features/properties/propertiesSlice'

import PageAlert from '../alerts/PageAlert'
const SignupForm = ({ setIsSubmiting }) => {
  const [showAlert, setShowAlert] = useState(false)
  const [alertText, setAlertText] = useState(false)
  const { signUpChange } = useSelector((state) => state.property)
  console.log(signUpChange)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { name, email, password, confirmPassword } = formData

  const uploadProfileImg = (file, filePath) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage()

      // Upload file and metadata
      const storageRef = ref(storage, filePath)
      const uploadTask = uploadBytesResumable(storageRef, file)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break
            case 'storage/canceled':
              // User canceled the upload
              break

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break
          }
          reject(error)
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
            console.log('File available at', downloadURL)
          })
        }
      )
    })
  }
  const handleSignUp = async (e) => {
    const auth = getAuth()
    e.preventDefault()

    if (name === '' || email === '' || password === '') {
      handleAlert('please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      handleAlert('passwords do not match')
      return
    }

    // default img url (place in dotenv)
    let imgURL =
      'https://firebasestorage.googleapis.com/v0/b/property-rental-1.appspot.com/o/utils%2Fprofile-img-temp.jpg?alt=media&token=8b5c369f-a047-4eac-a496-68cfa14f365a'

    try {
      setIsSubmiting(true)
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const filePath = `profile-images/${res.user.uid}/profile-pic`

      if (file) {
        imgURL = await uploadProfileImg(file, filePath)
      }

      console.log(imgURL, filePath)
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: imgURL,
      })

      console.log(res)
      const updatedData = {
        ...formData,
        bookmarked: [],
        likedProperties: [],
        timestamp: serverTimestamp(),
      }

      // security: delete pw from db
      delete updatedData.password
      delete updatedData.confirmPassword
      await setDoc(doc(db, 'users', res.user.uid), updatedData)
      dispatch(setLoginChange(!signUpChange))
      navigate('/')
      setIsSubmiting(false)
    } catch (error) {
      setIsSubmiting(false)
      const errorCode = error.code
      const errorMessage = error.message
    }
  }

  const handleInput = (e) => {
    const { id, value } = e.target

    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleImgUpload = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
  }

  function handleAlert(text) {
    setShowAlert(true)
    setAlertText(text)
    setTimeout(() => {
      setShowAlert(false)
      setAlertText('')
    }, 2000)
  }

  return (
    <form onSubmit={handleSignUp} className="access-form">
      <SectionHeader text={`signup`} />
      {showAlert && <PageAlert text={alertText} alertStyle={'signin'} />}

      <div className="access-form-control">
        <label className="access-label" htmlFor="name">
          name
        </label>
        <input
          onChange={handleInput}
          type="text"
          className="access-input"
          id="name"
          value={name}
        />
      </div>
      <div className="access-form-control">
        <label className="access-label" htmlFor="email">
          email
        </label>
        <input
          onChange={handleInput}
          type="email"
          className="access-input"
          id="email"
          value={email}
        />
      </div>

      <div className="access-form-control">
        <label className="access-label" htmlFor="password" value={name}>
          password
        </label>
        <input
          onChange={handleInput}
          type="text"
          className="access-input"
          id="password"
          value={password}
        />
      </div>

      <div className="access-form-control">
        <label className="access-label" htmlFor="confirmpassword">
          confirm password
        </label>
        <input
          onChange={handleInput}
          type="text"
          className="access-input"
          id="confirmPassword"
          value={confirmPassword}
        />
      </div>
      <div className="access-form-control img-upload-div">
        <label className="access-label img-upload-label" htmlFor="confirmpassword">
          upload profile image
        </label>
        <input
          onChange={handleImgUpload}
          className="profile-img-input"
          type="file"
          name=""
          id=""
        />
      </div>
      <div className="access-form-control">
        <Link className="access-link" to="/signin">
          sign in
        </Link>
      </div>
      <div className="access-form-control access-btn-container">
        <button className="access-btn">signup</button>
      </div>
    </form>
  )
}

export default SignupForm
