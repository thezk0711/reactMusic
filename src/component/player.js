import React, { Component,Fragment } from 'react'
import '../css/player.scss'
import 'animate.css'
import { connect } from 'react-redux'
import {formatTime} from '../common/utils'
import ajax from '../api/ajax'
class Player extends Component {
    constructor(props){
        super(props)
        this.state={
            isPlay: false, // 是否播放
            picUrl: '', // 歌曲封面图
            picStr: '', // 歌曲封面图编号
            showSmallPlayer: false, // 小播放器开关
            showPlayer: true, // 全屏播放器开关
            progressLine: 0, // 播放进度
            clientLeft: 0, // 进度条距离左侧窗口距离
            progressWidth: 0, // 进度条总长度
            duration: 0, // 歌曲总时长(秒)
            currentTime: 0, // 歌曲已播放时长(秒)
            songLyric:[], // 歌词
            currentIndex: 0,
            progress: null,
            showLyric: false // 是否显示歌词
        }
        this.musicPlayer = this.musicPlayer.bind(this)
        this.isPlayer = this.isPlayer.bind(this)
        this.changeAudio = this.changeAudio.bind(this)
        this.closePlayer = this.closePlayer.bind(this)
        this.progressMove = this.progressMove.bind(this)
        this.progressEnd = this.progressEnd.bind(this)
        this.timeupdate = this.timeupdate.bind(this)
        this.showMainPlayer = this.showMainPlayer.bind(this)
        this.getSongLyric = this.getSongLyric.bind(this)
        this.getLyricTop = this.getLyricTop.bind(this)
        this.showLyric =  this.showLyric.bind(this)
    }
    componentDidMount(){
        this.refs.audio.addEventListener('canplay',this.isPlayer)
        this.refs.audio.addEventListener('loadedmetadata',this.changeAudio) // 解决ios无法自动播放问题
        this.refs.audio.addEventListener('timeupdate',this.timeupdate) // 播放时间改变触发
        const id = this.props.currentMusic.id
        this.getSongDetail(id)  // 获取歌曲详情
        this.getSongLyric(id) // 获取歌词
        const progressLeft = this.refs.progress.getBoundingClientRect()
        const progressWidth = this.refs.progress_line.getBoundingClientRect()
        this.setState({
            clientLeft: progressLeft.left,
            progressWidth: progressWidth.width
        })
        this.refs.progress.addEventListener('touchmove',this.progressMove)
        this.refs.progress.addEventListener('touchend',this.progressEnd)
    }
    UNSAFE_componentWillReceiveProps(newProps){
        const id = newProps.currentMusic.id
        this.getSongDetail(id)  // 获取歌曲详情
        this.getSongLyric(id) // 获取歌词
    }
    render() { 
        return ( 
            <Fragment>
                <section style={this.state.showSmallPlayer ? {display: 'flex'}: {display: 'none'}} className="small-player-content">
                    <section className="small-player-img" onClick={this.showMainPlayer}>
                        <img 
                            src={`${this.state.picUrl}?param=100y100`}
                            alt=""
                        />
                    </section>
                    <section className="small-player-name" onClick={this.showMainPlayer}>
                        <h2 className="text-overflow">{this.props.currentMusic.name}</h2>
                        <span className="text-overflow">{this.props.currentMusic.artists[0].name}</span>
                    </section>
                    <section className="small-player-icon">
                        <i ref="player" className={this.state.isPlay ? 'player-pause-icon' : 'player-icon'} onClick={this.musicPlayer}></i>
                        <i className="player-list-icon"></i>
                    </section>
                </section>
                {this.state.showPlayer ? (<section 
                    className={this.state.showSmallPlayer ? 'player-main animated bounceOutDown' : `player-main animated bounceInUp`}
                    style={{
                        background:`rgba(0,0,0,0.8) url(//music.163.com/api/img/blur/${this.state.picStr}) no-repeat`
                    }}>
                    <section className="player-header">
                        <i onClick={this.closePlayer}>&#xe649;</i>
                        <section className="player-musicname">
                            <h2>{this.props.currentMusic.name}</h2>
                            <p>{this.props.currentMusic.artists[0].name}</p>
                        </section>
                    </section>
                    <section style={this.state.showLyric ? {opacity: '0',visibility: 'hidden'}: {opacity: '1',visibility: 'inherit'}} className={this.state.isPlay ? 'player-music-content play-animate' : 'player-music-content play-animate-pause'}>
                        <section className="player-music-dis" onClick={this.showLyric}>
                        <img 
                            src={`${this.state.picUrl}?param=200y200`}
                            alt=""
                        />
                        </section>
                    </section>
                    <section onClick={this.showLyric} className="player-lyric-box" style={this.state.showLyric ? {opacity: '1',display: 'block'}: {opacity: '0'}}>
                        <section 
                            className="player-lyric-content"
                            style={{
                                transform:`translateY(-${this.getLyricTop()}px)`
                            }}
                            ref="player_lyric"
                        >
                            {this.state.songLyric.map(item=>{
                                return(
                                    <p 
                                        key={item.time}
                                        style={item.highlight ? {color: '#fff'} : {}}
                                    >
                                        {item.lyric}
                                    </p>
                                )
                            })}
                        </section>
                    </section>
                    <section className="player-progress">
                        <span>{formatTime(this.state.currentTime)}</span>
                        <section className="player-progress-line" ref="progress_line">
                            <span id="progress" ref="progress" className="player-progress-btn" style={{left: this.state.progressLine}}></span>
                            <span style={{width: this.state.progressLine}} className="player-progress-line-content"></span>
                        </section>
                        <span>{formatTime(this.state.duration)}</span>
                    </section>
                    <section className="player-music-controll">
                        <i>&#xea73;</i>
                        <i className={this.state.isPlay ? 'player-pause-icon' : 'player-icon'} onClick={this.musicPlayer}></i>
                        <i>&#xea73;</i>
                        <i>&#xe6c1;</i>
                    </section>
                </section>) : ''}
                <audio ref="audio" src={`https://music.163.com/song/media/outer/url?id=${this.props.currentMusic.id}.mp3`}></audio>
            </Fragment>
        )
    }
    musicPlayer(){
        if(this.state.isPlay){
            this.refs.audio.pause()
            this.setState({
                isPlay: false
            })
        } else {
            this.refs.audio.play()
            this.setState({
                isPlay: true
            })
        }
    }
    changeAudio(){
        this.refs.audio.play()
        this.setState({
            isPlay: true
        })
    }
    isPlayer(){
        this.setState({
            isPlay: true,
            duration: this.refs.audio.duration
        })
    }
    getSongDetail(id){
        ajax.$Get(`/check/music?id=${id}`).then(res=>{
            if(!res.success){
                alert(res.message)
                return false
            }
        }).catch((error)=>{
            alert('暂无版权,请购买支持正版^_^')
            console.log(error)
            return false
        })
        ajax.$Get(`/song/detail?ids=${id}`).then(res=>{
           let picStr = res.songs[0].al.picUrl.split('/')
           this.setState({
               picUrl: res.songs[0].al.picUrl,
               picStr: picStr[picStr.length-1].split('.')[0]
           })
        })
    }
    getSongLyric(id){
        ajax.$Get(`lyric?id=${id}`).then(res => {
            let lyricArr = []
            if (!res.nolyric) {
                const lyric = res.lrc.lyric.split('\n')
                lyric.map((item)=>{
                    let t = item.split(']')[0].replace('[','')
                    lyricArr.push({
                        time: (t.split(':')[0] * 60 + parseFloat(t.split(':')[1])).toFixed(3),
                        lyric: item.split(']')[1],
                        highlight: false
                    })
                    return lyricArr
                })
                lyricArr.splice(lyricArr.length-1,1)
            } else {
                lyricArr.push({
                    time: 0.00,
                    lyric: '弄啥捏o(╯□╰)o暂无歌词',
                    highlight: true
                })
            }
            this.setState({
                songLyric: lyricArr
            })
        })
    }
    closePlayer(){
        this.setState({
            showSmallPlayer: true
        },()=>{
            setTimeout(()=>{
                this.setState({
                    showPlayer: false
                })
            },1000)
        })
    }
    progressMove(ev){ // 进度条拖拽
        this.refs.audio.pause()
        this.setState({
            isPlay: false
        })
        let touches = ev.touches[0]
        let clientx = touches.clientX - this.state.clientLeft
        if(clientx <= 0) {
            this.setState({
                progressLine: 0
            })
        } else if(clientx >= this.state.progressWidth){
            this.setState({
                progressLine: this.state.progressWidth
            })
        }else {
            this.setState({
                progressLine: clientx
            })
        }
        this.setState({
            currentTime: this.refs.audio.duration * (this.state.progressLine / this.state.progressWidth)
        })
    }
    progressEnd(){
        this.refs.audio.currentTime = this.refs.audio.duration * (this.state.progressLine / this.state.progressWidth)
        this.refs.audio.play()
        this.setState({
            isPlay: true
        })
    }
    timeupdate(){ // 播放时间改变触发
        let currentTime =  this.refs.audio.currentTime
        this.state.songLyric.forEach((item,index)=>{
            let items = this.state.songLyric
            items[index].highlight = false
            this.setState({
                songLyric: items
            })
            if(index!==this.state.songLyric.length-1 && item.lyric){
                if(currentTime > item.time && currentTime < this.state.songLyric[index+1].time){
                    if(index){
                        this.setState({
                            currentIndex: index
                        })
                    }
                }
            } else if(index===this.state.songLyric.length-1 && item.lyric){
                if(currentTime >= item.time){
                    this.setState({
                        currentIndex: this.state.songLyric.length - 1
                    })
                }
            }
        })
        try{
            let items = this.state.songLyric
            items[this.state.currentIndex].highlight = true
            this.setState({
                currentTime: this.refs.audio.currentTime,
                progressLine: this.state.progressWidth * (this.refs.audio.currentTime / this.refs.audio.duration),
                songLyric:items
            })
        }catch(error){
            console.debug(error)
        }
    }
    showMainPlayer(){
        this.setState({
            showSmallPlayer: false,
            showPlayer: true
        },()=>{
            this.refs.progress.addEventListener('touchmove',this.progressMove)
            this.refs.progress.addEventListener('touchend',this.progressEnd)
        })
    }
    getLyricTop(){
        try{
            const index = this.state.currentIndex
            const lyricEle = this.refs.player_lyric
            const boxTop = lyricEle.getBoundingClientRect()
            const eleTop = lyricEle.getElementsByTagName('p')[index].getBoundingClientRect()
            return eleTop.top - eleTop.height - boxTop.top
        }catch(error){
            console.log(error)
        }
    }
    showLyric () {
        this.setState({
            showLyric: !this.state.showLyric
        })
    }
}
const mapStateToProps = state => ({
    currentMusic: state.currentMusic,
    isShowPlayer: state.isShowPlayer
  })
 
export default connect(
    mapStateToProps
  )(Player);
