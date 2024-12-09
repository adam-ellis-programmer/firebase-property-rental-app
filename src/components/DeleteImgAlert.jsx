import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { doc, updateDoc } from 'firebase/firestore'
import { setImages } from '../features/properties/propertiesSlice'
import { db } from '../firebase-config'
import { getStorage, ref, deleteObject } from 'firebase/storage'

const DeleteImgAlert = ({ setShowDelete, images, index, docId }) => {
  const dispatch = useDispatch()
  const deleteAlertRef = useRef()

  useEffect(() => {
    const alertRef = deleteAlertRef.current
    console.log(alertRef)

    if (alertRef) {
      alertRef.focus()
    }

    return () => {}
  }, [])

  const imgDataPath = images[index]?.fullPath

  const deleteImg = async (imgPath) => {
    const storage = getStorage()

    // Create a reference to the file to delete
    const imgRef = ref(storage, `${imgPath}`)

    // Delete the file
    deleteObject(imgRef)
      .then(() => {
        console.log('successfully deleted')
      })
      .catch((error) => {
        console.log(error)
      })
    // return
  }

  const handleDelete = async () => {
    const filteredImgArr = images.filter((item) => item.fullPath !== imgDataPath)
    dispatch(setImages(filteredImgArr))
    deleteImg(imgDataPath)
    const imgRef = doc(db, 'listings', docId)

    await updateDoc(imgRef, {
      imgURLS: filteredImgArr,
    })
    setShowDelete(false)
  }
  return (
    <div tabIndex={-1} ref={deleteAlertRef} className="delete-img-alert">
      <div>
        <p>you are about to delete this image</p>
        <p>continue?</p>
      </div>
      <div>
        <button onClick={handleDelete} className="manage-img-btn delete-img">
          delete
        </button>
        <button
          onClick={() => setShowDelete(false)}
          className="manage-img-btn delete-back"
        >
          back
        </button>
      </div>
    </div>
  )
}

export default DeleteImgAlert
