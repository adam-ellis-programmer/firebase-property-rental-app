import EmailSignUpForm from '../components/forms/EmailSignUpForm'
import logo from '../svgs/logo-white.svg'

const Footer = () => {
  return (
    <footer className="footer-wrap">
      <div className="footer-inner-div">
        {' '}
        <div>
          <p className="footer-header-p">
            <span>About Us</span>
          </p>
          <ul className="footer-ul">
            <li>Company Info</li>
            <li>Careers</li>
            <li>Press Releases</li>
          </ul>
        </div>
        <div>
          <p className="footer-header-p">
            <span>Support</span>
          </p>
          <ul className="footer-ul">
            <li>FAQs</li>
            <li>Contact Us</li>
            <li>Help Center</li>
          </ul>
        </div>
        <div>
          <p className="footer-header-p">
            <span>Explore</span>
          </p>
          <ul className="footer-ul">
            <li>Browse Properties</li>
            <li>Rental Tips</li>
            <li>Tenant Resources</li>
          </ul>
        </div>
      </div>
      <div className="footer-inner-div">
        <p className="footer-email-p">sign up to our news letter</p>
        <EmailSignUpForm />
      </div>
      <div className="footer-inner-div footer-logo-div">
        {' '}
        <img className="footer-logo" src={logo} alt="Property Rental Website Logo" />
      </div>
    </footer>
  )
}

export default Footer
