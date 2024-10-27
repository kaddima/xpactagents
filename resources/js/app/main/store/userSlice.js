import {createSlice} from "@reduxjs/toolkit";

const initialState = {

    userInfo: {}
  
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{

        
        updateUserInfo:(state,action)=>{
            state.userInfo = action.payload
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
    updateUserImage
} = userSlice.actions

export default userSlice.reducer