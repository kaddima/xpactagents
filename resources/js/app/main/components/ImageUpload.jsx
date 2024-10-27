import React,{useState} from 'react'
import {FaUpload} from 'react-icons/fa'
import {toast} from 'react-toastify'
import Axios from '../../utility/axios';

const ImageUpload = ({property_id,getPhoto=false,fn}) => {

    const [image,setImage] = useState(null);

    const uploadImage = (e)=>{

        //display spinner
        $('#spinner').fadeIn()
        e.preventDefault()

        let img = document.getElementById('image');

        let file = img.files[0]


        Axios({
			method:'post',
			url:'/admin/upload-property-photo',
			data:{photo:file,property_id:property_id,get_photo:getPhoto?1:0},
			headers:{'Content-Type':'multipart/form-data'}
        }).then(data=>{
            $('#spinner').fadeOut()

            if(data.data.status != 1){
                toast(data.data.error, {type:'error'})
                return false
            }

            toast('Image uploaded', {type:'success'})

            if(getPhoto){

                fn(data.data.photos)
            }
           
        }).catch(e=>{
            console.log(e.response)
        })
    }

  return (

    <div className=''>
        <div className='w-full md:min-h-[150px] rounded-lg bg-gray-200 overflow-hidden relative'>
            <img src={image} alt="" className='' />

            {image !== null && (<div className='w-10 h-10 rounded-full overflow-hidden bg-theme-color absolute bottom-1 right-0'>
                <button className='text-white w-full h-full flex justify-center items-center ' onClick={uploadImage}><FaUpload/></button>
            </div>)}
            
        </div>

        <div className='mt-2 border overflow-hidden w-full'>
            <input id='image' className='w-full overflow-hidden' type="file" onChange={(e)=>{
                
                setImage(URL.createObjectURL(e.target.files[0]))
                    
            }}/>
        </div>
        
    </div>
   
  )
}

export default ImageUpload