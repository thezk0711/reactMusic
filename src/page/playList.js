import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import {setHeaderOptions,setShowPlayer,currentMusic,setMusicList} from '../store/action'
import Ajax from '../api/ajax'
import '../css/play-list.scss'
import {formatPlayerCount} from '../common/utils'
class PlayList extends Component{
    constructor(props){
        super(props)
        this.state = {
            playlist: {} // 歌单详情
        }
        this.playNow = this.playNow.bind(this)
    }
    componentWillMount(){
        let headerTitle = this.props.location.state
        this.props.setHeaderOptions({
            isShowHeader: true,
            headerTitle: headerTitle, 
            status: 0
        })
    }
    componentDidMount(){
        let headerTitle = this.props.location.state
        const id = this.props.match.params.playId
        Ajax.$Get(`/playlist/detail?id=${id}`).then(res => {
            this.props.setHeaderOptions({
                isShowHeader: true,
                headerTitle: headerTitle, 
                status: 1
            })
            const playList = res.playlist.tracks.map(item=>{
                item.isPlay = false
                item.artists = item.ar
                return item
            })
            res.playlist.tracks = playList
            this.setState({
                playlist: res.playlist
            },()=>{
                this.refs.playList.addEventListener('scroll',(e)=>{
                    if(this.refs.playList.scrollTop >= 80) {
                        this.props.setHeaderOptions({
                            isShowHeader: true,
                            headerTitle: res.playlist.name, 
                            status: 1
                        })
                    } else {
                        this.props.setHeaderOptions({
                            isShowHeader: true,
                            headerTitle: headerTitle, 
                            status: 1
                        })
                    }
                })
            })
        })
    }
    componentWillUnmount () {
        // 返回离开当前页隐藏子页面标题导航
        this.props.setHeaderOptions({
            isShowHeader: false
        })
    }
    render(){
        return(
           this.state.playlist.hasOwnProperty('playCount') ? <Fragment><div className="play-list-bg"
                    style={{
                        backgroundImage:`url(${this.state.playlist.coverImgUrl}?param=150y150)`
                    }}>
                </div>
                <div className="play-list-box" ref="playList">
                <section className="play-list-content">
                    <div className="play-list-img" data-play-count={formatPlayerCount(this.state.playlist.playCount)}>
                        <img src={`${this.state.playlist.coverImgUrl}?param=150y150`}  alt="" />
                    </div>
                    <div className="play-list-content-title">
                        <h5>{this.state.playlist.name}</h5>
                        <p>
                            <img src={this.state.playlist.creator.avatarUrl} alt="" />
                            {this.state.playlist.creator.nickname}
                        </p>
                    </div>
                </section>
                <div className="play-list-main">
                    <ul>
                        {
                            this.state.playlist.tracks.map((item,index) => {
                                return(
                                    <li key={item.id} onClick={this.playNow.bind(this,index)}>
                                        <section className="play-list-main-l">
                                            {index+1}
                                        </section>
                                        <section className="play-list-main-r">
                                            <h6 className={item.isPlay ? 'text-overflow player' : 'text-overflow'}>
                                                {item.name}
                                            </h6>
                                            <span className="text-overflow">
                                                {`${item.ar.map(item => {
                                                    return item.name
                                                })} - ${item.name}`}
                                            </span>
                                        </section>
                                    </li>
                                )
                            })
                        }
                    </ul> 
                </div>
            </div>
            </Fragment> : <Fragment><div className="play-list-box">
                <div className="music-page-loading">
                    拼命加载中...
                </div>
            </div>
            </Fragment>
        )
    }
    playNow(playIndex){
        let playlist = this.state.playlist
        playlist.tracks = [...playlist.tracks.map((item)=>{
            item.isPlay = false
            return item
        })]
        playlist.tracks[playIndex].isPlay = true
        this.setState({
            playlist: playlist
        })
        this.props.showPlayer()
        this.props.currentMusic(playlist.tracks[playIndex])
        let arr=[...playlist.tracks]
        this.props.setMusicList(arr)
    }
}
const mapStateToProps = state => ({
    headerOptions: state.headerOptions
  })
//映射dispatch到props上
const mapDispatchToProps = dispatch => ({
    setHeaderOptions: (options) => {
        dispatch(setHeaderOptions(options))
    },
    showPlayer: () => {
        dispatch(setShowPlayer(true))
    },
    currentMusic:status=>{
        dispatch(currentMusic(status))
    },
    setMusicList:list=>{
        dispatch(setMusicList(list))
    }
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(PlayList)