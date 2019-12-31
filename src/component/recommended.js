import React, { Component , Fragment} from 'react'
import '../css/recommended.scss'
import Ajax from '../api/ajax'
import ImgLoad from './imgLoading'
import {formatPlayerCount} from '../common/utils'
import { Link } from 'react-router-dom'
class Recommended extends Component{
    constructor(props){
        super(props)
        this.state={
            recoList:[]
        }
    }
    componentDidMount(){
        Ajax.$Get(
            '/personalized?limit=9'
        ).then(res=>{
            this.setState({
                recoList:[...res.result]
            })
        }).catch(error=>{
            console.error(error)
        })
    }
    render(){
        return(
            <Fragment>
                <h2 className="rec-title">推荐歌单</h2>
                <ul className="rec-list">
                    {
                        this.state.recoList.map((item,index) => {
                            return(
                                <li key={item.id}>
                                    <Link to={{ pathname: `/playlist/${item.id}`, state:'歌单'}} data-play-count={formatPlayerCount(item.playCount)} state={{needLogin: true}}>
                                        <ImgLoad imgSrc={item.picUrl}/>
                                        <h5>{item.name}</h5>
                                    </Link>  
                                </li>
                            )
                        })
                    }
                </ul>
            </Fragment>
        )
    }
}
export default Recommended