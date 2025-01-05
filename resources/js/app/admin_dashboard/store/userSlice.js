import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../utility/axios";

export const getGeneralData = createAsyncThunk('account/general-data', async () => {
	const response = await Axios.get('/admin/properties/overview')
	return response.data
})

const initialState = {
	propertyDetails: {},
	profile: {},
	favorites: []
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		updateProfile: (state, action) => {
			state.profile = action.payload
		},
		updateFavorites: (state, action) => {
			state.favorites = action.payload
		},
		updateUserImage: (state, action) => {
			state.profile.photo = action.payload
		},
		resetUserInfo: (state, action) => {
			return {}
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(getGeneralData.fulfilled, (state, action) => {
				state.profile = action.payload.data.profile
				state.propertyDetails = action.payload.data.propertyDetails
				state.favorites = action.payload.data.favorites

			})
	}
})

export const { updateProfile,
	resetUserInfo,
	updateFavorites,
	updateUserImage
} = userSlice.actions

export default userSlice.reducer