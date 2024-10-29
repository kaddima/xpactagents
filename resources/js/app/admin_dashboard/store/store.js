import {configureStore,} from '@reduxjs/toolkit'
import mainReducer from './mainSlice'
import AccountReducer from "./accountSlice"

const store = configureStore({

  reducer:{
  main: mainReducer,
  account:AccountReducer
  }
})

export default store