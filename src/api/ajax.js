import Axios from '../common/axios'
const $Post = (url,params)=>{
    return new Promise((reslove,reject)=>{
        Axios.post(
            url,
            params
        ).then((res)=>{
            if(res.status === 200){
                reslove(res.data)
            } else {
                reject(res)
            }
        }).catch((error)=>{
            reject(error)
        })
    })
}
const $Get = (url)=>{
    return new Promise((reslove,reject)=>{
        Axios.get(
            url
        ).then((res)=>{
            if(res.status === 200){
                reslove(res.data)
            } else {
                reject(res)
            }
        }).catch((error)=>{
            reject(error)
        })
    })
}
export default{
    $Post,$Get
}