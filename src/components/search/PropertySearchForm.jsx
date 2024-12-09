import { propertyTypeArr } from '../../utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageAlert from '../alerts/PageAlert'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronDown, faTag } from '@fortawesome/free-solid-svg-icons'
const PropertySearchForm = ({ page = {}, setShowAlert }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    location: '',
    propType: 'all',
  })

  const { propType, location } = formData
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (location === '') {
      handleAlert()
      return
    }

    const data = {
      ...formData,
    }

    const params = new URLSearchParams(data).toString()
    navigate(`/search?${params}`)
    console.log(data)
  }

  function handleAlert() {
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 2000)
  }
  return (
    <form onSubmit={handleSubmit} className="home-search-form">
      <input
        className={`home-search-input ${page.from === 'all' && 'no-border'}`}
        type="text"
        id="location"
        placeholder="location / tag"
        onChange={handleChange}
      />
      <div className="add-property-select-wrap">
        <select
          id="propType"
          name="type"
          className={`home-search-input ${page.from === 'all' && 'no-border'}`}
          required=""
          value={propType}
          onChange={handleChange}
        >
          <option value={'all'}>{'all'}</option>
          {propertyTypeArr.slice(1).map((item) => (
            <option key={item.name} value={item.name.toLowerCase()}>
              {item.name.toLocaleLowerCase()}
            </option>
          ))}
        </select>
        <FontAwesomeIcon
          className="select-chev add-prop-chev"
          icon={faCircleChevronDown}
        />
      </div>
      <button className="home-search-btn">search</button>
    </form>
  )
}

export default PropertySearchForm
