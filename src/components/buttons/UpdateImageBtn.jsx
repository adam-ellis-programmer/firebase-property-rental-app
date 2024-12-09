import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase-config'
import { setImages } from '../../features/properties/propertiesSlice'
import { fetchProperty } from '../../features/properties/propertiesAction'
const UpdateImageBtn = ({ i, images, id, setUpdatingImage }) => {
  const dispatch = useDispatch()
  const [pathToDelete, setPathToDelete] = useState('')
  const [loggedInUser, setLoggloggedInUser] = useState(null)
  const fileInputRef = useRef(null)
  // use a custom hook
  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggloggedInUser(user)
      } else {
        setLoggloggedInUser(null)
      }
    })
    return () => {}
  }, [loggedInUser])

  const handleUpdateClick = () => {
    setUpdatingImage(i)

    // use index passed in to get full path
    setPathToDelete(images[i].fullPath)

    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const uploadImg = (filepath, file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage()

      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: 'image/jpeg',
      }

      const fullPath = `${filepath}/${file.name}--${crypto.randomUUID().slice(0, 5)}`

      const storageRef = ref(storage, fullPath)
      const uploadTask = uploadBytesResumable(storageRef, file, metadata)

      // Listen for state changes, errors, and completion of the upload.
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
              // Unknown error occurred, inspect error.serverResponse
              break
          }
          reject(error)
        },
        () => {
          // Upload completed successfully, data Returned
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const filePathData = { url: downloadURL, fullPath }
            resolve(filePathData)
            console.log('File available at', downloadURL)
          })
        }
      )
    })
  }

  const handleDeleteImg = (path) => {
    const storage = getStorage()

    // Create a reference to the file to delete
    const desertRef = ref(storage, path)

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log('deleted success')
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error)
      })
  }

  const handleFileChange = async (e) => {
    try {
      setUpdatingImage(i)

      const selectedFile = e.target.files[0]

      const filePath = `property-images/${loggedInUser.uid}/${id}`

      const newUrl = await uploadImg(filePath, selectedFile)
      handleDeleteImg(pathToDelete)

      // update the images array with map
      const updatedImagesArr = images.map((item) => {
        if (item.fullPath === pathToDelete) {
          return newUrl
        }
        return item
      })

      const listingRef = doc(db, 'listings', id)

      await updateDoc(listingRef, {
        imgURLS: updatedImagesArr,
      })

      const updatedData = await fetchProperty('listings', id)

      dispatch(setImages(updatedData.data.imgURLS))
      setUpdatingImage(null)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button onClick={handleUpdateClick} className="update-img-btn">
      <input
        onChange={(e) => handleFileChange(e)}
        ref={fileInputRef}
        type="file"
        name=""
        id=""
        hidden
      />
      update
    </button>
  )
}

export default UpdateImageBtn
