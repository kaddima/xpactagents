import Axios from "./axios"


const checkMessage = async (type)=>{

    try {

        const res = await Axios.get('/user/message/notifier',{params:{type:type}})
        return res.data

    } catch (err) {
        console.log(err)        
    }
    
}

export default checkMessage