import { amenitiesArr, propertyTypeArr } from '../../utils'
import { useEffect, useState } from 'react'
import logo from '../../svgs/logo.svg'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase-config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import PageLoader from '../../components/loaders/ButtonLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleChevronDown,
  faTag,
  faCirclePlus,
} from '@fortawesome/free-solid-svg-icons'
const AddNewProperty = () => {
  const navigate = useNavigate()
  const [isDisabled, setIsDisabled] = useState(false)
  const [files, setFiles] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user)
      } else {
        setLoggedInUser(null)
      }
    })
    return () => {}
  }, [])

  const [tags, setTags] = useState([])
  const [fieldsData, setFieldsData] = useState({
    listType: 'rent',
    propertyType: '',
    propertyDesc: '',
    parking: false,
    furnished: false,
    garden: false,
    offer: false,
    bedrooms: '',
    bathrooms: '',
    weekly: '',
    monthly: '',
    nightly: '',
    address: '',
    amenities: [],
    imgURLS: [],
    featured: false,
    propertyOwner: '',
    propName: '',
    location: '',
    deposit: '',
    receptions: '',
    sqrFt: '',
    tag: '',
  })
  const {
    listType,
    parking,
    furnished,
    garden,
    offer,
    bedrooms,
    bathrooms,
    address,
    weekly,
    monthly,
    nightly,
    propertyType,
    featured,
    propertyDesc,
    propName,
    location,
    deposit,
    receptions,
    sqrFt,
    tag,
  } = fieldsData
  const onMutate = (e) => {
    const { id, value } = e.target
    // console.log(id)

    // Handle empty string for bedrooms
    const newValue =
      id === 'bedrooms' || id === 'bathrooms'
        ? value === ''
          ? ''
          : isNaN(value)
          ? 0
          : parseInt(value.slice(0, 2))
        : value === 'true'
        ? true
        : value === 'false'
        ? false
        : value

    setFieldsData((prevState) => ({
      ...prevState,
      [id]: newValue,
    }))
  }

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files
    console.log(selectedFiles)
    setFiles(selectedFiles)
  }

  const uploadImg = (filePath, file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage()

      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: 'image/jpeg',
      }

      // Upload file and metadata
      const fullPath = `${filePath}/${file.name}--${crypto.randomUUID().slice(0, 5)}`
      const storageRef = ref(storage, fullPath)
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
            console.log('File available at', downloadURL)
            const filePathData = { url: downloadURL, fullPath }
            resolve(filePathData)
          })
        }
      )
    })
  }

  // prettier-gnore
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('lasdl;fja;slfjlas;fjl')
    try {
      if (propertyType === '' || location == '' || address == '' || propertyDesc == '') {
        setShowAlert(true)
        setTimeout(() => {
          setShowAlert(false)
        }, 3000)
        console.log('please enter all fields')
        return
      }
      setIsDisabled(true)

      const data = {
        ...fieldsData,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        deposit: parseInt(deposit) || 0,
        receptions: parseInt(receptions) || 0,
        sqrFt: parseInt(sqrFt) || 0,
        propertyOwner: loggedInUser.uid,
        imgURLS: '',
        views: 0,
        tags,
        reactions: {
          thumbsUp: 0,
          heart: 0,
          smile: 0,
          laugh: 0,
          surprised: 0,
        },
      }

      const docRef = await addDoc(collection(db, 'listings'), data)
      const filePath = `property-images/${loggedInUser.uid}/${docRef.id}`

      const returnedImageUrls = await Promise.all(
        [...files].map((img) => uploadImg(filePath, img))
      )

      const listingRef = doc(db, 'listings', docRef.id)
      await updateDoc(listingRef, {
        imgURLS: returnedImageUrls,
        propertyID: docRef.id,
      })

      console.log(docRef)
      navigate(`/property-details/${docRef.id}`)
      setIsDisabled(false)
    } catch (error) {
      setIsDisabled(false)
      console.log(error)
    }
  }

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target
    const updatedAmenities = [...fieldsData.amenities]

    if (checked) {
      updatedAmenities.push(value)
    } else {
      const index = updatedAmenities.indexOf(value)
      index !== -1 && updatedAmenities.splice(index, 1)
    }

    setFieldsData((prevState) => ({
      ...prevState,
      amenities: updatedAmenities,
    }))
  }

  const handleCheckAll = () => {
    const amenities = [...fieldsData.amenities]

    for (let i = 0; i < amenitiesArr.length; i++) {
      const element = amenitiesArr[i].name
      // prevent duplicates
      !amenities.includes(element) && amenities.push(element)
    }

    setFieldsData((prevState) => ({
      ...prevState,
      amenities: amenities,
    }))

    // uncheck all functionality
    if (fieldsData.amenities.length === amenitiesArr.length) {
      setFieldsData((prevState) => ({
        ...prevState,
        amenities: [],
      }))
    }
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    const tagName = tag.trim()
    if (tagName && !tags.includes(tag) && tags.length < 8) {
      setTags((prevTags) => [...prevTags, tag])
      setFieldsData((prevData) => ({ ...prevData, tag: '' }))
      console.log('added')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const tagName = tag.trim()
      if (tagName && !tags.includes(tag) && tags.length < 8) {
        setTags((prevTags) => [...prevTags, tag])
        setFieldsData((prevData) => ({ ...prevData, tag: '' }))
      }
    }
  }

  const handleDeleteTag = (e, tagToDelete) => {
    console.log(tagToDelete)
    setTags((prevState) => prevState.filter((tag) => tag !== tagToDelete))
  }
  return (
    <form className="form register-form" onSubmit={handleSubmit}>
      <p className="reg-p">register your property</p>
      <div className="reg-form-select-wrap">
        <label htmlFor="type" className="form-label">
          Property Type
        </label>
        <div className="prop-select-wrap">
          <select
            id="propertyType"
            name="propertyType"
            className="property-type-select"
            required=""
            value={propertyType}
            onChange={onMutate}
          >
            {propertyTypeArr.map((item, i) => (
              <option key={i} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <FontAwesomeIcon className="select-chev" icon={faCircleChevronDown} />
        </div>
      </div>

      <div className="reg-form-switch-div">
        <label className="form-label" htmlFor="">
          for sale / rent
        </label>
        <div>
          <button
            onClick={onMutate}
            type="button"
            id="listType"
            value="sale"
            className={`${listType === 'sale' && 'formButtonActive '} reg-form-button`}
          >
            sale
          </button>
          <button
            onClick={onMutate}
            type="button"
            id="listType"
            value="rent"
            className={`${listType === 'rent' && 'formButtonActive '} reg-form-button`}
          >
            rent
          </button>
        </div>
      </div>
      {/* end of div */}

      <div className="reg-form-switch-div">
        <label className="form-label" htmlFor="">
          parking space
        </label>
        <div>
          <button
            onClick={onMutate}
            type="button"
            id="parking"
            value={true}
            className={`${parking && 'formButtonActive '} reg-form-button`}
          >
            yes
          </button>
          <button
            onClick={onMutate}
            type="button"
            id="parking"
            value={false}
            className={`${!parking && 'formButtonActive '} reg-form-button`}
          >
            no
          </button>
        </div>
      </div>
      {/* end of div */}

      <div className="reg-form-switch-div">
        <label className="form-label" htmlFor="">
          furnished
        </label>
        <div>
          <button
            onClick={onMutate}
            type="button"
            id="furnished"
            value={true}
            className={`${furnished && 'formButtonActive '} reg-form-button`}
          >
            yes
          </button>
          <button
            onClick={onMutate}
            type="button"
            id="furnished"
            value={false}
            className={`${!furnished && 'formButtonActive '} reg-form-button`}
          >
            no
          </button>
        </div>
      </div>
      {/* end of div */}

      <div className="reg-form-switch-div">
        <label className="form-label" htmlFor="">
          garden
        </label>
        <div>
          <button
            onClick={onMutate}
            type="button"
            id="garden"
            value={true}
            className={`${garden && 'formButtonActive '} reg-form-button`}
          >
            yes
          </button>
          <button
            onClick={onMutate}
            type="button"
            id="garden"
            value={false}
            className={`${!garden && 'formButtonActive '} reg-form-button`}
          >
            no
          </button>
        </div>
      </div>
      {/* end of div */}

      <div className="reg-form-switch-div">
        <label className="form-label" htmlFor="">
          offer
        </label>
        <div>
          <button
            onClick={onMutate}
            type="button"
            id="offer"
            value={true}
            className={`${offer && 'formButtonActive '} reg-form-button`}
          >
            yes
          </button>
          <button
            onClick={onMutate}
            type="button"
            id="offer"
            value={false}
            className={`${!offer && 'formButtonActive '} reg-form-button`}
          >
            no
          </button>
        </div>
      </div>

      {/* end of div */}
      <div className="reg-form-switch-div">
        <label className="form-label" htmlFor="">
          featured
        </label>
        <div>
          <button
            onClick={onMutate}
            type="button"
            id="featured"
            value={true}
            className={`${featured && 'formButtonActive '} reg-form-button`}
          >
            yes
          </button>
          <button
            onClick={onMutate}
            type="button"
            id="featured"
            value={false}
            className={`${!featured && 'formButtonActive '} reg-form-button`}
          >
            no
          </button>
        </div>
      </div>
      {/* end of div */}

      <div className="reg-form-buttons-div">
        <div className="reg-form-number-wrap">
          <label className="l form-input-label" htmlFor="">
            bedrooms
          </label>
          <input
            onChange={onMutate}
            id="bedrooms"
            className="reg-form-num-input"
            type="number"
            min={0}
            placeholder="0"
            value={bedrooms}
          />
        </div>
        <div className="reg-form-number-wrap">
          <label className="form-input-label" htmlFor="">
            bathrooms
          </label>
          <input
            onChange={onMutate}
            id="bathrooms"
            className="reg-form-num-input"
            type="number"
            min={0}
            placeholder="0"
            value={bathrooms}
          />
        </div>
        <div className="reg-form-number-wrap">
          <label className="form-input-label" htmlFor="">
            receptions
          </label>
          <input
            onChange={onMutate}
            id="receptions"
            className="reg-form-num-input"
            type="number"
            min={0}
            placeholder="0"
            value={receptions}
          />
        </div>
        <div className="reg-form-number-wrap">
          <label className="form-input-label" htmlFor="">
            sqrFt
          </label>
          <input
            onChange={onMutate}
            id="sqrFt"
            className="reg-form-num-input"
            type="number"
            min={0}
            placeholder="0"
            value={sqrFt}
          />
        </div>
      </div>
      {/* end of div */}
      <div className="reg-form-buttons-div">
        <textarea
          onChange={onMutate}
          className="form-text-area-name"
          id="location"
          placeholder="property location"
          value={location}
        />
      </div>
      {/* prop name = property name  */}
      <div className="reg-form-buttons-div">
        <textarea
          onChange={onMutate}
          className="form-text-area-name"
          id="propName"
          placeholder="property title"
          value={propName}
        />
      </div>
      {/* end of div */}
      <div className="reg-form-buttons-div">
        <textarea
          onChange={onMutate}
          className="form-text-area"
          id="address"
          placeholder="address"
          value={address}
        />
      </div>
      {/* end of div */}
      <div className="reg-form-buttons-div">
        <textarea
          onChange={onMutate}
          className="form-text-area"
          id="propertyDesc"
          placeholder="description"
          value={propertyDesc}
        />
      </div>
      {/* end of div */}

      <p className="amenities-form-p">amenities</p>
      <div className="reg-form-check-all-div">
        <button type="button" onClick={handleCheckAll} className="reg-check-all-btn">
          check all
        </button>
      </div>
      <ul className="form-buttons-dreg-iv  amenities-ul">
        {amenitiesArr.map((item, i) => (
          <li key={i} className="amenities-li">
            <label className="amenities-label" htmlFor={item.name}>
              <input
                type="checkbox"
                id={item.name}
                name="amenities"
                value={item.name}
                className="amenities-checkbox"
                checked={fieldsData.amenities.includes(item.name)}
                onChange={handleAmenitiesChange}
              />
              <span>{item.name}</span>
            </label>
          </li>
        ))}
      </ul>

      <div>
        <div className="reg-form-number-wrap">
          <label className=" form-input-label" htmlFor="">
            deposit
          </label>
          <input
            onChange={onMutate}
            id="deposit"
            className="reg-form-num-input deposit-input"
            type="number"
            min={0}
            placeholder="0"
            value={deposit}
          />
        </div>
      </div>
      <div className="reg-form-buttons-div">
        <div className="reg-form-number-wrap">
          <label className=" form-input-label" htmlFor="">
            weekly
          </label>
          <input
            onChange={onMutate}
            id="weekly"
            className="reg-form-num-input"
            type="number"
            min={0}
            placeholder="0"
            value={weekly}
          />
        </div>
        <div className="reg-form-number-wrap">
          <label className=" form-input-label" htmlFor="">
            monthly
          </label>
          <input
            onChange={onMutate}
            id="monthly"
            className="reg-form-num-input"
            type="number"
            min={0}
            placeholder="0"
            value={monthly}
          />
        </div>

        <div className="reg-form-number-wrap">
          <label className="form-input-label" htmlFor="">
            nightly
          </label>
          <input
            onChange={onMutate}
            id="nightly"
            className="reg-form-num-input"
            type="number"
            min={0}
            placeholder="0"
            value={nightly}
          />
        </div>
      </div>
      {/* end of div */}

      <div className="form-images-input-container">
        <p className="form-img-p">select up to 8 images</p>
        <input
          onChange={handleFileChange}
          className="img-upload-input"
          type="file"
          name=""
          id=""
          multiple={true}
        />
      </div>
      <p className="prop-tags-p">
        tags <FontAwesomeIcon className="tag-icon" icon={faTag} />{' '}
      </p>
      <div className="form-tags-container">
        <ul className="form-tags-ul">
          {tags &&
            tags.map((tag, i) => (
              <li key={i} className="form-tags-li">
                <p className="form-tag-p">{tag}</p>
                <button
                  onClick={(e) => handleDeleteTag(e, tag)}
                  className="form-tag-delete-btn"
                  type="button"
                >
                  x
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div className="form-tag-input-container">
        <input
          type="text"
          className="form-text-area-name form-tags-input"
          placeholder="enter tags"
          value={tag}
          id="tag"
          onChange={onMutate}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAddTag} className="add-tag-btn">
          <FontAwesomeIcon className="add-tag-icon" icon={faCirclePlus} />
        </button>
      </div>

      {tags.length >= 8 && <p>maximum amount of tags reached!</p>}

      <div className="form-btn-container">
        {showAlert && <div className="small-form-alert">Please fill in all fields</div>}
        <button disabled={isDisabled} className="form-btn reg-btn">
          {isDisabled ? (
            <>
              <span className="creating-prop-span">creating...</span>
              <PageLoader />
            </>
          ) : (
            'register'
          )}
        </button>
      </div>
      <img className="form-logo" src={logo} alt="" />
    </form>
  )
}

export default AddNewProperty
