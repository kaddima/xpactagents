import {configureStore,} from '@reduxjs/toolkit'
import mainReducer from './mainSlice'
import AccountReducer from "./accountSlice"
import userReducer from "./userSlice"
import messageRuducer from "./messageSlice"

const store = configureStore({

    reducer:{
        main: mainReducer,
        account:AccountReducer,
        user:userReducer,
        message:messageRuducer
    }
})

export default store