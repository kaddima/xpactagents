import React, { useEffect, useMemo, useState } from 'react'
import { states_n_lga } from '../../data/data'

const States = ({setSearchValues}) => {

  const [state,setState] = useState({state:null,lga:null})

  const onChange = (e)=>{

  let name = e.target.name
  let value = e.target.value

  setSearchValues(prev=>{

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
  }

  },[state])

  useEffect(()=>{

  return ()=>{

    setState({state:null,lga:null})
  }
  },[])
  
  return (
  <div className='w-full'>
  <div className='flex items-center space-x-3 w-full border'>
    <div className='flex-1'>
    <input list="states" name="state" onChange={onChange} className='form-select w-full' placeholder='Choose States'/>

    <datalist id="states" className='form-select w-full'>
    {states_n_lga.map((v,i)=>{

      return <option key={i} value={v.name}/>
    })}
    </datalist>
    </div>

    <div className='flex-1'>
    <input list="lga" name="lga" onChange={onChange} className='form-select w-full' placeholder='Choose LGA'/>

    <datalist id="lga" className='form-select w-full'>
    {lgas ? lgas.map((v,i)=>{

      return <option key={i} value={v}/>
    }) : null}
    </datalist>
    </div>
  </div>
   
   
  </div>
  )
}

export default States