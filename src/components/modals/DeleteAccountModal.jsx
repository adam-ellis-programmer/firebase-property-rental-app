import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import SectionHeader from '../../layout/SectionHeader'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import { getAuth, deleteUser } from 'firebase/auth'
import {
  doc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../../firebase-config'
import { useNavigate } from 'react-router-dom'
import DeleteSpinner from '../loaders/DeleteSpinner'
import { useSelector, useDispatch } from 'react-redux'

import UseAuthCheck from '../../hooks/UseAuthCheck'

const DeleteAccountModal = ({ setShowModal }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const { loggedInUser } = UseAuthCheck()

  // console.log(loggedInUser?.uid)
  const dispatch = useDispatch()

  // if user === user then delete

  const handleClose = () => {
    setShowModal(false)
  }

  // get message ids using doc.id
  const getAllMessages = async (userUID) => {
    const messageIDS = []
    const q = query(collection(db, 'messages'), where('senderID', '==', userUID))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const dataID = doc.id
      messageIDS.push(dataID)
    })

    return messageIDS
  }

  // gets all listing ids and all img paths for delete
  const getAllRelatedProperties = async (userUID) => {
    const listings = []
    const pathNames = []
    const listingIDS = []

    const q = query(collection(db, 'listings'), where('propertyOwner', '==', userUID))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      listings.push(doc.data())
    })

    // nested for loop to get the data
    for (const item of listings) {
      const imgArrs = item.imgURLS
      const listID = item.propertyID

      // 1: get all listing ids
      listingIDS.push(listID)

      for (const path of imgArrs) {
        // 2: get all nested path names
        pathNames.push(path.fullPath)
      }
    }

    return { listingIDS, pathNames }
  }

  const deleteDocument = async (collectionName, id) => {
    try {
      await deleteDoc(doc(db, collectionName, id))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteImg = async (pathName) => {
    // console.log(pathName)
    if (!pathName) return
    const storage = getStorage()
    // Img Ref
    const userIMG = ref(storage, pathName)
    // Delete the Img
    try {
      await deleteObject(userIMG)
    } catch (error) {
      console.log(error)
      // skip over not img not found
      if (error.code === 'storage/object-not-found') {
        console.log('img not found ')
      } else {
        console.log(error)
      }
    }
  }

  // filtered
  const handleDelete = async () => {
    const auth = getAuth()
    const user = auth.currentUser

    if (user.uid !== loggedInUser?.uid) {
      console.log('not authorized to delete this account ')
      return
    }

    const profilePath = `profile-images/${user.uid}/profile-pic`

    try {
      setIsDeleting(true)
      const userData = await getAllRelatedProperties(user.uid)
      const messageIDS = await getAllMessages(user.uid)
      const pathNames = userData.pathNames

      const allPathNames = pathNames.concat(profilePath)
      const listingIDS = userData.listingIDS

      // messages
      for (let i = 0; i < messageIDS.length; i++) {
        const msgID = messageIDS[i]
        await deleteDocument('messages', msgID)
        console.log('msg delete success...')
      }

      // listings
      for (let i = 0; i < listingIDS.length; i++) {
        const propID = listingIDS[i]
        console.log(propID)
        await deleteDocument('listings', propID)
        console.log('listing delete success...')
      }

      // images
      for (let i = 0; i < allPathNames.length; i++) {
        const pathName = allPathNames[i]
        console.log(pathName)
        await deleteImg(pathName)
        console.log('img deleted')
      }

      await deleteDoc(doc(db, 'users', user.uid))

      await deleteUser(user)
      console.log('user deleted')

      setIsDeleting(false)
      navigate('/')
      console.log('user deleted --2 ')
    } catch (error) {
      setIsDeleting(false)
      console.log(error)
    }
  }
  return (
    <div className="msg-delete-modal-wrap">
      <div className="delete-modal-div ">
        {isDeleting && <DeleteSpinner />}
        <div className="delete-modal-body-header">
          <button onClick={handleClose} className="close-delete-msg-modal-btn">
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
        <SectionHeader text={`delete your account?`} />
        <div className="delete-modal-body-div">
          <button onClick={handleDelete} className="delete-msg-btn">
            delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountModal
