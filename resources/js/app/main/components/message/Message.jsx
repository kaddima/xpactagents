import React, { useEffect, useState } from 'react'
import UserProfile from './UserProfile'
import { useSearchParams } from 'react-router-dom'
import Axios from '../../../utility/axios'
import { useDispatch, useSelector } from 'react-redux'
import EmptyState from '../EmptyState'
import Chat from './Chat'
import { useMemo } from 'react'
import { BsChevronDoubleLeft } from 'react-icons/bs'
import errorHandler from '../../../utility/errorHandler'

const Message = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const getPropertyOfInterest = useSelector(state => state.message.propertyOfInterest)
	const [messages, setMessages] = useState({data:[], meta:{}})
	const [showUserPofile, setShowUserProfile] = useState(false)
	let property_of_interest = searchParams.get('property-of-interest')
	let conversation_id = searchParams.get('conversation-id')

	const activeAgentInfo = useMemo(() => {
		if (getPropertyOfInterest.data.length) {

			for (let i = 0, len = getPropertyOfInterest.data.length; i < len; i++) {
				if (getPropertyOfInterest.data[i].property_details.id == property_of_interest) {
					return getPropertyOfInterest.data[i].property_details.agentDetails
				}
			}
		}
	}, [property_of_interest])

	useEffect(() => {
		if (property_of_interest && conversation_id) {
			Axios.get(`/properties/conversations/${conversation_id}/messages`).then(data => {
				// reverse the messages so that latest message would be at the bottom
				let reverseData = data.data.data.data.reverse()
				let meta = data.data.data.meta
				setMessages({ data: reverseData, meta })
			}).catch(e => {
				errorHandler(e)
			})
		}

		return () => {
			setMessages({data:[], meta:{}})
		}
	}, [searchParams])

	return (
		<div className='relative w-full h-full overflow-hidden'>
			{!conversation_id && 
			<EmptyState title='Conversation display' subtitle='Click a user to view your messages' />}

			{conversation_id && messages.data.length > 0 && <div className='flex w-full h-full'>
				<Chat messages={messages.data} setMsg={setMessages} activeUserInfo={activeAgentInfo} />
				<div onClick={() => setShowUserProfile(prev => !prev)} 
				className={`${showUserPofile ? 'translate-x-0' 
				: 'translate-x-[200px] md:translate-x-0'} transition right-0 cursor-pointer absolute 
				w-[200px] bg-neutral-100 dark:bg-slate-800 md:relative`}>
					<UserProfile activeUserInfo={activeAgentInfo} />
					<div className='h-[30px] shadow-md w-[20px] md:hidden rounded-tl-full bg-white 
					dark:bg-slate-700 dark:text-white text-sky-600 rounded-bl-full absolute top-2/4 -left-4 flex items-center'>
						<BsChevronDoubleLeft size={18} fontWeight={800} />
					</div>
				</div>
			</div>}
		</div>
	)
}

export default Message