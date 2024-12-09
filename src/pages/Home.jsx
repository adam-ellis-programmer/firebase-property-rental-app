import { useEffect, useState } from 'react'
import SectionHeader from '../layout/SectionHeader'
import a2 from '../temp/images/properties/a2.jpg'
import a3 from '../temp/images/properties/a3.jpg'
import FeaturedCard from '../layout/FeaturedCard'
import PropertyCard from '../layout/PropertyCard'
import PropertySearchForm from '../components/search/PropertySearchForm'
import { fetchFeatured, fetchRecent } from '../features/properties/propertiesAction'
import PageLoader from '../components/loaders/PageLoader'
import PageAlert from '../components/alerts/PageAlert'
import { useDispatch } from 'react-redux'

const Home = () => {
  const dispatch = useDispatch()
  const [imgLoading, setImgLoading] = useState({})
  const [imgFeaturedLoading, setImgFeaturedLoading] = useState({})
  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState(null)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const feat = await fetchFeatured('listings')
        const recent = await fetchRecent('listings')

        // 1: Randomize the recent array
        const randomRecent = recent.sort(() => Math.random() - Math.random()).slice(0, 3)

        // 2: Initialize loading state based on the randomized array
        const loadingImgState = randomRecent.reduce((acc, _, index) => {
          acc[index] = { finishedLoading: false }
          return acc
        }, {})

        const featLoadingImgState = Array.from(feat, (_, index) => {
          const loadedState = (index = { finishedLoading: false })
          return loadedState
        })

        setFeatured(feat)
        setRecent(randomRecent)

        setImgLoading(loadingImgState)
        setImgFeaturedLoading(featLoadingImgState)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    getData()
  }, [dispatch])

  const handleImgLoad = (i) => {
    setImgLoading((prevState) => ({
      ...prevState,
      [i]: { finishedLoading: true },
    }))
  }

  const handleFeatImgLoad = (i) => {
    setImgFeaturedLoading((prevState) => ({
      ...prevState,
      [i]: { finishedLoading: true },
    }))
  }

  if (loading) {
    return <PageLoader />
  }


  const test = process.env.REACT_APP_TEST

  return (
    <div className="home-wrap">
      <section className="home-search-section">
        <div className="home-top-grid-item">
          <img className="home-top-img" src={a2} alt="" />
        </div>
        <div className="test">
          <h3 className="home-section-h3">find the perfect rental</h3>
          <p className="home-section-p">
            Discover the perfect property that suits your needs.
          </p>
          {showAlert && (
            <div className="alert-holding-div">
              <PageAlert text={`please include a location`} alertStyle={'home-page'} />
            </div>
          )}
          <div className="home-search-div">
            <PropertySearchForm setShowAlert={setShowAlert} />
          </div>
        </div>
        <div className="home-top-grid-item">
          <img className="home-top-img" src={a3} alt="" />
        </div>
      </section>

      <section className="featured-properties-section">
        <SectionHeader text={`featured properties`} />
        <div className="featured-grid">
          {featured &&
            featured.map((item, i) => (
              <FeaturedCard
                i={i}
                handleFeatImgLoad={handleFeatImgLoad}
                key={item.id}
                item={item}
                imgFeaturedLoading={imgFeaturedLoading}
              />
            ))}
        </div>
      </section>

      <section className="recent-properties-section">
        <div className="recent-section-container">
          <SectionHeader text={`recent properties`} />

          <div className="recent-featured-grid">
            {recent &&
              recent.map((item, i) => (
                <PropertyCard
                  imgLoading={imgLoading}
                  setImgLoading={setImgLoading}
                  key={item.id}
                  item={item}
                  handleImgLoad={handleImgLoad}
                  i={i}
                />
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
