import { useEffect, useState } from 'react'
import UseAuthCheck from '../hooks/UseAuthCheck'
import { ownerListings, fetchUser } from '../features/properties/propertiesAction'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UpdateProfileImg from '../components/buttons/UpdateProfileImg'
import PageLoader from '../components/loaders/PageLoader'
import UpdateImgLoader from '../components/loaders/UpdateImgLoader'
import SectionHeader from '../layout/SectionHeader'
import DeleteAccountModal from '../components/modals/DeleteAccountModal'

const MyAccount = () => {
  const { messages } = useSelector((state) => state.property)
  const [userListings, setUserListings] = useState(null)
  const [userData, setUserData] = useState(null)
  const [firstImgUrls, setFirstImgUrls] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState({}) // State to track loading of each image
  const { loggedInUser } = UseAuthCheck()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true)
        if (loggedInUser) {
          const listingsRes = await ownerListings('listings', loggedInUser.uid)
          const usersRes = await fetchUser('users', loggedInUser.uid)
          setUserListings(listingsRes)
          setUserData(usersRes)

          const data = []
          const loadingState = {}
          if (listingsRes) {
            listingsRes.forEach((item, index) => {
              const itemData = {
                url: item.data.imgURLS[0]?.url,
                location: item.data.location,
                id: item.id,
              }
              data.push(itemData)

              loadingState[index] = { finishedLoading: false } // Initialize loading state for each image
            })
            setFirstImgUrls(data)

            setImgLoading(loadingState) // Set initial loading state
          }
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    getUserData()
  }, [loggedInUser])

  // on load set to true
  const handleImageLoad = (index) => {
    setImgLoading((prevState) => ({ ...prevState, [index]: { finishedLoading: true } }))
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="page-container my-account-container">
      {showModal && <DeleteAccountModal setShowModal={setShowModal} />}
      <div className="my-account-card">
        <div>
          <SectionHeader text={`your details`} />

          <div>
            <p className="account-p">
              <span>name:</span>
              <span>{loggedInUser?.displayName}</span>
            </p>
            <p className="account-p">
              <span>email:</span>
              <span>{loggedInUser?.email}</span>
            </p>
            <p className="account-p">
              <span>properties:</span>
              <span>{userListings?.length}</span>
            </p>
            <p className="account-p">
              <span>messages:</span>
              <span>{messages?.length}</span>
            </p>
            <p className="account-p">
              <span>bookmarked:</span>
              <span>{userData?.data?.bookmarked?.length}</span>
            </p>
          </div>
        </div>
        <div>
          <SectionHeader text={`your listed properties`} />
          {userListings?.length < 1 && !loading && (
            <div className="no-listings-div">no listings to show</div>
          )}
          {/* hide and display img / loader based on boolean */}
          {/* prettier-ignore */}
          <div className="account-grid">
            {firstImgUrls &&
              firstImgUrls.map((item, i) => (
                <Link key={i} to={`/property-details/${item.id}`}>
                  <div className="account-prop-img-small-div">
                    {/* display the loader until finishedLoading is set to false */}
                    {imgLoading[i].finishedLoading !== true && <UpdateImgLoader />}
                    <img
                      className="acc-small-prop-img"
                      src={item?.url}
                      alt=""

                      onLoad={() => handleImageLoad(i)}
                      style={{display: imgLoading[i]?.finishedLoading === true ? 'block' : 'none',
                      }} // Hide the image until it loads
                    />
                    <p className="small-img-p">{item?.location.slice(0, 5) + '...'}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        <div className="acc-btn-container">
          <UpdateProfileImg loggedInUser={loggedInUser} />
          <button onClick={() => setShowModal(true)} className="delete-acc-btn">
            delete-account
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyAccount
