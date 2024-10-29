import React, { useEffect, useMemo, useState } from 'react'
import { states_n_lga } from '../../data/data'

const States = ({setSearchValues=()=>{},register=()=>{},rounded=false,className,optState}) => {

  const [state,setState] = useState({state:null,lga:null})

  const onChange = (e)=>{

    let name = e.target.name
    let value = e.target.value

    setSearchValues(prev=>{

      if(name == 'state'){

        return {...prev, state_lga:{[name]:value}}
      }

       return {...prev, state_lga:{...prev.state_lga, [name]:value}}
    })

    setState(prev=>{

      return {...prev, [name]:value}
    })
    
  }

  const lgas = useMemo(()=>{

    for(let i=0,len=states_n_lga.length; i<len; i++){

      if(state.state && states_n_lga[i].name.toLowerCase() == state.state.toLowerCase()){

        return states_n_lga[i].lgas
      }

      if(optState && states_n_lga[i].name.toLowerCase() == optState?.toLowerCase()){
        return states_n_lga[i].lgas
      }
    }

  },[state,optState])

  useEffect(()=>{

    return ()=>{

      setState({state:null,lga:null})
    }
  },[])

  return (
  <div className='w-full'>
    <div className='flex items-center space-x-3 w-full'>
      <div className='flex-1'>
        <select  {...register('state',{required:"Please choose a state"})} name="state" onChange={onChange} className={`${rounded} form-select w-full ${className}`} placeholder='Choose States'>
          <option value="">Select the state</option>
           {states_n_lga.map((v,i)=>{

            return <option key={i} value={v.name}>{v.name}</option>
          })}
        </select>
      </div>

      <div className='flex-1'>
        <select {...register('lga',{required:"Choose the Lga"})} name='lga' defaultValue={'Epe'} onChange={onChange} className={`${rounded} form-select w-full ${className}`} placeholder='Choose LGA'>
          <option value="">Select lga</option>
          {lgas ? lgas.map((v,i)=>{

          return <option key={i} value={v}>{v}</option>
          }) : null}
        </select>
      </div>
    </div>
     
   
  </div>
  )
}

export default States