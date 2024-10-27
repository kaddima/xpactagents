import {createSlice } from "@reduxjs/toolkit";

const initialState = {
    navMenu:{
        activeMenu :false,
        accountModal:false
    },
    screenSize:'',
   
}

const mainSlice = createSlice({
    name:'main',
    initialState,
    reducers:{
        toggleActiveMenu:(state, action)=>{
            state.navMenu.activeMenu = !state.navMenu.activeMenu
        
        },

        setActiveMenu_screenSize: (state,action)=>{
            state.navMenu.activeMenu = action.payload.active

            if(action.payload.screenSize){
                state.screenSize = action.payload.screenSize
            }
            
        },
        toggleProfileEdit: (state,action)=>{
            
           state.profileEditShow = !state.profileEditShow
        },
       
    }
})

export const {toggleActiveMenu,toggleProfileEdit, 
     setActiveMenu_screenSize,} = mainSlice.actions

export default mainSlice.reducer