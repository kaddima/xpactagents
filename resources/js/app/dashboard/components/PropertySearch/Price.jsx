import React, { useMemo, useState } from 'react'
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const BarLine = ()=>{

    let arr = useMemo(()=>{

        let arrNum = []

        for(let i=0; i <=50; i++){

            var rand = Math.floor(Math.random() * (80 - 1 +1) + 1) + 'px'

            arrNum.push(rand)
        }

        return arrNum
    },[])

    return (
         
        <div className='h-[5rem] flex justify-center items-end w-full mb-[3px] border-red-600'>
            {arr.map((v,i)=>{

                return <div key={i} style={{height:v}} className={'bg-[#65c0cf] w-[5px] mx-[1px]'}>

                </div>
            })}
        </div>
        
    )
}


const Price = ({setSearchValues}) => {

    const [rangeValue,setRangeValue] = useState([])

    const onChange = (val,val2)=>{

        let value = [...rangeValue];

        if(val){
            value[0] = val

            setSearchValues(prev=>{

                return {...prev, price:{...prev.price, min_price:val}}
            })
        }

        if(val2){
            value[1] = val2
            setSearchValues(prev=>{

                return {...prev, price:{...prev.price, max_price:val2}}
            })
        }

        
        setRangeValue(value)
    }

  return (
    <div className='  w-full'>
        
        <BarLine/>
        <div>
            <RangeSlider
            max={100000000}
            min={100000}
            className={'bg-[#65c0cf] '}
            defaultValue={[100000,100000000]}
            onInput={value => {
                setRangeValue(value)
                setSearchValues(prev=>{

                    return {...prev, price:{min_price:rangeValue[0],max_price:rangeValue[1]}}
                })
            }}
                />
        </div>

        <div className='flex items-center space-x-4 mt-7'>
            <input type="text" onChange={(e)=>{let v = e.target.value;onChange(v)}} className='form-input rounded dark:bg-transparent dark:border-slate-800 border-slate-300 font-[400] w-full' value={rangeValue[0] ? Number(rangeValue[0]) : ''} placeholder='Enter min'/>
            <input type="text" onChange={(e)=>{let v = e.target.value;onChange(null,v)}}  className='form-input rounded dark:bg-transparent dark:border-slate-800 border-slate-300 font-[400] w-full' value={rangeValue[1] ? Number(rangeValue[1]) : ''} placeholder='Enter max'/>
        </div>
        
    </div>
  )
}

export default Price