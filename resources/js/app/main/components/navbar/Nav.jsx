import React, { useState } from 'react'
import { MdArrowDropDown } from 'react-icons/md'

const Nav = () => {
    const [nav, setNav] = useState()

    const onNavClick = (e)=>{

        let action = $(e.currentTarget).data('value')

        setNav(action)

       // console.log(action)

    }
  return (
    <div className='w-full '>
        <div className=''>
        <div className='flex items-center space-x-3'>
                <div>
                    +234 80-344-71234
                </div>
                <div className='flex flex-col max-w-[150px] '>
                    <button data-value={'for'} onClick={onNavClick} className='px-3 h-[2.5rem] rounded flex items-center space-x-1 text-sm w-full'>
                        <span>Buy</span>
                        <MdArrowDropDown/>
                    </button>

                    <div className={`${nav == 'for' ? 'block' : 'hidden'} relative w-0 h-0 overflow-visible z-[800] cursor-auto`}>
                        <div className='p-0 pb-[1rem] absolute top-0 left-0 shadow-[-0.8px_0.25px_3px_2.5px_rgba(0,0,0,.15)]   
                        leading-[1.25] rounded-[5px] mt-[0.5em] w-[371px] max-h-[620px] border'>
                        
                            <div className='px-5 py-3'>
                                heyyyy
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col max-w-[150px]'>
                    <button data-value={'price'} onClick={onNavClick} className='border px-3 h-[2.5rem] rounded flex items-center space-x-3 text-sm '>
                        <span>Price </span>
                        <MdArrowDropDown/>
                    </button>

                    <div className={`${nav == 'price' ? 'block' : 'hidden'} relative w-0 h-0 overflow-visible z-[800] cursor-auto`}>
                        <div className='p-0 pb-[1rem] absolute top-0 left-0 shadow-[-0.8px_0.25px_3px_2.5px_rgba(0,0,0,.15)]   
                        leading-[1.25] rounded-[5px] mt-[0.5em] w-[371px] max-h-[620px]'>
                            <div className='px-5 py-3 space-y-3'>
                                <h1 className='font-xl font-semibold mb-1'>Price</h1>
                            </div>
                           
                        </div>
                    </div>
                </div>
                <div className='flex flex-col max-w-[150px]'>
                    <button data-value={'state'} onClick={onNavClick} className='border px-3 h-[2.5rem] rounded flex items-center space-x-3 text-sm '>
                        <span>State</span>
                        <MdArrowDropDown/>
                    </button>

                    <div className={`${nav == 'state' ? 'block' : 'hidden'} relative w-0 h-0 overflow-visible z-[800] cursor-auto`}>
                        <div className='p-0 pb-[1rem] absolute top-0 left-0 shadow-[-0.8px_0.25px_3px_2.5px_rgba(0,0,0,.15)]   
                        leading-[1.25] rounded-[5px] mt-[0.5em] w-[371px] max-h-[620px]'>
                            <div className='px-5 py-3 space-y-3'>
                                <h1 className='text-sm font-semibold mb-1'>States/LGA</h1>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='flex flex-col max-w-[150px]'>
                    <button data-value={'hometype'} onClick={onNavClick} className='border px-3 h-[2.5rem] rounded flex items-center space-x-3 text-sm '>
                        <span>Home type</span>
                        <MdArrowDropDown/>
                    </button>

                    <div className={`${nav == 'hometype' ? 'block' : 'hidden'} relative w-0 h-0 overflow-visible z-[800] cursor-auto left-[100%]`}>
                        <div className='p-0 pb-[1rem] absolute top-0 right-0 shadow-[-0.8px_0.25px_3px_2.5px_rgba(0,0,0,.15)]   
                        leading-[1.25] rounded-[5px] mt-[0.5em] w-[371px] max-h-[620px] px-3'>
                            <div className='py-3 w-full overflow-x-scroll space-y-3'>
                                <h1 className='text-sm font-semibold mb-1'>Home Type</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col max-w-[150px]'>
                    <button data-value={'bedsbaths'} onClick={onNavClick} className='border px-3 h-[2.5rem] rounded flex items-center space-x-3 text-sm '>
                        <span>Beds/Baths</span>
                        <MdArrowDropDown/>
                    </button>
 
                    <div className={`${nav == 'bedsbaths' ? 'block' : 'hidden'} relative w-0 h-0 overflow-visible z-[800] cursor-auto left-[100%]`}>
                        <div className='p-0 pb-[1rem] absolute top-0 right-0 shadow-[-0.8px_0.25px_3px_2.5px_rgba(0,0,0,.15)]   
                        leading-[1.25] rounded-[5px] mt-[0.5em] w-[371px] max-h-[620px]'>
                            <div className='px-5 py-3 space-y-3'>
                                <h1 className='text-sm font-semibold mb-1'>Beds/Baths</h1>
                                
                            </div>
                        </div>
                    </div>
                </div>        
            </div>
        </div>
    </div>
  )
}

export default Nav