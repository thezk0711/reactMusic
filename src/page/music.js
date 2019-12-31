import React, { Component } from 'react'
import Slide from '../component/slide'
import Recommended from '../component/recommended'
import { Link } from 'react-router-dom'
import '../css/music.scss'
class Music extends Component{
    render(){
        return(
            <section className="music-content">
                <Slide/>
                <section className="music-icon">
                    <ul>
                        <li style={{opacity:'.5'}} onClick={()=>{alert('寻找灵感中o(╯□╰)o,暂未开放')}}>
                            <Link to="/">
                                <i>&#xe62c;</i>
                                <span>每日推荐</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/toplist">
                                <i>&#xe624;</i>
                                <span>排行榜</span>
                            </Link>
                        </li>
                        {/* <li>
                            <Link to="/">
                                <i>&#xe6c1;</i>
                                <span>歌单</span>
                            </Link>
                        </li> */}
                        <li>
                            <Link to="/musicRecord">
                                <i>&#xe621;</i>
                                <span>听歌记录</span>
                            </Link>
                        </li>
                    </ul>
                </section>
                <Recommended/>
            </section>
        )
    }
}
export default Music