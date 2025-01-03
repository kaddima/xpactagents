import React, { useEffect, useState } from 'react'
import UserProfile from './UserProfile'
import UsersCard from './UsersCard'
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from 'react-router-dom'
import Axios from '../../../utility/axios'
import { useDispatch, useSelector } from 'react-redux'
import { updateMessages, updateParticipants } from '../../store/messageSlice'
import EmptyState from '../EmptyState'
import Chat from './Chat'
import { useMemo } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { BsChevronBarLeft, BsChevronDoubleLeft, BsChevronLeft } from 'react-icons/bs'
import errorHandler from '../../../utility/errorHandler'

const Message = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const dispatch = useDispatch()
	const participants = useSelector(state => state.message.participants)
	const [messages, setMessages] = useState({data:[],meta:{}})
	const [showUserPofile, setShowUserProfile] = useState(false)

	let property_of_interest = searchParams.get('property-of-interest')
	let conversation_id = searchParams.get('conversation-id')

	let activeUser = searchParams.get('activeuser')

	const activeUserInfo = useMemo(() => {
		if (participants.data.length && activeUser) {

			for (let i = 0, len = participants.data.length; i < len; i++) {
				if (participants.data[i].user_details.id == activeUser) {
					return participants.data[i].user_details
				}
			}
		}

		return {}
	}, [activeUser, participants])


	useEffect(() => {

		if (property_of_interest) {
			Axios.get(`/agents/properties/${property_of_interest}/conversations`).then(data => {
				dispatch(updateParticipants(data.data.data))
			}).catch(e => {
				errorHandler(e)
			})
		}

		if (property_of_interest && conversation_id) {
			Axios.get(`/properties/conversations/${conversation_id}/messages`).then(data => {
				// reverse the messages so that latest message would be at the bottom
				let reverseData = data.data.data.data.reverse()
				let meta = data.data.data.meta
				setMessages({data:reverseData, meta})
			}).catch(e => {
				errorHandler(e)
			})
		}

		return () => {
			setMessages({data:[],meta:{}})
		}
	}, [searchParams])

	if (!participants.data.length) {
		return <EmptyState title='Empty user interest' subtitle='Click on a property of interest to display messages' />
	}

	return (
		<div className='w-full h-full overflow-hidden '>
			<div className='h-full md:flex'>
				<div className={`${activeUser && 'hidden md:block'} bg-neutral-50 dark:bg-slate-950 h-full w-[90%] md:w-[200px] space-y-5 py-2 overflow-scroll`}>
					<h1 className='text-xs uppercase font-bold pb-3 mb-3 px-2 border-b'>Interested users</h1>
					{property_of_interest && participants.data.map((v, i) => {
						return <UsersCard key={i} data={v.user_details}
							conversation_id={v.conversation_id}
							lastMsg={v.last_msg}
							unreadCount={v.unread_messages_count} />
					})}
				</div>
				<div className='flex-1 relative'>
					<div className='md:hidden'>
						<FaArrowLeft onClick={() => setSearchParams({ 'property-of-interest': property_of_interest })} />
					</div>
					{!conversation_id && <EmptyState title='Conversation display' subtitle='Click a user to view your messages' />}
					{conversation_id && messages.data?.length > 0 && <div className='flex w-full h-full'>

						<Chat messages={messages.data} setMsg={setMessages} activeUserInfo={activeUserInfo} />

						<div onClick={() => setShowUserProfile(prev => !prev)} 
						className={`${showUserPofile ? 'translate-x-0' : 'translate-x-[200px] md:translate-x-0'} transition right-0 cursor-pointer absolute w-[200px] bg-neutral-50 dark:bg-slate-950 md:relative`}>
							<UserProfile activeUserInfo={activeUserInfo} />
							<div className='h-[30px] bg-white dark:bg-slate-700 dark:text-white  shadow-md w-[20px] md:hidden rounded-tl-full text-sky-600 rounded-bl-full absolute top-2/4 -left-4 flex items-center'>
								<BsChevronDoubleLeft size={18} fontWeight={800} />
							</div>
						</div>
					</div>}

				</div>


			</div>
		</div>
	)
}

export default Message