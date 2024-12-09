import { useState, useEffect } from 'react'
import PageHeader from '../layout/PageHeader'
import temp from '../temp/user.jpg'
import { getMessages, fetchMessage } from '../features/properties/propertiesAction'
import UseAuthCheck from '../hooks/UseAuthCheck'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../features/properties/propertiesSlice'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { Link } from 'react-router-dom'
import MsgDeleteModal from '../components/modals/MsgDeleteModal'
import NoDataPlaceHolder from '../layout/NoDataPlaceHolder'
import PageLoader from '../components/loaders/PageLoader'
const Messages = () => {
  const dispatch = useDispatch()
  const { messages } = useSelector((state) => state.property)

  const [showModal, setShowModal] = useState(false)
  const { loggedInUser } = UseAuthCheck(null)
  const [msgOrdered, setMsgOrdered] = useState([])
  const [msgID, setMsgID] = useState(null)
  const [loading, setLoading] = useState(false)

  // array structured with unread messages in a different array (two arrays)
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        if (loggedInUser) {
          const msgRes = await getMessages(loggedInUser.uid)
          dispatch(setMessages(msgRes))
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }

    getData()
    return () => {}
  }, [loggedInUser])

  useEffect(() => {
    const readData = []
    const unReadData = []
    messages &&
      messages.forEach((item) => {
        if (item.data.read) {
          readData.push(item)
        } else {
          unReadData.push(item)
        }
      })

    // a - b = ascending
    // b - a = descending
    // a === b equal
    readData.sort((a, b) => b.data.dateStamp - a.data.dateStamp)
    unReadData.sort((a, b) => b.data.dateStamp - a.data.dateStamp)

    // displays unread first
    const sortedData = [...unReadData, ...readData]
    // sortedData.sort((a, b) => b.data.dateStamp - a.data.dateStamp)

    setMsgOrdered(sortedData)

    return () => {}
  }, [messages])

  // console.log(msgOrdered)
  const handleToggleRead = async (id) => {
    const updatedMessages = messages.map((message) => {
      if (message.id === id) {
        return { ...message, data: { ...message.data, read: !message.data.read } } // Update read property directly
      }
      return message // Return unchanged message for other elements
    })
    dispatch(setMessages(updatedMessages)) // Dispatch the updated array
    const msg = await fetchMessage(id)
    console.log(msg.read)
    const msgRef = doc(db, 'messages', id)

    await updateDoc(msgRef, {
      read: !msg.read,
    })
  }

  const handleDeleteModal = (id) => {
    setMsgID(id)
    setShowModal(true)
  }

  if (loading) {
    return <PageLoader />
  }
  return (
    <>
      {showModal && <MsgDeleteModal setShowModal={setShowModal} msgID={msgID} />}
      <PageHeader text={`your messages (${messages?.length})`} />
      <div className="messages-container">
        {msgOrdered?.length < 1 ? (
          <div className="no-msg-div">
            <span>no messages to show</span>
          </div>
        ) : (
          msgOrdered &&
          msgOrdered.length > 0 &&
          msgOrdered.map(({ id, data }) => (
            <div key={id} className="msg-div">
              <div className="read-text">{!data.read && <span>new</span>}</div>
              <div className="msg-inner-div sender-img-div">
                <img className="msg-sender-img" src={data.senderProfileImg} alt="" />
              </div>
              <div className="msg-inner-div">
                <h2>property inquiry</h2>
              </div>
              <div className="msg-inner-div">
                <p>{data.propertyAddress}</p>
                <p>{data.propertyType}</p>
              </div>
              <div className="msg-inner-div">
                <p>{data.message}</p>
              </div>
              <div className="msg-inner-div msg-sender-details-p">
                <p>
                  <span>reply name: </span>
                  <span>{data.name}</span>
                </p>
                <p>
                  <span>reply email: </span>
                  <span>{data.email}</span>
                </p>
                <p>
                  <span>reply phone: </span>
                  <span>{data.phone}</span>
                </p>
                <p>
                  <span>sent date: </span>
                  <span>
                    {/* custom date data */}
                    {new Date(data.dateStamp).toLocaleString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    })}
                  </span>
                </p>
              </div>
              <div className="msg-inner-div msg-btn-div">
                <button
                  onClick={() => handleToggleRead(id)}
                  className={`msg-btn msg-toggle-read ${data.read && 'msg-read'}`}
                >
                  {data.read ? 'mark as new' : ' mark as read'}
                </button>
                <button
                  onClick={() => handleDeleteModal(id)}
                  className="msg-btn msg-delete"
                >
                  delete
                </button>
              </div>
              <div className="msg-prop-img-container">
                <Link to={`/property-details/${data.propertyIDRef}`}>
                  <img className="msg-prop-img" src={data.propertyImg} alt="" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Messages
