import React, { useState, useEffect, useRef } from 'react'

const GlobalAlert = () => {
  const msgRef = useRef()

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOnlineMessage, setShowOnlineMessage] = useState(false) // For showing "Back online!"

  useEffect(() => {
    // console.log(msgRef.current)
    return () => {}
  }, [])

  useEffect(() => {
    const handleOffline = () => {
      console.log('Lost internet connection!')
      setIsOnline(false)
      console.log(msgRef.current)
      msgRef.current.focus()
    }

    // re-factor so that it reloads first and then shows flash message
    const handleOnline = () => {
      console.log('Back online!')
      setIsOnline(true)
      setShowOnlineMessage(true)
      msgRef.current.focus()

      // Trigger a refresh
      setTimeout(() => {
        window.location.reload()
      }, 3000)

      // hide message
      setTimeout(() => {
        setShowOnlineMessage(false)
      }, 3000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    // remove the event listeners
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        top: 0,
        width: '100%',
        zIndex: 1000,
        outline: 'none',

        // border: '1px solid red',
      }}
      ref={msgRef}
      tabIndex="0"
    >
      {!isOnline && (
        <div
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
            // position: 'absolute',
            // top: '50%',
          }}
        >
          Lost internet connection!
        </div>
      )}
      {isOnline && showOnlineMessage && (
        <div
          style={{
            backgroundColor: 'green',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          Back online!
        </div>
      )}
    </div>
  )
}

export default GlobalAlert
