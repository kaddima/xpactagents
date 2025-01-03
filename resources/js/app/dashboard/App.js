import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Navbar, SideBar } from "./components"

import {
	PropertyDetails, EditProperty,
	ChangePassword,
	PropertiesByCategory,
	Dashboard, Tours,
	Profile
} from './pages';

import { getGeneralData } from './store/userSlice';
import "./App.css"

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import CreateProperty from './pages/CreateProperty';
import ListingsPage from './pages/ListingsPage';
import Account from './pages/account/Account';
import CompleteRegistration from './pages/account/CompleteRegistration';
import EditProfile from './pages/account/EditProfile';
import MessageLayout from './pages/Messages/MessageLayout';
import Favorites from './pages/Favorites';
import SearchPage from './pages/SearchPage';
import IdVerification from './pages/account/IdVerification';
import { getPropertyOfInterest } from './store/messageSlice';

function App() {
	const displayMode = useSelector(state => state.main.displayMode)
	const dispatch = useDispatch()
	const year = new Date()

	useEffect(() => {
		dispatch(getGeneralData())
		//load the user's message as well
		dispatch(getPropertyOfInterest())
	}, [])


	return (
		<div className={displayMode}>
			<BrowserRouter>
				<div className='md:flex w-screen h-screen relative overflow-hidden dark:bg-main-dark-bg bg-white text-black dark:text-slate-400'>

					{/* {accountModalDisplay && <AccountModal/>} */}


					<div className='h-full w-48 sidebar hidden md:block'>
						<SideBar />
					</div>


					<div id='spinner' className='fixed left-0 w-screen h-screen z-[9999] hidden' style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
						<div className='fixed bottom-2 right-5 w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-green-600 border-l-white animate-spin '>
						</div>
					</div>

					<div className={`h-full w-full xl:w-[calc(100vw-192px)]
                        `}>

						<div className={`flex z-[100] bg-neutral-100 dark:bg-slate-900 w-full`}>
							<Navbar />
						</div>


						<div className='overflow-auto w-full overflow-x-hidden md:px-8' id='main' style={{ height: "calc(100% - 90px)" }}>
							<Routes>
								{/* Dashbord */}
								<Route path='/dashboard' element={<Dashboard />} />
								<Route path='/dashboard/create-property' element={<CreateProperty />} />
								<Route path='/dashboard/property/:id' element={<PropertyDetails />} />
								<Route path="/dashboard/property/:id/edit" element={<EditProperty />} />
								<Route path="/dashboard/tours" element={<Tours />} />
								<Route path="/dashboard/listings" element={<ListingsPage />} />
								<Route path="/dashboard/listings/search" element={<SearchPage />} />
								<Route path="/dashboard/listings/favorites" element={<Favorites />} />
								<Route path='/dashboard/property/category/:name' element={<PropertiesByCategory />} />
								<Route path='/dashboard/account' element={<Account />}>
									<Route index element={<Profile />} />
									<Route path='profile' element={<Profile />} />
									<Route path='edit-profile' element={<EditProfile />} />
									<Route path='change-password' element={<ChangePassword />} />
									<Route path='complete-registration' element={<CompleteRegistration />} />
									<Route path='verify-identity' element={<IdVerification />} />
								</Route>
								<Route path='/dashboard/q-r' element={<MessageLayout />} />
							</Routes>

							<ToastContainer />
						</div>

						<div className="pt-5 pl-2 text-[10px] text-center font-semibold md:text-xs  ">
							<span>
								Copyright (c) {year.getUTCFullYear()} Xpact Agent Real Estate. All Rights Reserved.
							</span>
						</div>
					</div>

				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
