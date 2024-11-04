
import { parseISO,format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import {FaLockOpen, FaUserShield} from 'react-icons/fa'
import { MdBlock, MdOutlineSkipPrevious, MdSkipNext } from 'react-icons/md'
import { hideLoading, showLoading } from '../../../utility/loading'
import { toast } from 'react-toastify'
import SearchBox from '../../components/SearchBox'
import Axios from '../../../utility/axios'

const TableRow = ({data,setUsersDetails})=>{

    const onDelete = ()=>{

        if(window.confirm('Delete the user?')){

            showLoading()

            Axios.post('/users/delete', {user_id:data.id}).then(result=>{
                toast('User deleted', {type:'success'})
            
                setUsersDetails(prev=>{

                    let newUsers = prev.data.filter((v,i)=>{
                        return data.id != v.id
                    })

                    return {...prev,data:newUsers}
                })

            }).catch(e=>{
                console.log(e.response)
            }).finally(()=>{
                hideLoading()
            })
        }
        
    }

    const onBlock = ()=>{

        
        showLoading()
        Axios.post('/users/block', {user_id:data.id}).then(result=>{
        
            setUsersDetails(prev=>{

                let users = {...prev}

                for(let user of users.data ){

                    if(user.id == data.id){

                        let is_blocked = user.block

                        if(is_blocked == 0){
                            is_blocked = 1
                        }else{
                            is_blocked = 0
                        }

                        user.block = is_blocked

                        break
                    }
                }

                return users

            })

        }).catch(e=>{
            console.log(e.response)
        }).finally(()=>{
            hideLoading()
        })
        
        
    }

    const onAdmin = ()=>{

        
        showLoading()
        Axios.post('/adms/make-admin', {user_id:data.id}).then(result=>{
        
            setUsersDetails(prev=>{

                let users = {...prev}

                for(let user of users.data ){

                    if(user.id == data.id){

                        let is_admin = user.is_admin

                        if(is_admin == 0){
                            is_admin = 1
                        }else{
                            is_admin = 0
                        }

                        user.is_admin = is_admin

                        break
                    }
                }

                return users

            })

        }).catch(e=>{
            console.log(e.response)
        }).finally(()=>{
            hideLoading()
        })
        
        
    }


    return <tr>
        <td className='text-sm border-b dark:border-b-slate-800 py-3'>
            <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-purple-900 text-white font-bold uppercase flex items-center justify-center text-lg'>
                    {data.first_name ? data.first_name[0]: '-'}
                </div>
                <p>{data.first_name ? `${data.first_name} ${data.last_name}` : '-'}</p>
            </div>
        </td>
        <td className='text-sm border-b dark:border-b-slate-800'>{data.email}</td>
        <td className='border-b text-sm dark:border-b-slate-800'>{data.phone}</td>
        <td className='text-sm border-b dark:border-b-slate-800'>{data.created_at && format(parseISO(data.created_at), 'dd MMM Y')}</td>
        <td className='border-b dark:border-b-slate-800'>
            <div className='space-x-2'>
                <button className='text-red-600' title='Make/unmake admin' onClick={onAdmin}>
                    {data.is_admin == 1 ? <FaUserShield size={18} className='text-green-600'/> : <FaUserShield size={18}/>}
                    
                </button>
                <button className='text-red-600' title='Block user' onClick={onBlock}>
                    {data.block == 1 ? <FaLockOpen size={18} className='text-sky-600'/> : <MdBlock size={18}/>}
                    
                </button>
                <button className='text-red-600' title='Delete user' onClick={onDelete}>
                    <BsTrash size={18}/>
                </button>
            </div>
        </td>
    </tr>
}

const AdmsAdmins = () => {
    const [usersDetails, setUsersDetails] = useState({data:[]})

    const onshowMore = (url)=>{

        //parse the url
        let link  = new URL(url)
        let path = link.pathname
        let pageParam = link.searchParams.get('page')

       showLoading()

        Axios.get(path, {params:{page:pageParam}}).then(data=>{
            setUsersDetails(data.data.data)
        }).catch(e=>{

            console.log(e)
        }).finally(()=>{

            hideLoading()
        })

    }

    useEffect(()=>{

        Axios.get('/adms/admins').then(data=>{

            let users = data.data.data
            setUsersDetails(users)

        }).catch(e=>{

            console.log(e.response)
        })


    },[])


    if(!usersDetails?.data.length){

        return <div className='h-full flex flex-col items-center justify-center'>
            <div className='text-center text-sm'>
                <h1 className='font-bold text-xl'>Empty Users</h1>
                <p>You current do not have any users</p>
            </div>
        </div>
    }
    
  return (
    <div className='h-full p-3'>
        <div>
            <div>
                <h1 className='text-lg font-bold'>Admins</h1>
                <p className='text-xs font-semibold leading-none'>This is the full list of all admin on the application</p>
            </div>  
            <div className='md:flex justify-between mt-5'>
                <div></div>
                <div className='w-full md:w-3/5'>
                    <SearchBox type={'admin'} statefn={setUsersDetails}/>
                </div>
            </div>  
            <div className='mt-5 overflow-x-scroll'>
                <table className='w-full table-auto text-black dark:text-slate-400'>
                    <thead>
                        <tr>
                            <th className='text-left font-semibold text-sm'>Fullname</th>
                            <th className='text-left font-semibold text-sm'>Email</th>
                            <th className='text-left font-semibold text-sm'>Phone</th>
                            <th className='text-left font-semibold text-sm'>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersDetails && usersDetails?.data.map((v,i)=>{
                            return <TableRow key={i} setUsersDetails={setUsersDetails} data={v}/>
                        })}
                        
                        
                    </tbody>
                </table>
                    {usersDetails && (usersDetails?.links.length - 2) > 1 && (<div className='flex gap-1 items-center float-right'>
                        {usersDetails?.links.map((v,i,arr)=>{

                            let btn;

                            if(i == 0){

                                btn = <button key={i} onClick={()=>onshowMore(v.url)} className={v.url?'inline-block':'hidden'}><MdOutlineSkipPrevious/></button>
                            }else if(i == arr.length - 1){
                                btn = <button key={i} onClick={()=>onshowMore(v.url)} className={v.url?'inline-block':'hidden'}><MdSkipNext /></button>
                            }
                            else{
                                btn = <button key={i}  onClick={()=>onshowMore(v.url)} className={`${v.active && 'border-b border-b-sky-800'}`}>{v.label}</button>
                            }
                            return btn
                        })}
                    </div>)}
            </div>   
        </div>
    </div>
  )
}

export default AdmsAdmins