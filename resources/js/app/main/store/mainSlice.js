import {createSlice} from "@reduxjs/toolkit"

const initialState = {

    modal:{
        loginModal:{
            isOpen:false
        },
        forgotPasswordModal:{
            isOpen:false
        },
        registerModal:{
            isOpen:false
        },
        tourRequestSuccessModal:{
            isOpen:false
        }
    },

    displayMode:'dark'
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
        forgotPasswordModalOpen:(state,action)=>{
            state.modal.forgotPasswordModal.isOpen = true
        },
        forgotPasswordModalClose:(state,action)=>{
            state.modal.forgotPasswordModal.isOpen = false
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

        changeDisplayMode:(state,action)=>{
            state.displayMode = action.payload
        }
    }
})

export const {loginModalOpen,
    loginModalClose,
    forgotPasswordModalOpen,
    forgotPasswordModalClose,
    registerModalOpen,
    registerModalClose,
    tourRequestSuccessModalOpen,
    tourRequestSuccessModalClose,
    changeDisplayMode} = mainSlice.actions
    
    export default mainSlice.reducer
    

