import React, {useEffect, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Navbar from './components/navbar/Navbar';
import Login from "./components/modals/Login"
import Register from "./components/modals/Register"

//import './App.css';
import { updateFavorites, updateUserInfo } from './store/userSlice';
import PropertyDetails from './pages/PropertyDetails'
import ListingsPage from './pages/ListingsPage';
import ScheduleTour from './pages/ScheduleTour';
import Axios from '../utility/axios';
import MessageLayout from './pages/Messages/MessageLayout';
import SearchPage from './pages/SearchPage';
import Favorites from './pages/Favorites';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './components/modals/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import checkMessage from '../utility/checkMessages';
import { updateNotification } from './store/messageSlice';

const Index = ()=>{

    return <Navigate to={'/app'}/>
}

function App() {

    const dispatch = useDispatch()

    const displayMode = useSelector(state=>state.main.displayMode)

    useEffect(()=>{

        Axios.get('/logged-user').then(data=>{

            if(data.data?.redirect){

                location.href = '/dashboard'
            }

            dispatch(updateUserInfo(data.data.userInfo))
            dispatch(updateFavorites(data.data.favorites))

        }).catch(e=>{

            console.log(e)
        })

       
        
    },[])


    useEffect(()=>{
        checkMessage().then(data=>{

            dispatch(updateNotification(data.data))
            
        }).catch(e=>{
            console.log(e)
        })
    },[])

    return (
        <div className={displayMode}>
            <BrowserRouter>
                <div className='flex w-screen h-screen relative overflow-hidden dark:bg-main-dark-bg bg-white text-black dark:text-slate-400'>
                   
                     <Login/>
                     <ForgotPassword/>
                     <Register/>
                     <div id='spinner' className='fixed left-0 w-screen h-screen z-[9999] hidden' style={{backgroundColor:'rgba(0,0,0,0.1)'}}>
                        <div className='fixed bottom-2 right-5 w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-green-600 border-l-white animate-spin '>
                        </div>              
                    </div> 
                    
                    <div className={`md:h-screen flex flex-col flex-1
                        md:max-h-screen overflow-hidden`}>

                        <div className={`flex z-[40] w-full`}>
                            <Navbar/>
                        </div>
                        
                        
                        <div className='flex-1 overflow-hidden h-full w-full'>
                             <Routes>
                                <Route path='/' element={<ListingsPage/>}/>
                                <Route path='/app/q-r' element={<MessageLayout/>}/>
                                <Route path='/app' element={<ListingsPage/>}/>
                                <Route path='/app/listings' element={<ListingsPage/>}/>
                                <Route path='/app/favorites' element={<Favorites/>}/>
                                <Route path='/app/property/:id' element={<PropertyDetails/>}/>
                                <Route path='/app/tour/:id/checkout' element={<ScheduleTour/>}/>
                                <Route path='/app/listings/search' element={<SearchPage/>}/>
                                <Route path='/app/register/verify-email' element={<VerifyEmail/>}/>
                                <Route path='/app/reset-password/:token' element={<ResetPassword/>}/>
                                <Route path='*' element={<Index/>}/>
                            </Routes>
                        </div>
                        <ToastContainer/>
                    </div>          
                </div>
            </BrowserRouter>         
        </div>
    );
}

export default App;
