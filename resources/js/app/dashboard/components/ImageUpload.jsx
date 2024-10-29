import React,{useState,useEffect} from 'react'
import {FaUpload} from 'react-icons/fa'
import {toast} from 'react-toastify'
import { useSelector } from 'react-redux';
import $ from 'jquery'
import Axios from '../../utility/axios';

const ImageUpload = ({uploadType ="property",property_id=null,getPhoto=false,fn}) => {

  const [image,setImage] = useState(null);

  const uploadImage = (e)=>{

    //display spinner
    $('#spinner').fadeIn()
    e.preventDefault()

    let img = document.getElementById('image');
    let url

    let formdata = new FormData()
    formdata.append('image',img.files[0])
    formdata.append('upload_type',uploadType)
    
    if(uploadType == 'property'){
      url='/dashboard/upload-property-photo'
      formdata.append('property_id',property_id)
      formdata.append('get_photo', getPhoto?1:0)
    }else{
      url="/users/upload-photo"
    }
  
    Axios({
			method:'post',
			url,
      data:formdata,
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
    }).finally(()=>{
      $('#spinner').fadeOut()

    })
  }
  

  return (

  <div className='w-full'>
    <div className='w-full md:min-h-[150px] max-h-[220px] rounded-lg bg-gray-200 overflow-hidden relative'>
      <img src={image} alt="" className='w-full md:min-h-[150px] max-h-[220px] object-cover' />

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