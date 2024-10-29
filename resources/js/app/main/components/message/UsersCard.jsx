import React,{useMemo} from 'react'
import { useSearchParams } from 'react-router-dom'

const UsersCard = ({data,conversation_id,lastMsg,unreadCount}) => {
  const [searchParams,setSearchParams] = useSearchParams()

  const onClick = ()=>{
  let params = {}
    
  searchParams.forEach((v,k)=>{
    params[k] = v
  })

  setSearchParams({...params, 'conversation-id':conversation_id,activeuser:data.id}) 
  }
  
  return (
  <div onClick={(e)=>onClick()} 
    className={`max-h-[50px] text-neutral-600 text-xs w-full cursor-pointer ${conversation_id == searchParams.get('conversation-id') ? 'border-r-[2px] border-neutral-300' :''}`}>
    <div className='flex items-center px-2'>
    <div className='w-[40px] h-[40px] font-bold text-white flex justify-center items-center text-lg bg-slate-400 mr-2 border rounded-full text-center'>
      {data.first_name[0]}
    </div>
    <div className='flex-1 w-[170px]'>
      <div className='flex justify-between items-center mb-1 text-[11px]'>
      <h1 className=' font-bold text-sky-600'>{data.first_name} {data.last_name}</h1>
      <p>3min, ago </p>
      </div>
      <div className='flex justify-between items-center w-full'>
      <p className='flex-1 text-ellipsis overflow-hidden h-[22px] w-full leading-none text-[10px]'>{lastMsg.body}</p>
      <p className='bg-sky-600 font-bold flex justify-center items-center h-[13px] w-[13px] rounded-full text-center text-white text-[10px]'>{unreadCount}</p>
      </div>
    </div>
    </div>
  </div>
  )
}

export default UsersCard