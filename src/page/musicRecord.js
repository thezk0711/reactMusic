import React, { Component } from 'react'
import {setShowPlayer,currentMusic,setHeaderOptions} from '../store/action'
import '../css/search-info.scss'
import { connect } from 'react-redux'
class musicRecord extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    componentWillUnmount(){
        // 返回离开当前页隐藏子页面标题导航
        this.props.setHeaderOptions({
            isShowHeader: false
        })
    }
    componentWillMount(){
        this.props.setHeaderOptions({
            isShowHeader: true,
            headerTitle: '听歌记录', 
            status: 0
        })
    }
    render(){
       return(
        <section className="search-info-box">
            {this.props.historyMusicList.length===0 ? <div style={{fontSize: '.3rem',color: '#666',textAlign: 'center',lineHeight: '1rem'}}>还没有听歌记录哦~o(╯□╰)o</div> : ''}
            <ul className="search-info-musilist">
                {
                    this.props.historyMusicList.map((item,index)=>{
                        return(
                            <li onClick={()=>{this.goToPlay(item)}} key={item.id}>
                                <span>{item.name}</span>
                                <span>{`${item.artists.map(item => {
                                    return item.name
                                })}-${item.name}`}</span>
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
    currentMusic: state.currentMusic,
    historyMusicList: state.historyMusicList
  })
  
  //映射dispatch到props上
  const mapDispatchToProps = dispatch => ({
    showPlayer: () => {
      dispatch(setShowPlayer(true))
    },
    currentMusic:status=>{
        dispatch(currentMusic(status))
    },
    setHeaderOptions: (options) => {
        dispatch(setHeaderOptions(options))
    }
  })
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(musicRecord)