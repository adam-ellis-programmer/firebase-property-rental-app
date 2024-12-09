import { useState, useEffect, useRef } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { setImages } from '../../features/properties/propertiesSlice'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase-config'
import { fetchProperty } from '../../features/properties/propertiesAction'
import { useDispatch } from 'react-redux'
const AddNewImages = ({ id, images }) => {
  const fileInputRef = useRef()
  const dispatch = useDispatch()
  // const documentId = id
  const [files, setFiles] = useState(null)
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user)
      } else {
        setLoggedInUser(null)
      }
    })
    return () => {}
  }, [loggedInUser])

  const uploadImg = (filepath, file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage()

      // Create the file metadata
      const metadata = {
        contentType: 'image/jpeg',
      }

      // Upload file and metadata to
      const fullPath = `${filepath}/${file.name}--${crypto.randomUUID().slice(0, 5)}`
      const storageRef = ref(storage, fullPath)
      const uploadTask = uploadBytesResumable(storageRef, file, metadata)

      // Listen for state changes
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break
            case 'storage/canceled':
              // User canceled the upload
              break

            // ...

            case 'storage/unknown':
              break
          }
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL)
            const filePathData = { url: downloadURL, fullPath }
            resolve(filePathData)
          })
        }
      )
    })
  }

  const handleAddImages = async (e) => {
    const selectedFiles = e.target.files
    setFiles(selectedFiles)
    const filePath = `property-images/${loggedInUser.uid}/${id}`
    const newUrls = await Promise.all(
      [...selectedFiles].map((img) => uploadImg(filePath, img))
    )

    console.log(newUrls)
    console.log(selectedFiles)

    const updatedIMGArr = [...images, ...newUrls]

    const propertyDocRef = doc(db, 'listings', id)
    await updateDoc(propertyDocRef, {
      imgURLS: updatedIMGArr,
    })

    const updatedData = await fetchProperty('listings', id)
    console.log(updatedData.data.imgURLS)
    dispatch(setImages(updatedData.data.imgURLS))
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }
  return (
    <div className="img-manage-add-container">
      <button className="add-images-btn" onClick={handleClick}>
        upload images
        <input
          ref={fileInputRef}
          onChange={handleAddImages}
          className="add-images-input"
          type="file"
          multiple
          name=""
          id=""
          hidden
        />
      </button>
    </div>
  )
}

export default AddNewImages
