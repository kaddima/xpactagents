import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../utility/axios";

export const getPropertyOfInterest = createAsyncThunk('message/propertyOfInterest', async ($agent_id) => {
	const response = await Axios.get(`/admin/agents/${$agent_id}/messages/poi`)
	return response.data
})

const initialState = {
	active_conversation: null,
	propertyOfInterest: { data: [], meta: {} },
	participants: { data: [], meta: {} },
	messages: { data: [], meta: {} },
	notification:[]
}

const messageSlice = createSlice({
	initialState,
	name: 'message',
	reducers: {
		updateParticipants: (state, action) => {
			state.participants = action.payload
		},
		updateMessages: (state, action) => {
			state.messages = action.payload
		},
		updateNotification: (state, action) => {
			state.notification = action.payload
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getPropertyOfInterest.fulfilled, (state, action) => {
			state.propertyOfInterest = action.payload.data
		})
	}
})

export const { updateParticipants,
	updateMessages, updateNotification } = messageSlice.actions

export default messageSlice.reducer