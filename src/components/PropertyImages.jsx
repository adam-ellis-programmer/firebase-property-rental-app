import img from '../temp/images/properties/d1.jpg'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import UpdateImgLoader from './loaders/UpdateImgLoader'

const PropertyImages = () => {
  const { property } = useSelector((state) => state.property)
  const [imgLoading, setImgLoading] = useState({})

  const handleImageLoad = (i) => {

    setImgLoading((prevState) => ({
      ...prevState,
      [i]: false,
    }))
  }

  return (
    <div className="property-images-container">
      {property &&
        property.imgURLS.map((item, i) => (
          <div className="prop-det-img-wrap" key={i}>
            {imgLoading[i] !== false && <UpdateImgLoader />}
            <img
              onLoad={() => handleImageLoad(i)}
              className="details-img"
              src={item.url}
              alt=""
              style={{ display: imgLoading[i] === false ? 'block' : 'none' }}
            />{' '}
          </div>
        ))}
    </div>
  )
}

export default PropertyImages
