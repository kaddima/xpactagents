import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../utility/axios";

export const getPropertyOfInterest = createAsyncThunk('message/propertyOfInterest',async ()=>{
    const response = await Axios.get('/properties/conversations')
    return response.data
})

const initialState = {
    active_conversation:null,
    propertyOfInterest:{data:[], meta:{}},
    participants:null,
    messages: {data:[], meta:{}},
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
            state.propertyOfInterest = action.payload.data
           // state.participants = action.payload.data.participants
        })
    }
})

export const {updateParticipants,
    updateMessages,updateNotification} = messageSlice.actions

export default messageSlice.reducer