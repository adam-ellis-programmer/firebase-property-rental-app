import { configureStore } from '@reduxjs/toolkit'
import propertyReducer from '../features/properties/propertiesSlice'

// calls combine reducers
export default configureStore({
  reducer: {
    property: propertyReducer,
  },
})
