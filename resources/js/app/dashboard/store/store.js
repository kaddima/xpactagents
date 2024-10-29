import {configureStore,} from '@reduxjs/toolkit'
import mainReducer from './mainSlice'
import userReducer from "./userSlice"
import messageReducer from "./messageSlice"

const store = configureStore({

  reducer:{
  main: mainReducer,
  user:userReducer,
  message:messageReducer
  }
})

export default store