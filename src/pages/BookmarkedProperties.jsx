import { useEffect, useState } from 'react'
import PageHeader from '../layout/PageHeader'
import { fetchUser } from '../features/properties/propertiesAction'

import { collection } from 'firebase/firestore'
import { db } from '../firebase-config'
import { query, where, getDocs } from 'firebase/firestore'

import BookmarkdedCard from '../layout/BookmarkdedCard'
import PageLoader from '../components/loaders/PageLoader'
import UseAuthCheck from '../hooks/UseAuthCheck'

const BookmarkedProperties = () => {
  const { loggedInUser } = UseAuthCheck()
  const [bookmarkedImgLoading, setBookmarkedImgLoading] = useState({})
  const [userId, setUserId] = useState(null)
  const [bookmarkedIds, setBookmarkedIds] = useState(null)
  const [bookmarkedData, setBookmarkedData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      if (loggedInUser) {
        try {
          const user = await fetchUser('users', loggedInUser.uid)
          console.log(user.data)
          setUserId(user.id)
          setBookmarkedIds(user.data.bookmarked) // || []

          if (bookmarkedIds && bookmarkedIds.length > 0) {
            // bookmarded data
            const bmData = []
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, where('propertyID', 'in', bookmarkedIds))

            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
              // console.log(doc.id, ' => ', doc.data())
              bmData.push(doc.data())
            })
            setBookmarkedData(bmData) // Update state with fetched data
            const bookmarkedLoadingState = bmData.reduce((acc, _, i) => {
              acc[i] = { finishedLoading: false }
              return acc
            }, {})
            setBookmarkedImgLoading(bookmarkedLoadingState)

            setLoading(false)
          }
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
    }
    getData()
    return () => {}
  }, [loggedInUser, userId])

  console.log(bookmarkedData)
  if (loading) {
    return <PageLoader />
  }

  const handleImgLoad = (i) => {
    setBookmarkedImgLoading((prevState) => ({
      ...prevState,
      [i]: { finishedLoading: true },
    }))
  }

  return (
    <>
      <div className="bookmark-page">
        <PageHeader text={`bookmarked properties`} />
        {!loading && bookmarkedData === null ? (
          <p className="no-bookmark-p">no bookmarked properties yet</p>
        ) : (
          <div className="page-container bookmarked-container">
            {bookmarkedData &&
              bookmarkedData.map((property, i) => (
                <BookmarkdedCard
                  bookmarkedImgLoading={bookmarkedImgLoading}
                  handleImgLoad={handleImgLoad}
                  i={i}
                  key={i}
                  item={property}
                />
              ))}
          </div>
        )}
      </div>
    </>
  )
}

export default BookmarkedProperties
