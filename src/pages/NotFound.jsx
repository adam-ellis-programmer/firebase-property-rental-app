import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div>
        <p className='not-found-p' >oops something </p>
        <p className='not-found-p' >went wrong </p>
        <img
          className="not-found-img"
          src="https://firebasestorage.googleapis.com/v0/b/property-rental-1.appspot.com/o/utils%2F404.jpg?alt=media&token=48da54f0-ac17-4156-9a48-3c890f363084"
          alt="404"
        />
        <Link className="not-found-btn" to="/">
          back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
