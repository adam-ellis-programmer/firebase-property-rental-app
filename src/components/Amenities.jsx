import React from 'react'
import SectionHeader from '../layout/SectionHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { amenitiesArr } from '../utils'
import { useSelector } from 'react-redux'
// prettier-ignore
const Amenities = () => {
  const {property} = useSelector((state) => state.property)
  return (
    <div className="property-details-top-div">
      <SectionHeader text={`amenites`} />
      <ul className='details-amenities-grid' >
        {property?.amenities.map((item, i) =>(
        <li key={i} className="amenities-details-li">
            <span><FontAwesomeIcon className='amenities-check' icon={faCircleCheck} /></span>
            <span>{item}</span>
        </li>
        ))}

      </ul>
    </div>
  )
}

export default Amenities
