import Axios from 'axios'
Axios.defaults.baseURL = 'http://localhost:3000'; // Api请求地址
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';  //请求头
Axios.defaults.timeout = 5000 // 请求超时时间
export default Axios
