import {Outlet, NavLink} from "react-router-dom"
import { MdDashboard, MdGroupAdd} from "react-icons/md"
import {TbUsers, TbUsersGroup} from 'react-icons/tb'

const Adms = () => {

  
    return (
    <div className='h-full overflow-hidden'>
        <div className='mb-1 h-10 flex justify-between items-center pr-3 pl-3 bg-neutral-100 dark:bg-slate-900'>
            <p className='text-sm font-bold'>Admin management system</p>
        </div>
        <div className='h-[calc(100%-44px)] md:flex md:gap-1'>
            <div className='md:w-[200px] pt-2 bg-neutral-100 dark:bg-slate-900'>
                <div className='flex md:block flex-wrap md:h-full my-1 space-x-1 md:space-x-0'>
                    <NavLink to={`/admin/adms/overview`}
                        className={({isActive})=>isActive ? 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative bg-neutral-100 dark:bg-slate-800' : 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative'}>
                            
                        <span className='text-xl'><MdDashboard/></span>
                        <span className='ml-2 text-xs font-bold capitalize'>Overview</span>
                    </NavLink>
                    <NavLink to={`/admin/adms/admins`}
                        className={({isActive})=>isActive ? 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative bg-neutral-100 dark:bg-slate-800' : 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative'}>
                            
                        <span className='text-xl'><TbUsersGroup /></span>
                        <span className='ml-2 text-xs font-bold capitalize'>All admin</span>
                    </NavLink>
                    <NavLink to={`/admin/adms/users`}
                        className={({isActive})=>isActive ? 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative bg-neutral-100 dark:bg-slate-800' : 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative'}>
                            
                        <span className='text-xl'><TbUsers /></span>
                        <span className='ml-2 text-xs font-bold capitalize'>Users</span>
                    </NavLink>   
                    {/* <NavLink to={`/admin/adms/create-admin`}
                        className='flex hover:dark:bg-slate-800 cursor-pointer border-r-2 border-r-transparent
                            items-center py-3 pl-2'>
                            
                        <span className='text-xl'><MdGroupAdd /></span>
                        <span className='ml-2 text-xs font-bold capitalize'>Create admin</span>
                    </NavLink>  */}
                                    
                </div>
            </div>
            <div className='flex-1 md:h-full h-[calc(100%-48px)] overflow-scroll px-2 pt-7 md:pt-1 bg-neutral-100 dark:bg-slate-900'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Adms