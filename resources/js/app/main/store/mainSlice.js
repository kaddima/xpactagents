import {createSlice} from "@reduxjs/toolkit"

const initialState = {

  modal:{
  loginModal:{
    isOpen:false
  },
  registerModal:{
    isOpen:false
  },
  tourRequestSuccessModal:{
    isOpen:false
  }
  }
}

const mainSlice = createSlice({

  name:"main",
  initialState,
  reducers:{
  loginModalOpen:(state,action)=>{
    state.modal.loginModal.isOpen = true
  },
   loginModalClose:(state,action)=>{
    state.modal.loginModal.isOpen = false
  },

  registerModalOpen:(state,action)=>{
    state.modal.registerModal.isOpen = true
  },
   registerModalClose:(state,action)=>{
    state.modal.registerModal.isOpen = false
  },
  tourRequestSuccessModalOpen:(state,action)=>{
    state.modal.tourRequestSuccessModal.isOpen = true
  },
  tourRequestSuccessModalClose:(state,action)=>{
    state.modal.tourRequestSuccessModal.isOpen = false
  },
  }
})

export const {loginModalOpen,
  loginModalClose,
  registerModalOpen,
  registerModalClose,
  tourRequestSuccessModalOpen,
  tourRequestSuccessModalClose} = mainSlice.actions
  
  export default mainSlice.reducer
  

