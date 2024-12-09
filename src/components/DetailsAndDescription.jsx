import React from 'react'
import SectionHeader from '../layout/SectionHeader'
import { useSelector } from 'react-redux'
// prettier-ignore
const DetailsAndDescription = () => {
  const {property} = useSelector((state) => state.property)
  const formattedSquareFeet = new Intl.NumberFormat('en-US').format(property?.sqrFt)
  return (
    <div className="property-details-top-div">
      <div>
        <SectionHeader text={`desctiption and more details`} />
        <div className="rent-det-div">
          {' '}
          <span>bedrooms:</span> <span>{property?.bedrooms}</span>
        </div>
        <div className="rent-det-div">
          {' '}
          <span>bathrooms:</span> <span>{property?.bathrooms}</span>
        </div>
        <div className="rent-det-div">
          {' '}
          <span>square-foot:</span> <span>{formattedSquareFeet} sq ft</span>
        </div>
        <p className="prop-desc">{property?.propertyDesc}</p>
      </div>
    </div>
  )
}

export default DetailsAndDescription
