import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../firebase-config'
import PropertyCard from '../layout/PropertyCard'

// alt-way
// const propTypeParam = searchParams.get('propType') === '' ? 'all' : searchParams.get('propType')

const SearchResultsPage = () => {
  const [listings, setListings] = useState(null)
  const location = useLocation()
  const [imgLoading, setImgLoading] = useState({})

  useEffect(() => {
    const getSearchData = async () => {
      const searchParams = new URLSearchParams(location.search)
      const locationParam = searchParams.get('location').toLowerCase() || ''
      const propTypeParam = searchParams.get('propType').toLowerCase() || ''
      const from = searchParams.get('from')

      // ** if search origin from nav nav bar **
      if (from === 'nav') {
        const results = []
        const querySnapshot = await getDocs(collection(db, 'listings'))
        querySnapshot.forEach((doc) => {
          const data = doc.data()

          // prettier-ignore
          if (
            (data.location.toLowerCase().includes(locationParam) || data.tags.some((tag) => tag.toLowerCase().includes(locationParam))) &&
            locationParam.trim() !== ''
          ) {
            results.push({ id: doc.id, data: data })
          }
        })
        setListings(results)

        // handle image loading state
        const imgLoadState = setLoadingState(results)
        setImgLoading(imgLoadState)
        return
      }

      // ** if from home search form **
      const q = query(collection(db, 'listings'))
      const querySnapshot = await getDocs(q)
      const results = []
      // prettier-ignore
      querySnapshot.forEach((doc) => {
        const data = doc.data()

        // only get data if 'all' is selected and there is something in location
        if(propTypeParam === 'all' && locationParam !== '' && data.location.toLowerCase().includes(locationParam)){
          results.push({ id: doc.id, data: data })
          return
        }

        // only get data if location AND type is selected
        if(data.propertyType.toLowerCase() === propTypeParam && (data.location.toLowerCase().includes(locationParam) || data.tags.some((tag) => tag.toLowerCase().includes(locationParam)))  ){
          results.push({ id: doc.id, data: data })
        }
      })
      setListings(results)

      const imgLoadState = setLoadingState(results)
      setImgLoading(imgLoadState)
    }

    getSearchData()
  }, [location.search])

  function setLoadingState(data) {
    const loadingImgState = data.reduce((acc, _, index) => {
      acc[index] = { finishedLoading: false }
      return acc
    }, {})

    return loadingImgState
  }

  const handleImgLoad = (i) => {
    setImgLoading((prevState) => ({
      ...prevState,
      [i]: { finishedLoading: true },
    }))
  }

  return (
    <div className="search-body">
      <div className="search-results-page">
        {listings && listings.length < 1 ? (
          <div className="no-matching-prop-div">
            <p>no matching properties</p>
          </div>
        ) : (
          listings?.map((item, i) => (
            <PropertyCard
              key={item.id}
              item={item}
              imgLoading={imgLoading}
              handleImgLoad={handleImgLoad}
              i={i}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default SearchResultsPage
