import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBed, faBath, faBinoculars } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import DeletePropertyButton from './buttons/DeletePropertyButton'
import UpdatePropertyButton from './buttons/UpdatePropertyButton'
import { setpropIndex } from '../features/properties/propertiesSlice'
import { useDispatch } from 'react-redux'
import UpdateImgLoader from './loaders/UpdateImgLoader'

const ProfilePropertyCard = ({
  item,
  i,
  setShowDeleteAlert,
  imgLoading,
  handleImgLoad,
}) => {
  const dispatch = useDispatch()
  const data = item.data

  const handleDeleteAlert = (i) => {
    setShowDeleteAlert(true)
    dispatch(setpropIndex(i))
  }
  console.log(imgLoading)
  return (
    <div className="profile-prop-card">
      <div className="profile-inner-div profile-img-wrap">
        {imgLoading[i]?.finishedLoading === false && <UpdateImgLoader />}
        <img
          onLoad={() => handleImgLoad(i)}
          className="profile-img"
          src={data?.imgURLS[0]?.url}
          alt=""
          style={{ display: imgLoading[i]?.finishedLoading === true ? 'block' : 'none' }}
        />
        {imgLoading[i]?.finishedLoading === true && console.log(`Image ${i} loaded`)}
      </div>
      <div className="profile-inner-div">
        <p className="profile-card-address-p">{data.propName}</p>
        <div className="profile-icons-div">
          <span>
            {' '}
            <FontAwesomeIcon className="home-icon" icon={faBed} /> {data.bedrooms} beds
          </span>
          <span>
            {' '}
            <FontAwesomeIcon className="home-icon" icon={faBath} /> {data.bathrooms} baths
          </span>
        </div>
        <div className="profile-card-btn-container">
          <UpdatePropertyButton i={i} item={item} />
          <button onClick={() => handleDeleteAlert(i)} className="delete-prop-btn">
            delete
          </button>
          <Link to={`/manage/${item.id}`} className="update-prop-btn">
            photos
          </Link>
          <Link to={`/property-details/${item.id}`} className="update-prop-btn">
            view
          </Link>
        </div>
      </div>

      <div className="profile-views-div">
        <span>
          <FontAwesomeIcon icon={faBinoculars} />
        </span>
        <span>{data.views}</span>
      </div>
    </div>
  )
}

export default ProfilePropertyCard
