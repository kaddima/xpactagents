import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../utility/axios";


export const getAccount = createAsyncThunk('account/getAccount', async ()=>{

    const response = await Axios.get('/user-account')
    return response.data
})


const initialState = {

    user : {},
    account:{},
    card:{},
    statements : [],
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

    }
})

export const {updateUser,updateBalance} = accountSlice.actions

export default accountSlice.reducer
