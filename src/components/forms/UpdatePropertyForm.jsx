import { useState, useEffect } from 'react'
import { propertyTypeArr, amenitiesArr } from '../../utils'
import logo from '../../svgs/logo.svg'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase-config'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
// propDetails = property details
const UpdatePropertyForm = ({ propDetails, setIsSubmiting }) => {
  const [propID, setPropID] = useState('')
  const navigate = useNavigate()

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
    imgURLS,
    propertyOwner,
    featured,
    propertyDesc,
    propName,
    location,
    deposit,
    receptions,
    sqrFt,
  } = fieldsData

  useEffect(() => {
    if (propDetails) {
      setFieldsData({
        // merge default with updated data
        ...fieldsData,
        ...propDetails,
      })
    }

    setPropID(propDetails?.propertyID)
  }, [propDetails])

  const onMutate = (e) => {
    const { id, value } = e.target
    console.log(id)

    // Handle fields data
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsSubmiting(true)

      await setDoc(doc(db, 'listings', propID), fieldsData)

      setIsSubmiting(false)
      window.scrollTo(0, 0)

      navigate(`/property-details/${propID}`)
    } catch (error) {
      console.log(error)
      setIsSubmiting(false)
    }
  }

  return (
    <form className="form update-form" onSubmit={handleSubmit}>
      <Link to={`/property-details/${propID}`}>
        <img className="update-img-small" src={imgURLS && imgURLS[0]?.url} alt="" />
      </Link>

      {propDetails && propDetails.address}
      <p className="reg-p">update your property</p>

      <div className="reg-form-select-wrap">
        <label htmlFor="type" className="form-label">
          Property Type
        </label>
        <div className="prop-select-wrap">
          <select
            id="propertyType"
            name="propertyType"
            className="property-type-select"
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
      {/* CHANGE PROPNAME TO TITLE */}
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
            // min={0}
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
            // min={0}
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
            // min={0}
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
            // min={0}
            placeholder="0"
            value={nightly}
          />
        </div>
      </div>
      {/* end of div */}

      <div className="form-btn-container">
        <button className="form-btn">update</button>
      </div>
      <img className="form-logo" src={logo} alt="" />
    </form>
  )
}

export default UpdatePropertyForm
