import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import {
  faLocationDot,
  faBed,
  faBath,
  faRuler,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import UseAuthCheck from '../hooks/UseAuthCheck'
import { fetchUser } from '../features/properties/propertiesAction'
import UpdateImgLoader from '../components/loaders/UpdateImgLoader'
const PropertyCard = ({ item, imgLoading, handleImgLoad, i }) => {
  const [bookmarkedData, setBookmarkedData] = useState(null)
  const { loggedInUser } = UseAuthCheck()

  useEffect(() => {
    const getData = async () => {
      if (loggedInUser) {
        const resUser = await fetchUser('users', loggedInUser.uid)

        setBookmarkedData(resUser?.data?.bookmarked)
      }
    }

    getData()
    return () => {}
  }, [loggedInUser])
  const { propName, propertyType, bathrooms, bedrooms, location } = item.data

  return (
    <div className="home-recent-grid">
      <div className="home-recent-div profile-img-div">
        <img
          onLoad={() => handleImgLoad(i)}
          className="home-img-recent"
          src={item?.data?.imgURLS[0]?.url}
          alt=""
          style={{
            display:
              imgLoading && imgLoading[i]?.finishedLoading === true ? 'block' : 'none',
          }}
        />
        {/* keep for de-bugging  */}
        {/* de-bugging line */}
        {/* {imgLoading &&
          imgLoading[i]?.finishedLoading === true &&
          console.log(`Image ${i} loaded`)} */}

        {imgLoading && imgLoading[i]?.finishedLoading === false && <UpdateImgLoader />}
        {bookmarkedData && bookmarkedData.includes(item.id) && (
          <div className="bookmarked-icon-div">
            <FontAwesomeIcon className="bookmark-icon" icon={faBookmark} />
          </div>
        )}
      </div>
      <div className="home-recent-div ">
        <div className="featured-inner-div prop-card-dets">
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
            <Link to={`/property-details/${item.id}`} className="feat-btn">
              details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
