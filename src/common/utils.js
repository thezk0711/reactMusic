// 听歌数量格式化
export const formatPlayerCount = conunt => {
    let param = ''
    let k = 10000,
        sizes = ['', '万', '亿', '万亿'],
        i = 0;
        if(conunt < k){
            param = conunt
        }else{
            i = Math.floor(Math.log(conunt) / Math.log(k));
            i <= 1 ? param = Math.floor(conunt / k) : param = Math.floor(conunt / (k*10000))
        }
        return `${param}${sizes[i]}`
}
// 时间格式化
export const formatTime =  time => {
    return `${toZero(parseInt(time/60))}:${toZero(parseInt(time%60))}`
}
// 补零函数
const toZero = num =>{
    return num < 10 ? `0${num}` : num
}