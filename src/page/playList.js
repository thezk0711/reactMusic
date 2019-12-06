import React, { Component } from 'react'
import { connect } from 'react-redux'
import {setHeaderOptions} from '../store/action'
import Ajax from '../api/ajax'
import '../css/play-list.scss'
import {formatPlayerCount} from '../common/utils'
class PlayList extends Component{
    constructor(props){
        super(props)
        this.state = {
            playlist: {} // 歌单详情
        }
    }
    componentWillMount(){
        this.props.setHeaderOptions({
            isShowHeader: true,
            headerTitle: '歌单', 
            status: 0
        })
    }
    componentDidMount(){
        const id = this.props.match.params.playId
        Ajax.$Get(`/playlist/detail?id=${id}`).then(res => {
            this.props.setHeaderOptions({
                isShowHeader: true,
                headerTitle: '歌单', 
                status: 1
            })
            this.setState({
                playlist: res.playlist
            })
            console.log(res.playlist)
        })
    }
    componentWillUnmount () {
        // 返回离开当前页隐藏子页面标题导航
        this.props.setHeaderOptions({
            isShowHeader: false
        })
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return
        }
    }
    render(){
        return(
           this.state.playlist.hasOwnProperty('playCount') &&  <div className="play-list-box">
                <div className="play-list-bg"
                    style={{
                        backgroundImage:`url(//music.163.com/api/img/blur/${this.state.playlist.coverImgId_str}?param=150y150)`
                    }}>
                </div>
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
                                    <li key={item.id}>
                                        <section className="play-list-main-l">
                                            {index+1}
                                        </section>
                                        <section className="play-list-main-r">
                                            <h6>
                                                {item.name}
                                            </h6>
                                            <span>
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
        )
    }
}
const mapStateToProps = state => ({
    headerOptions: state.headerOptions
  })
//映射dispatch到props上
const mapDispatchToProps = dispatch => ({
    setHeaderOptions: (options) => {
        dispatch(setHeaderOptions(options))
    }
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(PlayList)