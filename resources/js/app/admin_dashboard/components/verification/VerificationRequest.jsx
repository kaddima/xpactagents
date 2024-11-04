import React, { useEffect, useState } from 'react'
import { parseISO,format } from 'date-fns'
import { MdBlock, MdOutlineSkipPrevious, MdSkipNext } from 'react-icons/md'
import { hideLoading, showLoading } from '../../../utility/loading'
import { toast } from 'react-toastify'
import Axios from '../../../utility/axios'
import VerificationDetails from './VerificationDetails'


const TableRow = ({data,setUsersDetails,setDetailsModal})=>{

    const onDetails = ()=>{

        setDetailsModal(prev=>{
           console.log( {open:true, data:data})
            return {open:true, data:data}
        })
    }

    return <tr>
        <td className='text-sm border-b dark:border-b-slate-800 py-3'>
            <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-purple-900 text-white font-bold uppercase flex items-center justify-center text-lg'>
                    {data.fullname ? data.fullname[0]: '-'}
                </div>
                <p>{data.fullname ? `${data.fullname}` : '-'}</p>
            </div>
        </td>
        <td className='text-sm border-b dark:border-b-slate-800'>{data.doc_type}</td>
        <td className='text-sm border-b dark:border-b-slate-800'>{data.created_at && format(parseISO(data.created_at), 'dd MMM Y')}</td>
        <td className='border-b dark:border-b-slate-800'>
			<button className='text-sky-600' title='More details' onClick={onDetails}>
				Details
			</button>
               
        </td>
    </tr>
}

const VerificationRequest = () => {
 
    const [usersDetails, setUsersDetails] = useState({data:[]})
    const [detailsModal,setDetailsModal] = useState({open:false,data:null})

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

        Axios.get('/admin/users/verification-request').then(data=>{

            let users = data.data.data
            setUsersDetails(users)

        }).catch(e=>{

            console.log(e.response)
        })

    },[])


    if(!usersDetails?.data.length){

        return <div className='h-full flex flex-col items-center justify-center dark:bg-slate-900 bg-neutral-100'>
            <div className='text-center text-sm'>
                <h1 className='font-bold text-xl'>Empty verification request</h1>
                <p>No user request for verification badge at the moment</p>
            </div>
        </div>
    }
    
  return (
    <div className='p-3 dark:bg-slate-900 bg-neutral-100'>
        <div>
            <div>
                <h1 className='text-lg font-bold'>Verification Requests</h1>
                <p className='text-xs font-semibold leading-none'>This is the table of users currently requesting for a verification badge</p>
            </div>  
            <div className='mt-5 overflow-x-scroll'>
                <table className='w-full table-auto text-black dark:text-slate-400'>
                    <thead>
                        <tr>
                            <th className='text-left font-semibold text-sm'>Fullname</th>
                            <th className='text-left font-semibold text-sm'>doc_type</th>
                            <th className='text-left font-semibold text-sm'>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersDetails && usersDetails?.data.map((v,i)=>{
                            return <TableRow key={i} setUsersDetails={setUsersDetails} data={v} setDetailsModal={setDetailsModal}/>
                        })}                        
                    </tbody>
                </table>
                    {usersDetails && (usersDetails?.links.length - 2) > 1 && (<div className='flex gap-1 items-center float-right mt-4'>
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
        {detailsModal.open && <VerificationDetails details={detailsModal.data} setDetailsModal={setDetailsModal}/>}
        
    </div>
  )

}

export default VerificationRequest