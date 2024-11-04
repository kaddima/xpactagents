import React, { useEffect, useRef, useState } from 'react'

const Passcode = ({getValue}) => {
    const inputRefs = useRef([])
    const [arrayValue,setArrayValue] = useState(['','','','','',''])
    const [currentFocusedIndex,setCurrentFocusedIndex] = useState(0)
   

    const onKeyDown = (e)=>{

        const keyCode = e.key
        if(!(keyCode >=0 && keyCode <=9) && 
        keyCode !== "Backspace" && !(e.metaKey && e.key === "v")){
            e.preventDefault()
        }
    }

    const onKeyUp = (e,index)=>{
        if(e.key === "Backspace"){

            if(index === 0){
                setCurrentFocusedIndex(0)
            }else{
                setCurrentFocusedIndex(index - 1)
                if(inputRefs && inputRefs.current && index===currentFocusedIndex){

                    (inputRefs.current[index - 1]).focus()
                }
            }
        }
        else{
            if(parseInt(e.key) && index < arrayValue.length - 1){

            setCurrentFocusedIndex(index + 1)
            if(inputRefs && inputRefs.current && index === currentFocusedIndex){
                inputRefs.current[index+1].focus();
            }
        }
        }
        
    }

    const onFocus = (e,index)=>{

        setCurrentFocusedIndex(index)
        e.target.focus()
    }

    const onChange = (e,index)=>{

        getValue(prev=>{

            const newArray = [...prev]

            if(parseInt(e.target.value)){

                newArray[index] = parseInt(e.target.value)
            }else{

                newArray[index] = e.target.value
            }
            return newArray;
        })

        setArrayValue(prev=>{

            const newArray = [...prev]

            if(parseInt(e.target.value)){

                newArray[index] = parseInt(e.target.value)
            }else{

                newArray[index] = e.target.value
            }
            return newArray;
        })

        
    }


    useEffect(()=>{
        document.addEventListener("paste", async ()=>{

            const pastePermission = await navigator.permissions.query({
                name: "clipboard-read"
              });
        
              if (pastePermission.state === "denied") {
                throw new Error("Not allowed to read clipboard");
              }

            const clipboardContent = await navigator.clipboard.readText();

            try {
                let newArray = clipboardContent.split("");
                newArray = newArray.map((num) => Number(num));

                const lastIndex = arrayValue.length - 1;

                if (currentFocusedIndex > 0) {
                const remainingPlaces = lastIndex - currentFocusedIndex;
                const partialArray = newArray.slice(0, remainingPlaces + 1);
                getValue([
                    ...arrayValue.slice(0, currentFocusedIndex),
                    ...partialArray
                ])
                setArrayValue([
                    ...arrayValue.slice(0, currentFocusedIndex),
                    ...partialArray
                ]);
                } else {
                getValue([
                    ...newArray,
                    ...arrayValue.slice(newArray.length - 1, lastIndex)
                ]);
                setArrayValue([
                    ...newArray,
                    ...arrayValue.slice(newArray.length - 1, lastIndex)
                ]);
                }

                if (newArray.length < arrayValue.length && currentFocusedIndex === 0) {
                setCurrentFocusedIndex(newArray.length - 1);
                inputRefs.current[newArray.length - 1].focus();
                } else {
                setCurrentFocusedIndex(arrayValue.length - 1);
                inputRefs.current[arrayValue.length - 1].focus();
                }
            } 
            catch (err) {
                console.error(err);
            }

        })

        return () => {
            document.removeEventListener("paste", () =>
              console.log("Removed paste listner")
            );
          };
    },[arrayValue, currentFocusedIndex])

  return (
    <div className='flex items-center gap-2'>
        {arrayValue.map((value,index)=>{

            return <input key={index}
            inputMode='numeric'
            pattern='\d{1}' 
            type="text" 
            maxLength={1}
            className='h-12 w-8 md:h-14 md:w-10 dark:bg-transparent rounded-lg text-center text-lg font-bold'
            ref={(node)=>node && (inputRefs.current[index] = node)}
            value={String(value)}
            onChange={(e)=>onChange(e,index)}
            onKeyUp={(e)=>onKeyUp(e,index)}
            onKeyDown={(e)=>onKeyDown(e)}
            onFocus={(e)=>onFocus(e,index)}/>
        })}
    </div>
  )
}

export default Passcode