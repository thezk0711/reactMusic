import Axios from '../common/axios'
// 获取banner广告图
const getBnner = url =>{
    return new Promise((reslove,reject)=>{
        Axios.post(
            url,
        {
            type:2
        }).then((res)=>{
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
export default {getBnner}