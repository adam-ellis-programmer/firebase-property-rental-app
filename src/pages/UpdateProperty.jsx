import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchProperty } from '../features/properties/propertiesAction'
import UpdatePropertyForm from '../components/forms/UpdatePropertyForm'
import updateBG from '../temp/images/properties/update-bg.webp'
import FormSubmitLoader from '../components/loaders/FormSubmitLoader'
const UpdateProperty = () => {
  const [searchParams] = useSearchParams()
  const [propDetails, setPropDetails] = useState(null)
  const propertyId = searchParams.get('id')
  const [isSubmiting, setIsSubmiting] = useState(false)

  useEffect(() => {
    const getData = async () => {
      if (propertyId) {
        const propRes = await fetchProperty('listings', propertyId)
        setPropDetails(propRes.data)
      }
    }

    getData()
  }, [propertyId])

  if (isSubmiting) {
    return <FormSubmitLoader />
  }
  return (
    <div className="update-bg">
      <img className="update-img" src={updateBG} alt="" />
      <div className="update-img-overlay"></div>
      <div className="update-form-container">
        <UpdatePropertyForm propDetails={propDetails} setIsSubmiting={setIsSubmiting} />
      </div>
    </div>
  )
}

export default UpdateProperty
