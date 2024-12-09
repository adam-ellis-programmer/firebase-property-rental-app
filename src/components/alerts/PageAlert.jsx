import { useRef, useEffect } from 'react'

const PageAlert = ({ text, alertStyle }) => {
  const alertRef = useRef()
  useEffect(() => {
    const ref = alertRef.current
    ref.focus()
    return () => {}
  }, [alertRef])
  const primeCRL = '#f23005'

  const danger = {
    backgroundColor: primeCRL,
    color: '#fff',
    fontWeight: '700',
  }

  const dangerNav = {
    backgroundColor: '#3F5F73',
    color: '#fff',
    marginBottom: '1rem',
    width: '100%',
    borderRadius: '8px',
    fontWeight: '700',
  }

  const signinAlert = {
    backgroundColor: '#3F5F73',
    color: '#fff',
    marginBottom: '1rem',
    width: '100%',
    borderRadius: '8px',
    fontWeight: '700',
  }
  const success = {
    backgroundColor: '#137F4A',
    color: '#fff',
    marginBottom: '1rem',
    width: '100%',
    borderRadius: '8px',
    fontWeight: '700',
  }
  const homePage = {
    backgroundColor: primeCRL,
    color: '#fff',
    marginBottom: '1rem',
    width: '80%',
    borderRadius: '8px',
    fontWeight: '700',
  }

  // DIV ELEMENTS CANNOT BE FOCUST
  // MUST USER TAB INDEX
  return (
    <div
      ref={alertRef}
      tabIndex={-1}
      className="page-alert-div"
      style={
        alertStyle === 'danger'
          ? danger
          : alertStyle === 'danger-nav'
          ? dangerNav
          : alertStyle === 'success'
          ? success
          : alertStyle === 'home-page'
          ? homePage
          : signinAlert // not else if just else
      }
    >
      <p> {text} </p>
    </div>
  )
}

export default PageAlert
