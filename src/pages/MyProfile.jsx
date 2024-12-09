import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'
import SectionHeader from '../layout/SectionHeader'
import ProfilePropertyCard from '../components/ProfilePropertyCard'
import { useDispatch, useSelector } from 'react-redux'
import { ownerListings } from '../features/properties/propertiesAction'
import DeletePropertyAlert from '../components/alerts/DeletePropertyAlert'
import { setListings } from '../features/properties/propertiesSlice'
import profile1 from '../temp/images/properties/profile-bg.webp'
import PageLoader from '../components/loaders/PageLoader'

const MyProfile = () => {
  const { listings } = useSelector((state) => state.property)
  const [userID, setUserID] = useState('')
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState({})
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.uid)
      } else {
        setUserID('')
      }
    })
  }, [])

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const data = await ownerListings('listings', userID)
        dispatch(setListings(data))

        const loadingState = data.reduce((acc, _, index) => {
          acc[index] = { finishedLoading: false }
          return acc
        }, {})
        setImgLoading(loadingState)

        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    if (userID) {
      getData()
    }
  }, [userID, dispatch])

  const handleImgLoad = (index) => {
    setImgLoading((prevState) => ({ ...prevState, [index]: { finishedLoading: true } }))
  }

  if (loading) {
    return <PageLoader />
  }
  console.log(imgLoading)
  return (
    <div className=" profile-bg">
      <img className="profile-bg-img" src={profile1} alt="" />
      <div className="profile-bg-overlay"></div>

      <section className="profile-header">
        <p className="profile-section-p">
          <span>view and manage your properties</span>
        </p>
      </section>

      <section className="profile-properties-section">
        <div>
          {listings && listings.length < 1 ? (
            <div className="no-data-div"> no items to show</div>
          ) : (
            showDeleteAlert && (
              <DeletePropertyAlert
                setShowDeleteAlert={setShowDeleteAlert}
                listings={listings}
              />
            )
          )}

          <div>
            {listings &&
              listings.map((item, i) => (
                <ProfilePropertyCard
                  key={item.id}
                  item={item}
                  i={i}
                  imgLoading={imgLoading}
                  handleImgLoad={handleImgLoad}
                  setShowDeleteAlert={setShowDeleteAlert}
                />
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MyProfile
