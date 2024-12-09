import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faBed, faBath, faRuler } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import UpdateImgLoader from '../components/loaders/UpdateImgLoader'
const FeaturedCard = ({ item, handleFeatImgLoad, i, imgFeaturedLoading }) => {
  const data = item.data
  return (
    <div className="featured-div">
      <div className="featured-inner-div">
        <img
          onLoad={() => handleFeatImgLoad(i)}
          className="home-img"
          src={item.data.imgURLS[0].url}
          alt=""
          style={{
            display:
              imgFeaturedLoading && imgFeaturedLoading[i]?.finishedLoading === true
                ? 'block'
                : 'none',
          }}
        />
        {imgFeaturedLoading[i].finishedLoading === false && <UpdateImgLoader />}
      </div>

      <div className="featured-inner-div">
        <h3 className="featured-property-h3">{data.propName}</h3>
        <p className="featured-property-p">cottage</p>
        <div className="featured-property-icons-div">
          <span>
            {' '}
            <FontAwesomeIcon className="home-icon" icon={faBed} /> {data.bedrooms} beds
          </span>
          <span>
            {' '}
            <FontAwesomeIcon className="home-icon" icon={faBath} /> {data.bathrooms} baths
          </span>
          <span>
            {' '}
            <FontAwesomeIcon className="home-icon" icon={faRuler} /> 3400 sqr ft
          </span>
        </div>

        <span className="location-span">
          <FontAwesomeIcon className="home-icon" icon={faLocationDot} /> {data.location}
        </span>

        <div className="feat-details-btn-container">
          <Link to={`/property-details/${item.id}`} className="feat-btn">
            details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturedCard
