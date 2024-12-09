import { useNavigate } from 'react-router-dom'
const UpdatePropertyButton = ({ item }) => {
  const navigate = useNavigate()
  const handleUpdate = () => {
    const data = {
      id: item.id,
    }

    const new_params = new URLSearchParams(data)

    navigate(`/update?${new_params}`)
  }

  return (
    <button onClick={handleUpdate} className="update-prop-btn">
      update
    </button>
  )
}

export default UpdatePropertyButton
