import {createSlice } from "@reduxjs/toolkit";

const initialState = {
  navMenu:{
  activeMenu :false,
  accountModal:false
  },
  screenSize:'',
  modalContentDisplay:false,
  modalContent : false
   
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
  modalContentDisply : (state, action)=>{
    state.modalContentDisplay = action.payload;
  },
  setModalContent : (state, action)=>{
    // hide navBar account modal display
    state.navMenu.accountModal = false
    // set the content to display on modal content using the content id
    state.modalContent = action.payload
    //set the modalCOntent display to true
    state.modalContentDisplay = true;
  },
  toggleAccountModal: (state,action)=>{
    
     state.navMenu.accountModal = !state.navMenu.accountModal
  },
   
  }
})

export const {toggleActiveMenu, setModalContent, 
   setActiveMenu_screenSize,modalContentDisply,
toggleAccountModal} = mainSlice.actions

export default mainSlice.reducer