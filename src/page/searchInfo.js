import React, { Component } from 'react'
import '../css/search-info.scss'
import Ajax from '../api/ajax'
import {setShowPlayer,currentMusic} from '../store/action'
import { connect } from 'react-redux'
class SearchInfo extends Component{
    constructor(props){
        super(props)
        this.state={
            searchMuiscList:[]
        }
    }
    componentDidMount(){
        let keywords = this.props.location.state
        Ajax.$Get(
            `/search?keywords=${keywords}&type=1&limit=50&offset=0`
        ).then(res=>{
            this.setState({
                searchMuiscList:[...res.result.songs]
            })
        })
    }
    UNSAFE_componentWillReceiveProps(newprops){ // props更新时调用 初始化不调用
        let keywords = newprops.location.state
        Ajax.$Get(
            `/search?keywords=${keywords}&type=1&limit=50&offset=0`
        ).then(res=>{
            this.setState({
                searchMuiscList:[...res.result.songs]
            })
        })
    }
    render(){
        return(
            <section className="search-info-box">
                <ul className="search-info-titile">
                    <li className="active">单曲</li>
                    <li>歌单</li>
                </ul>
                <ul className="search-info-musilist">
                    {
                        this.state.searchMuiscList.map((item,index)=>{
                            return(
                                <li onClick={()=>{this.goToPlay(item)}} key={item.id}>
                                    <span>{item.name}</span>
                                    <span>{`${item.artists[0].name}-${item.album.name}`}</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
        )
    }
    goToPlay(currentMusic){
        this.props.showPlayer()
        this.props.currentMusic(currentMusic)
    }
}
//映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
    showPlayer: state.isShowPlayer,
    currentMusic: state.currentMusic
  })
  
  //映射dispatch到props上
  const mapDispatchToProps = dispatch => ({
    showPlayer: () => {
      dispatch(setShowPlayer(true))
    },
    currentMusic:status=>{
        dispatch(currentMusic(status))
    }
  })
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchInfo)