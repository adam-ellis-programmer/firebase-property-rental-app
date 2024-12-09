import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PageAlert from '../alerts/PageAlert'

const SmallSearchNavForm = ({ setIsNavOpen }) => {
  const [showAlert, setShowAlert] = useState(false)

  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()

    if (searchTerm === '') {
      handleAlert()
      return
    }
    const searchParams = new URLSearchParams({
      propType: '',
      location: searchTerm,
      from: 'nav',
    })

    setIsNavOpen(false)
    navigate(`/search?${searchParams}`)
    setSearchTerm('')
  }

  function handleAlert() {
    setShowAlert(true)
    setTimeout(() => {
      setShowAlert(false)
    }, 2000)
  }
  return (
    <>
      {showAlert && (
        <PageAlert text={`please include a location`} alertStyle={'danger-nav'} />
      )}
      <form onSubmit={handleSubmit} action="" className="small-search-form">
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          className="small-search-input"
          type="text"
          placeholder="search location / tag"
          value={searchTerm}
        />
        <button className="small-search-btn">go</button>
      </form>
    </>
  )
}

export default SmallSearchNavForm
