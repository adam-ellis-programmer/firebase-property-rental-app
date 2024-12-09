import React from 'react'

const PropertyDetailsLoader = () => {
  return (
    <div className="prop-details-loader-wrap">
      <div className="details-img-holder loading-frame"></div>
      <div className="details-grid-holder">
        <div>
          <p className="loading-frame">lorem</p>
          <p className="loading-frame">lorem</p>
          <p className="loading-frame">lorem</p>
          <p className="loading-frame">lorem</p>
          <p className="loading-frame">lorem</p>

          <div className="loading-frame loding-frame-box"></div>
          <div className="loading-frame loding-frame-box"></div>
          <div className="loading-frame loding-frame-box"></div>
        </div>
        <div>
          <div className="loading-frame loding-frame-form"></div>
          <div className="loading-frame loding-frame-form"></div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailsLoader
