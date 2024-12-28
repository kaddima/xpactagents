import axios from "axios"

const Axios = axios.create()

// Axios.interceptors.response.use(res=>res,err=>{
//     if(err.response && 419 == err.response.status){
//         window.location.reload()
//     }
// })


export default Axios