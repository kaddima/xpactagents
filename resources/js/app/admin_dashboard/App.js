import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, SideBar } from "./components"

import {
	PropertyDetails, EditProperty,
	ChangePassword,
	PropertiesByCategory,
	Tours,
	Profile
} from './pages';

import { getGeneralData } from './store/userSlice';
import "./App.css"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ListingsPage from './pages/ListingsPage';
import Account from './pages/account/Account';
import CompleteRegistration from './pages/account/CompleteRegistration';
import EditProfile from './pages/account/EditProfile';
import MessageLayout from './pages/Messages/MessageLayout';
import Favorites from './pages/Favorites';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/AdminDashboard';
import RegularUser from './pages/Users/RegularUser';
import Agents from './pages/Users/Agents';
import Agent from './pages/Agent/Agent';
import AgentOverview from './pages/Agent/AgentOverview';
import AgentListing from './pages/Agent/AgentListing';
import AgentProfile from './pages/Agent/AgentProfile';
import Users from './pages/Users/Users';
import UsersOverview from './pages/Users/UsersOverview';
import AgentTours from './pages/Agent/AgentTours';
import Adms from './pages/adms/Adms';
import AdminOverview from './pages/adms/AdminOverview';
import CreateAdmin from './pages/adms/CreateAdmin';
import AdmsUsers from './pages/adms/AdmsUsers';
import AdmsAdmins from './pages/adms/AdmsAdmins';

function App() {
	const dispatch = useDispatch()
	const year = new Date()
	// get the display state of account modal (true/false)
	const displayMode = useSelector(state => state.main.displayMode)

	useEffect(() => {
		dispatch(getGeneralData())
	}, [])

	return (
		<div className={displayMode}>
			<BrowserRouter>
				<div className='md:flex w-screen h-screen overflow-hidden relative 
                bg-white dark:bg-main-dark-bg text-black dark:text-slate-400'>

					<div className='h-full w-48 sidebar hidden md:block'>
						<SideBar />
					</div>

					<div id='spinner'
						className='fixed left-0 w-screen h-screen z-[9999] hidden'
						style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
						<div className='fixed bottom-2 right-5 w-10 h-10 md:w-16 md:h-16 
                        rounded-full border-4 border-green-600 border-l-white animate-spin '>
						</div>
					</div>
					<div className={`h-full w-full xl:w-[calc(100vw-192px)]`}>
						<div className={`flex z-[100] bg-neutral-100 dark:bg-slate-900 w-full`}>
							<Navbar />
						</div>
						<div className='overflow-auto w-full overflow-x-hidden md:px-2 pt-1'
							id='main'
							style={{ height: "calc(100% - 94px)" }}>
							<Routes>
								{/* Dashbord */}
								<Route path='/admins' element={<AdminDashboard />} />
								<Route path='/admins/dashboard' element={<AdminDashboard />} />
								{/* <Route path='/admins/create-property' element={<CreateProperty />} /> */}
								<Route path='/admins/users' element={<Users />}>
									<Route index element={<UsersOverview />} />
									<Route path='overview' element={<UsersOverview />} />
									<Route path='users' element={<RegularUser />} />
									<Route path='agents' element={<Agents />} />
								</Route>
								<Route path='/admins/adms' element={<Adms />}>
									<Route index element={<AdminOverview />} />
									<Route path='overview' element={<AdminOverview />} />
									<Route path='create-admin' element={<CreateAdmin />} />
									<Route path='users' element={<AdmsUsers />} />
									<Route path='admins' element={<AdmsAdmins />} />
								</Route>
								<Route path='/admins/listings/:id' element={<PropertyDetails />} />
								<Route path="/admins/listings/:id/edit" element={<EditProperty />} />
								<Route path="/admins/tours" element={<Tours />} />
								<Route path="/admins/listings" element={<ListingsPage />} />
								<Route path="/admins/listings/search" element={<SearchPage />} />
								<Route path="/admins/favorites" element={<Favorites />} />
								<Route path='/admins/property/category/:name' element={<PropertiesByCategory />} />
								<Route path='/admins/account' element={<Account />}>
									<Route index element={<Profile />} />
									<Route path='profile' element={<Profile />} />
									<Route path='edit-profile' element={<EditProfile />} />
									<Route path='change-password' element={<ChangePassword />} />
									<Route path='complete-registration' element={<CompleteRegistration />} />
								</Route>
								<Route path='/admins/users/agent/:id' element={<Agent />}>
									<Route index element={<AgentOverview />} />
									<Route path='overview' element={<AgentOverview />} />
									<Route path='listings' element={<AgentListing />} />
									<Route path='tours' element={<AgentTours />} />
									<Route path='agent-profile' element={<AgentProfile />} />
									<Route path='messages' element={<MessageLayout />} />
								</Route>
								<Route path='/admins/q-r' element={<MessageLayout />} />
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
