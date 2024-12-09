import { useParams } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { fetchProperty } from '../features/properties/propertiesAction'
import SectionHeader from '../layout/SectionHeader'
import { useSelector, useDispatch } from 'react-redux'
import { setImages } from '../features/properties/propertiesSlice'
import DeleteImgAlert from '../components/DeleteImgAlert'
import AddNewImages from '../components/buttons/AddNewImages'
import UpdateImageBtn from '../components/buttons/UpdateImageBtn'
import UpdateImgLoader from '../components/loaders/UpdateImgLoader'

const ManageImages = () => {
  const [imgLoading, setImgLoading] = useState({})
  const dispatch = useDispatch()
  const [showDelete, setShowDelete] = useState(false)
  const [index, setIndex] = useState(null)
  const { images } = useSelector((state) => state.property)
  const { id } = useParams()

  const [updatingImage, setUpdatingImage] = useState(null) // Track updating image index
  const fileInputs = useRef([])

  useEffect(() => {
    const getData = async () => {
      const res = await fetchProperty('listings', id)
      dispatch(setImages(res.data.imgURLS))
    }

    getData()
    return () => {}
  }, [id, dispatch])
  useEffect(() => {
    images &&
      images.forEach((_, i) => {
        setImgLoading((prevState) => ({
          ...prevState,
          [i]: { loading: true },
        }))
      })

    // set timeout set all loading to false after a set time (option)
    // setTimeout(() => {
    //   images &&
    //     images.forEach((_, i) => {
    //       setImgLoading((prevState) => ({
    //         ...prevState,
    //         [i]: { loading: false },
    //       }))
    //     })
    // }, 2000)
    return () => {}
  }, [images])

  const handleDeleteImg = (i) => {
    console.log('deleted')
    setIndex(i)
    setShowDelete(!showDelete)
  }
  const handleImageLoad = (i) => {
    console.log(i)

    setImgLoading((prevState) => ({ ...prevState, [i]: { loading: false } }))
  }

  const check = Object.values(imgLoading).every((item) => item.loading === true)
  console.log('Are all images still loading?', check)

  console.log(imgLoading)

  return (
    <>
      <section className="manage-images-header">
        <SectionHeader text={`view and manage your listing images here `} />
      </section>
      <AddNewImages id={id} images={images} />
      <section className="manage-images-section">
        {showDelete && (
          <DeleteImgAlert
            setShowDelete={setShowDelete}
            images={images}
            index={index}
            docId={id}
          />
        )}

        <div className="manage-images-container">
          {images &&
            images.map((img, i) => (
              <div key={i} className="img-wrap">
                {updatingImage === i ? (
                  <>
                    {<UpdateImgLoader />}
                    <img className="manage-img" src={img.url} alt="" />
                  </>
                ) : (
                  <>
                    {imgLoading[i]?.loading === true && <UpdateImgLoader />}
                    <img
                      className="manage-img"
                      src={img.url}
                      alt=""
                      onLoad={() => handleImageLoad(i)}
                      style={{
                        display: imgLoading[i]?.loading === true ? 'none' : 'block',
                      }}
                    />
                  </>
                )}
                <div className="img-manage-btn-container">
                  <button onClick={() => handleDeleteImg(i)} className="delete-img-btn">
                    delete
                  </button>

                  <UpdateImageBtn
                    i={i}
                    id={id}
                    images={images}
                    setUpdatingImage={setUpdatingImage}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  )
}

export default ManageImages
