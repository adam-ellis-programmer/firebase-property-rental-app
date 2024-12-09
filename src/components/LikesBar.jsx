import React from 'react'
import { useEffect, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { fetchUser } from '../features/properties/propertiesAction'
import { db } from '../firebase-config'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProperty } from '../features/properties/propertiesAction'
import { setProperty } from '../features/properties/propertiesSlice'
const LikesBar = ({ property, loggedInUser }) => {
  const dispatch = useDispatch()

  const [emojis, setEmojis] = useState({
    thumbsUp: { item: '👍', count: property.reactions.thumbsUp },
    heart: { item: '❤️', count: property.reactions.heart },
    smile: { item: '😊', count: property.reactions.smile },
    laugh: { item: '😂', count: property.reactions.laugh },
    surprised: { item: '😮', count: property.reactions.surprised },
  })

  const [isLiked, setIsLiked] = useState(false)
  console.log(property.reactions)
  const propertyID = property.propertyID

  useEffect(() => {
    const getDta = async () => {
      const user = await fetchUser('users', loggedInUser?.uid)
      const userLikedProperties = user?.data?.likedProperties

      if (user && userLikedProperties.includes(propertyID)) {
        console.log('object')
        setIsLiked(true)
      }
    }
    getDta()
    return () => {}
  }, [isLiked])

  console.log(emojis)

  const handleEmojiClick = async (key) => {
    const userID = loggedInUser?.uid
    const user = await fetchUser('users', userID)
    const reactions = user?.data?.likedProperties

    console.log(user)
    if (!user) {
      console.log('must be logged in to like this property')
      return
    }

    // Update emojis state immediately for DOM change
    const updatedEmojis = { ...emojis }
    updatedEmojis[key].count += 1
    setEmojis(updatedEmojis)
    setIsLiked(true)

    if (!reactions.includes(propertyID)) {
      reactions.push(propertyID)
    }

    // Dynamically update the reaction count for the clicked emoji
    const propertyREF = doc(db, 'listings', propertyID)
    await updateDoc(propertyREF, {
      // Computed Property Names (at runtime)
      [`reactions.${key}`]: property.reactions[key] + 1,
    })

    // update user db
    const userRef = doc(db, 'users', userID)
    await updateDoc(userRef, {
      likedProperties: reactions,
    })

    const updatedProperty = await fetchProperty('listings', propertyID)
    console.log(updatedProperty)
    dispatch(setProperty(updatedProperty.data))
  }

  return (
    <>
      {isLiked && <p className="like-p">you have liked this property!</p>}

      <div className="likes-bar-container">
        {Object.entries(emojis).map(([key, emoji]) => (
          <button
            disabled={isLiked}
            onClick={() => handleEmojiClick(key)}
            className={`emoji-button ${isLiked && 'emoji-buttonLiked'}`}
            key={key}
          >
            {emoji.item}
            <span className="emoji-number-span">{emoji.count}</span>
          </button>
        ))}
      </div>
    </>
  )
}

export default LikesBar
