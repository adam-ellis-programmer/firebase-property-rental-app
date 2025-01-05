import React, { useState, useEffect } from 'react'

const GlobalAlert = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOnlineMessage, setShowOnlineMessage] = useState(false) // For showing "Back online!"

  useEffect(() => {
    const handleOffline = () => {
      console.log('Lost internet connection!')
      setIsOnline(false)
    }

    const handleOnline = () => {
      console.log('Back online!')
      setIsOnline(true)
      setShowOnlineMessage(true) // Show the "Back online!" message

      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowOnlineMessage(false)
      }, 3000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    // Cleanup listeners on unmount
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
        // border: '1px solid red',
      }}
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
