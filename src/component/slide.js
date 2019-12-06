import React, { Component } from 'react'
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
import Api from '../api/banner'
class Slide extends Component{
    constructor(props){
        super(props)
        this.state={
            bannerList:[]
        }
    }
    // 组件挂载到DOM后调用，且只会被调用一次
    componentDidMount() {
        Api.getBnner('/banner').then((res)=>{
            this.setState({
                bannerList:[...res.banners]
            },()=>{
                new Swiper ('.swiper-container', {
                    loop: true,  //循环
                    autoplay: {   //滑动后继续播放（不写官方默认暂停）
                        disableOnInteraction: false,
                    },
                    pagination: {  //分页器
                        el: '.swiper-pagination'
                    }
                })
            })
        }).catch((error)=>{
            console.error(error)
        })
    }
    render(){
        return(
            <div className="swiper-container" style={{height:'2.7rem'}}>
                <div className="swiper-wrapper">
                    {this.state.bannerList.map((item,index)=>{
                        return(
                            <div className="swiper-slide" key={item.targetId+index}>
                                <img src={item.pic} alt="" />
                            </div>
                        )
                    })}
                </div>
                <div className="swiper-pagination"></div>
            </div>
        )
    }
    componentWillUnmount() {
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return
        }
    }
}
export default Slide