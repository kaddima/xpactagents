import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import Axios from "../../utility/axios";

export const getGeneralData = createAsyncThunk('account/general-data',async ()=>{
  const response = await Axios.get('/agents/general-data')
  return response.data
})


const initialState = {

  propertyDetails:{},
  profile: {}
  
}

const userSlice = createSlice({
  name:'user',
  initialState,
  reducers:{

  updateProfile:(state,action)=>{
    state.profile = action.payload
  },
  updateUserImage:(state,action)=>{
    state.profile.photo = action.payload
  },
  resetUserInfo: (state,action)=>{
    return {}
  }
   
  },
  extraReducers: (builder)=>{
  builder
    .addCase(getGeneralData.fulfilled, (state,action)=>{
    state.profile = action.payload.data.profile
    state.propertyDetails = action.payload.data.propertyDetails

    })
  }
})

export const {updateProfile,
  resetUserInfo,
  updateUserImage
} = userSlice.actions

export default userSlice.reducer