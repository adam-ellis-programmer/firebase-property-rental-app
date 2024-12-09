import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Amenities from '../components/Amenities'
import BookMarkProperty from '../components/BookMarkPropertyButton'
import DetailsAndDescription from '../components/DetailsAndDescription'
import PropertyDetailsMain from '../components/PropertyDetailsMain'
import PropertyImages from '../components/PropertyImages'
import ContactForm from '../components/forms/ContactForm'

import { Link } from 'react-router-dom'

import { fetchProperty } from '../features/properties/propertiesAction'
import { setProperty } from '../features/properties/propertiesSlice'
import { useDispatch, useSelector } from 'react-redux'
import UseAuthCheck from '../hooks/UseAuthCheck'
import PropertyDetailsLoader from '../components/loaders/PropertyDetailsLoader'
import UpdateImgLoader from '../components/loaders/UpdateImgLoader'
import { formatPrice } from '../utils'
import { updateViews } from '../features/properties/propertiesAction'
import PropertyMap from '../components/PropertyMap'
import SearchTags from '../components/SearchTags'
import LikesBar from '../components/LikesBar'
const PropertyDetails = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [HeroIMGLoading, setHeroIMGLoading] = useState(false)
  const { loggedInUser } = UseAuthCheck()
  // console.log(loggedInUser)
  const dispatch = useDispatch()
  const { property } = useSelector((state) => state.property)

  const { id } = useParams()

  useEffect(() => {
    let updateCancelled = false

    window.scrollTo(0, 0)
    const getData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchProperty('listings', id)
        if (res) {
          const viewCount = res.data.views + 1
          const updateData = async () => {
            await updateViews(id, viewCount)
          }
          // update views in the database ONLY after the user has spent minimum of eight seconds on the page
          setTimeout(() => {
            if (updateCancelled === false) {
              updateData()
            }
          }, 8000)
          dispatch(setProperty(res.data))
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }

    getData()
    return () => {
      updateCancelled = true
    }
  }, [])

  if (isLoading) {
    return <PropertyDetailsLoader />
  }

  return (
    <div className="details-page">
      <section className="property-details-header">
        {HeroIMGLoading === false && <UpdateImgLoader />}
        <img
          onLoad={() => setHeroIMGLoading(true)}
          className="property-details-hero"
          src={property?.imgURLS[0]?.url}
          alt=""
        />

        {loggedInUser && loggedInUser?.uid === property.propertyOwner && (
          <Link
            className="details-page-updte-btn"
            to={`/update?${new URLSearchParams({ id })}`}
          >
            update
          </Link>
        )}
      </section>

      <section className="property-details-grid">
        <div className="property-details-main">
          <SearchTags property={property} />
          <PropertyDetailsMain />
          <DetailsAndDescription />
          <Amenities />
          <div className="map-outer-wrapper">
            <PropertyMap property={property} />
          </div>
          <PropertyImages />
        </div>
        <aside className="property-details-aside">
          {loggedInUser ? (
            <BookMarkProperty />
          ) : (
            <div className="sign-in-details-btn-wrap">
              <Link className="sign-in-details-btn" to={`/signin`}>
                log in to message owner
              </Link>
            </div>
          )}
          <ContactForm />
          <LikesBar property={property} loggedInUser={loggedInUser} />
        </aside>
      </section>
    </div>
  )
}

export default PropertyDetails
