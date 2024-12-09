import { createSlice } from '@reduxjs/toolkit'

// uses immer
export const propertySlice = createSlice({
  name: 'property',
  initialState: {
    property: null,
    signUpChange: false,
    images: null,
    propIndex: null,
    listings: null,
    messages: null,
  },
  reducers: {
    setProperty: (state, action) => {
      state.property = action.payload
    },
    setImages: (state, action) => {
      state.images = action.payload
    },
    setLoginChange: (state, action) => {
      state.signUpChange = action.payload
    },
    setpropIndex: (state, action) => {
      state.propIndex = action.payload
    },
    setListings: (state, action) => {
      state.listings = action.payload
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setProperty,
  setImages,
  setLoginChange,
  setpropIndex,
  setListings,
  setMessages,
} = propertySlice.actions

export default propertySlice.reducer
