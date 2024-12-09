import React from 'react'

const SearchTags = ({ property, i }) => {
  return (
    <div className="search-tags-container">
      {property &&
        property.tags.map((tag, i) => (
          <span key={i} className="property-tag">
            {tag}
          </span>
        ))}
    </div>
  )
}

export default SearchTags
