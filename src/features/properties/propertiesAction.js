import { db } from '../../firebase-config'

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  updateDoc,
} from 'firebase/firestore'

export const fetchProperty = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { data: docSnap.data(), id: docSnap.id }
    } else {
      console.log('No such document!')
    }
  } catch (error) {
    console.log(error)
  }
}

export const fetchUser = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { data: docSnap.data(), id: docSnap.id }
    } else {
      console.log('No such document!')
    }
  } catch (error) {}
}

export const fetchAllProperties = async (collectionName) => {
  const data = []
  try {
    const q = query(collection(db, collectionName))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      data.push({ data: doc.data(), id: doc.id })
    })
  } catch (error) {
    console.log(error)
  }

  return data
}

export const fetchFeatured = async (collectionName) => {
  const data = []
  try {
    const q = query(collection(db, 'listings'), where('featured', '==', true), limit(2))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      data.push({ data: doc.data(), id: doc.id })
    })
  } catch (error) {
    console.log(error)
  }

  return data
}
// get featured properties limit to 3
export const fetchRecent = async (collectionName) => {
  const data = []
  try {
    const q = query(collection(db, collectionName), limit(3))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      data.push({ data: doc.data(), id: doc.id })
    })
  } catch (error) {
    console.log(error)
  }

  return data
}

export const ownerListings = async (collectionName, userID) => {
  const data = []
  try {
    const q = query(collection(db, collectionName), where('propertyOwner', '==', userID))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      data.push({ data: doc.data(), id: doc.id })
    })
  } catch (error) {
    console.log(error)
  }

  return data
}

export const getMessages = async (loggedInUserId) => {
  const data = []
  const q = query(
    collection(db, 'messages'),
    where('propertyOwnerID', '==', loggedInUserId)
  )

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    data.push({ data: doc.data(), id: doc.id })
  })

  return data
}

export const fetchMessage = async (msgID) => {
  const docRef = doc(db, 'messages', msgID)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log('No such document!')
  }
}

export const updateViews = async (id, viewCount) => {
  const viewRef = doc(db, 'listings', id)

  await updateDoc(viewRef, {
    views: viewCount,
  })
}
