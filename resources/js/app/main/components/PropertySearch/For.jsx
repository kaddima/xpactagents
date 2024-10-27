import React from 'react'

const For = ({setSearchValues}) => {

    const onChange = (e)=>{
        let value = e.target.value

        setSearchValues(prev=>{

            return {...prev, category:{category:value}}
        })
     
    }

  return (
    <div className='bg-white rounded shadow-sm text-slate-500 text-sm'>
        <div className='space-y-3'>
            <div className='border-b py-2'>
                <input type="radio" id='for_rent' onChange={onChange} name='category' value={'rent'} className='form-radio border h-6 w-6'/>
                <label htmlFor='for_rent' className='pl-3'>For rent</label>
            </div>
            <div className='border-b py-2'>
                <input type="radio" id='for_sell' onChange={onChange} name='category' value={'sell'} className='form-radio border h-6 w-6'/>
                <label htmlFor='for_sell' className='pl-3'>For Sell</label>
            </div>
            <div className='border-b py-2'>
                <input type="radio" id='short_let' onChange={onChange} name='category' value={'short_let'} className='form-radio border h-6 w-6'/>
                <label htmlFor='short_let' className='pl-3'>Short Let</label>
            </div>
            <div>
                <input type="radio" id='land' onChange={onChange} name='category' value={'land'} className='form-radio border h-6 w-6'/>
                <label htmlFor='land' className='pl-3'>Land</label>
            </div>
        </div>
    </div>
  )
}

export default For