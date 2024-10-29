import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import $ from 'jquery'

import Navbar from './components/navbar/Navbar';
import Login from "./components/modals/Login"
import Register from "./components/modals/Register"

//import './App.css';
import axios from 'axios';
import { updateUserInfo } from './store/userSlice';
import PropertyDetails from './pages/PropertyDetails'
import ListingsPage from './pages/ListingsPage';
import ScheduleTour from './pages/ScheduleTour';
import Axios from '../utility/axios';
import MessageLayout from './pages/Messages/MessageLayout';
import SearchPage from './pages/SearchPage';
import Favorites from './pages/Favorites';
import VerifyEmail from './pages/VerifyEmail';

const Index = ()=>{

  return <Navigate to={'/app'}/>
}

function App() {

  const dispatch = useDispatch()

  useEffect(()=>{

  axios.get('/logged-user').then(data=>{

    if(data.data?.redirect){

    location.href = '/dashboard'
    }
    dispatch(updateUserInfo(data.data.userInfo))

  }).catch(e=>{

    console.log(e)
  })
  

  },[])

  return (
  <div className={`white`}>
    <BrowserRouter>
    <div className='flex w-screen h-screen relative overflow-hidden'>
       
       <Login/>
       <Register/>
       <div id='spinner' className='fixed left-0 w-screen h-screen z-[9999] hidden' style={{backgroundColor:'rgba(0,0,0,0.1)'}}>
      <div className='absolute bottom-2 right-5'>
        <div className='w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-green-600 border-l-white animate-spin '>
        </div>
      </div>     
      </div> 
      
      <div className={`md:h-screen flex flex-col flex-1 bg-[#FAFAFD]
      md:max-h-screen overflow-hidden`}>

      <div className={`flex z-[40] bg-white w-full`}>
        <Navbar/>
      </div>
      
      
      <div className='border flex-1 overflow-hidden bg-white h-full w-full'>
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
