import {createSlice} from "@reduxjs/toolkit";

const initialState = {

    userInfo: {},
    favorites:[]
  
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{

        
        updateUserInfo:(state,action)=>{
            state.userInfo = action.payload
        },
        updateFavorites:(state,action)=>{
            state.favorites = action.payload
        },
        updateUserImage:(state,action)=>{
            state.userInfo.image = action.payload
        },
        resetUserInfo: (state,action)=>{
            state.userInfo = {}
        }
   
    }
})

export const {updateUserInfo,
    resetUserInfo,
    updateUserImage,
    updateFavorites
} = userSlice.actions

export default userSlice.reducer