import { useState, useEffect, useRef } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { setDefaults, fromAddress } from 'react-geocode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import UpdateImgLoader from './loaders/UpdateImgLoader'
import PageLoader from './loaders/PageLoader'
const PropertyMap = ({ property }) => {
  // useRef to store the map instance and initial coordinates
  const mapRef = useRef(null)
  const initialCoords = useRef({ latitude: 0, longitude: 0 })

  // useState for lat, lng and loading state
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [loading, setLoading] = useState(true)
  const [noMapData, setNoMapData] = useState(false)

  // useState for viewport state
  const [viewPort, setViewPort] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
  })

  // Set default configurations for react-geocode
  setDefaults({
    key: process.env.REACT_APP_GOOGLE_GEO_CODE_KEY,
    language: 'en',
    region: 'es',
  })

  // useEffect to fetch coordinates based on property address
  useEffect(() => {
    const fetchCords = async () => {
      setLoading(true)
      try {
        const res = await fromAddress(property.address)
        const { lat, lng } = res.results[0].geometry.location
        setLat(lat)
        setLng(lng)
        if (res.results.length === 0) {
          setNoMapData(true)
          setLoading(false)
          return
        }
        console.log(res.results.length)
        setViewPort((prevViewPort) => ({
          ...prevViewPort,
          latitude: lat,
          longitude: lng,
        }))
        initialCoords.current = { latitude: lat, longitude: lng } // Store initial coordinates
        setLoading(false)
      } catch (error) {
        setNoMapData(true)
        setLoading(false)
        console.log(error)
      }
    }
    fetchCords()
  }, [property.address])

  // Function to reset the map view to the initial coordinates
  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [initialCoords.current.longitude, initialCoords.current.latitude],
        zoom: 12,
      })
    }
  }

  // Show loader while fetching coordinates
  if (noMapData) return <div className="no-location-data-div">no location data</div>
  if (loading) return <UpdateImgLoader />

  return (
    <>
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        initialViewState={viewPort}
        style={{ width: '100%', height: '500px', borderRadius: '10px' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        attributionControl={false}
        onLoad={(event) => {
          mapRef.current = event.target
        }} // Store the map instance in the ref
      >
        <NavigationControl />
        {lat !== null && lng !== null && (
          <Marker longitude={lng} latitude={lat} anchor="bottom">
            <FontAwesomeIcon className="map-loaction" icon={faLocationDot} />
          </Marker>
        )}
      </Map>
      <button onClick={handleReset} className="reset-map-btn">
        reset
      </button>
    </>
  )
}

export default PropertyMap
