import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import SectionHeader from '../../layout/SectionHeader'

import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase-config'
import { useSelector, useDispatch } from 'react-redux'
import { setMessages } from '../../features/properties/propertiesSlice'
/* flex so does not need max-width */
const MsgDeleteModal = ({ setShowModal, msgID }) => {
  const dispatch = useDispatch()
  const { messages } = useSelector((state) => state.property)
  console.log(messages)

  const handleClose = () => {
    setShowModal(false)
  }

  // filtered
  const handleDelete = async () => {
    const filteredMessages = messages.filter((msg) => msg.id !== msgID)
    dispatch(setMessages(filteredMessages))
    setShowModal(false)

    await deleteDoc(doc(db, 'messages', msgID))
  }
  return (
    <div className="msg-delete-modal-wrap">
      <div className="delete-modal-div ">
        <div className="delete-modal-body-header">
          <button onClick={handleClose} className="close-delete-msg-modal-btn">
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
        <SectionHeader text={`delete this message?`} />
        <div className="delete-modal-body-div">
          <button onClick={handleDelete} className="delete-msg-btn">
            delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default MsgDeleteModal
