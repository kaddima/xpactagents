import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const getAccount = createAsyncThunk('account/getAccount', async ()=>{

  const response = await axios.get('/user-account')
  return response.data
})

export const getQuestion = createAsyncThunk('account/getQuestion', async ()=>{

  const response = await axios.get('/dashboard/get-question')
  return response.data
})


const initialState = {

  user : {},
  account:{},
  card:{},
  statements : [],
  question:{}
}


const accountSlice = createSlice({

  name:'account',
  initialState,
  reducers:{

  updateUser(state,action){
    state.user = action.payload
  },

  updateBalance(state,action){
    state.account.account_balance = action.payload
  }
  },

  extraReducers : (builder)=>{

  builder
  .addCase(getAccount.fulfilled, (state,action)=>{
    state.user = action.payload.data.user
    state.account = action.payload.data.account
    state.statements = action.payload.data.transactions
    state.card = action.payload.data.card
  })

  .addCase(getQuestion.fulfilled, (state,action)=>{
     
    state.question = action.payload.data
  })
  }
})

export const {updateUser,updateBalance} = accountSlice.actions

export default accountSlice.reducer
