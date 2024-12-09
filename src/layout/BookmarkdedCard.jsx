import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faBed, faBath, faRuler } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import UpdateImgLoader from '../components/loaders/UpdateImgLoader'

const PropertyCard = ({ item, handleImgLoad, i, bookmarkedImgLoading }) => {

  const { propName, propertyType, bathrooms, bedrooms, location } = item
  return (
    <div className="home-recent-grid">
      <div className="home-recent-div">
        <img
          onLoad={() => handleImgLoad(i)}
          className="home-img-recent"
          src={item?.imgURLS[0]?.url}
          alt=""
          style={{
            display: bookmarkedImgLoading[i].finishedLoading === true ? 'block' : 'none',
          }}
        />
        {bookmarkedImgLoading[i].finishedLoading === false && <UpdateImgLoader />}
      </div>
      <div className="home-recent-div">
        <div className="featured-inner-div">
          <h3 className="featured-property-h3">{propName}</h3>
          <p className="featured-property-p">{propertyType}</p>
          <div className="featured-property-icons-div">
            <span>
              {' '}
              <FontAwesomeIcon className="home-icon" icon={faBed} /> {bedrooms} beds
            </span>
            <span>
              {' '}
              <FontAwesomeIcon className="home-icon" icon={faBath} /> {bathrooms} baths
            </span>
            <span>
              {' '}
              <FontAwesomeIcon className="home-icon" icon={faRuler} /> 3400 sqr ft
            </span>
          </div>

          <span className="location-span">
            <FontAwesomeIcon className="home-icon" icon={faLocationDot} /> {location}
          </span>

          <div className="feat-details-btn-container">
            <Link to={`/property-details/${item.propertyID}`} className="feat-btn">
              details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
