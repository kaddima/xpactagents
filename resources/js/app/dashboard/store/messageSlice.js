import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../utility/axios";

export const getPropertyOfInterest = createAsyncThunk('message/propertyOfInterest',async ()=>{
    const response = await Axios.get('/agent/message/property-of-interest')
    return response.data
})

let initialState = {
    active_conversation:null,
    propertyOfInterest:[],
    participants:null,
    messages: [],
    notification:[]
  
}

let a = []

const messageSlice = createSlice({

    initialState,
    name:'message',
    reducers:{
        updateParticipants:(state,action)=>{
            state.participants = action.payload
        },
        updateMessages:(state,action)=>{
            state.messages = action.payload
        },
        updateNotification:(state,action)=>{
            state.notification = action.payload
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(getPropertyOfInterest.fulfilled, (state,action)=>{

            state.propertyOfInterest = action.payload.data.property_of_interest
           // state.participants = action.payload.data.participants
        })
    }
})

export const {updateParticipants,
    updateMessages,updateNotification} = messageSlice.actions

export default messageSlice.reducer