import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import $ from 'jquery'

import './App.css';

function App() {

  return (
  <div className={`white`}>
    <BrowserRouter>
    <div className='flex w-screen h-screen relative overflow-hidden'>
       
      {<AccountModal/>}
      
      <div id='spinner' className='fixed left-0 w-screen h-screen z-[9999] hidden' style={{backgroundColor:'rgba(0,0,0,0.1)'}}>
      <div className='absolute bottom-3 right-5'>
        <div className='w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-blue-600 border-l-white animate-spin '>
        </div>
      </div>
      
      </div>
      
      {activeMenu && (
      <div className='h-full w-48 sidebar '>
        <SideBar/>
      </div>
       )} 
      
      <div className={`md:h-screen flex flex-col flex-1 gap-1 bg-[#FAFAFD]
      md:max-h-screen overflow-hidden`}>

      <div className={`flex z-[100] bg-white dark:bg-secondary-dark-bg h-16`}>
        <Navbar/>
      </div>
      
      
      <div className='flex-1 overflow-auto p-1'>
         <Routes>
      {/* Dashbord */}
        <Route path='/dashboard' element={<Dashbord/>}>
          <Route index element={<Overview/>}/>
          <Route path='overview' element={<Overview/>}/> 
          <Route path='request' element={<Request/>}/>
        </Route>
        <Route path='/dashboard/transfer' element={<Transfer/>}>
          <Route index element={<WireTransfer/>}/>
          <Route path='wire-transfer' element={<WireTransfer/>}/> 
          <Route path='local-transfer' element={<LocalTransfer/>}/>
          <Route path='success' element={<TransferSuccess/>}/>
          <Route path='failed-transfer' element={<FailedTransfer/>}/>
        </Route>
        <Route path='/dashboard/statements' element={<Statements/>}/>
        <Route path='/dashboard/card' element={<Card/>}/>
        <Route path='/dashboard/account' element={<Account/>}>
          <Route index element={<Profile/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='pin' element={<Pin/>}/>
          <Route path='change-password' element={<ChangePassword/>}/>
        </Route>
         
        </Routes>
      </div>

      <div className="pt-5 pl-2 text-[10px] text-center font-semibold md:text-xs bg-white">
        <span>
        Copyright (c) {year.getUTCFullYear()} First Abu Dhabi Bank. All Rights Reserved.
        </span>
      </div>
      <ToastContainer/>
      </div>    
    </div>
    </BrowserRouter>   
  </div>
  );
}

export default App;
