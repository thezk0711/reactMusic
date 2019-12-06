import React, { Component } from 'react'
import Ajax from '../api/ajax'
import '../css/hot-search.scss'
import { Link } from 'react-router-dom'
class HotSearch extends Component{
    constructor(props){
        super(props)
        this.state={
            hotSearchList:[]
        }
    }
    componentDidMount(){
        Ajax.$Get('/search/hot').then((res)=>{
            this.setState({
                hotSearchList:[...res.result.hots] 
            })
        })
    }
    render(){
        return(
            <section className="hot-search-list">
                <h2>热门搜索</h2>
                <ul>
                    {
                        this.state.hotSearchList.map((item,index)=>{
                            return(
                                <li 
                                     key={index}
                                >
                                    <Link to={{ pathname: '/searchinfo/', state:item.first}}>
                                        {item.first}
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
        )
    }
}
export default HotSearch