import React from 'react'
import SectionHeader from '../layout/SectionHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { formatPrice } from '../utils'
// prettier-ignore
const PropertyDetailsMain = () => {
  const { property } = useSelector((state) => state.property)

  return (
    <div className="property-details-top-div">
      <div>
        <SectionHeader text={`property details`} />
        <p className="details-p">{property?.propName}</p>
        <p className="details-p">{property?.address}</p>
        <p className="details-p">{property?.propertyType}</p>
      </div>

      <div>
        <SectionHeader text={`rates and options`} />
        <div className="rent-time-div">
          {property?.nightly === '' ? (
            <><span>nightly:</span> <span><FontAwesomeIcon className="x-icon" icon={faXmark} /></span></>) : (<><span>nightly:</span> <span> £{property?.nightly}</span></>)}
        </div>
        <div className="rent-time-div">
          {property?.weekly === '' ? (
            <><span>weekly:</span> <span><FontAwesomeIcon className="x-icon" icon={faXmark} /></span></>) : (<><span>weekly:</span> <span> {formatPrice(property?.weekly)}</span></>)}
        </div>
        <div className="rent-time-div">
          {property?.monthly === '' ? (
            <><span>monthly:</span> <span><FontAwesomeIcon className="x-icon" icon={faXmark} /></span></>) : (<><span>monthly:</span> <span> {formatPrice(property?.monthly)}</span></>)}
        </div>
        <div className="rent-time-div">
          {property?.deposit === '' ? (
            <><span>deposit:</span> <span><FontAwesomeIcon className="x-icon" icon={faXmark} /></span></>) : (<><span>deposit:</span> <span> {formatPrice(property?.deposit)}</span></>)}
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailsMain
