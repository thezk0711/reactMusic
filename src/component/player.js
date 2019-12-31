import React, { Component,Fragment } from 'react'
import '../css/player.scss'
import 'animate.css'
import { connect } from 'react-redux'
import {setMusicList,setShowPlayer,currentMusic,setHistoryMusicList} from '../store/action'
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
            showLyric: false, // 是否显示歌词
            LyricTop: 0,
            showMusicList: false, // 是否显示歌单列表
            musicListAni: true
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
        this.musicShowList = this.musicShowList.bind(this)
        this.musicHideAni = this.musicHideAni.bind(this)
        this.deleteAll = this.deleteAll.bind(this)
        this.playNow = this.playNow.bind(this)
        this.isPlayEnd = this.isPlayEnd.bind(this)
        this.playerPrev = this.playerPrev.bind(this)
    }
    componentDidMount(){
        this.refs.audio.addEventListener('canplay',this.isPlayer)
        this.refs.audio.addEventListener('loadedmetadata',this.changeAudio) // 解决ios无法自动播放问题
        this.refs.audio.addEventListener('timeupdate',this.timeupdate) // 播放时间改变触发
        this.refs.audio.addEventListener('ended',this.isPlayEnd)
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
        this.setState({
            currentIndex: 0,
            progressLine: 0,
            LyricTop:0
        })
        const id = newProps.currentMusic.id
        this.getSongDetail(id)  // 获取歌曲详情
        this.getSongLyric(id) // 获取歌词
    }
    componentWillUnmount () {
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return
        }
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
                        <i className="player-list-icon" onClick={this.musicShowList}></i>
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
                            <p>
                                {`${this.props.currentMusic.artists.map(item => {
                                    return item.name
                                })}`}
                            </p>
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
                                transform:`translate3d(0,-${this.state.LyricTop}px,0) translateZ(0)`,
                                WebkitTransform:`translate3d(0,-${this.state.LyricTop}px,0) translateZ(0)`
                            }}
                            ref="player_lyric"
                        >
                            {this.state.songLyric.map((item,index)=>{
                                return(
                                    <p 
                                        key={index}
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
                        <i onClick={this.playerPrev}>&#xea73;</i>
                        <i className={this.state.isPlay ? 'player-pause-icon' : 'player-icon'} onClick={this.musicPlayer}></i>
                        <i onClick={this.isPlayEnd}>&#xea73;</i>
                        <i onClick={this.musicShowList}>&#xe6c1;</i>
                    </section>
                </section>) : ''}
                <audio ref="audio" src={`https://music.163.com/song/media/outer/url?id=${this.props.currentMusic.id}.mp3`}></audio>
                {this.state.showMusicList && <section onClick={this.musicHideAni} className={this.state.musicListAni ? 'music-list-box animated bounceInUp' : 'music-list-box animated bounceOutDown'}>
                    <section className="music-list-content">
                        <h5>歌曲数量({this.props.musicList.length}) <span onClick={this.deleteAll}>&#xe62b;</span></h5>
                        <ul>
                            {
                                this.props.musicList.map((item,index) => {
                                    return(
                                        <li key={item.id}>
                                            <section onClick={this.playNow.bind(this,index)} className={item.isPlay ? 'text-overflow player' : 'text-overflow'}>
                                                <span>
                                                    {item.name} -
                                                    <em>{` ${item.ar.map(item => {
                                                        return item.name
                                                    })}`}</em>
                                                </span>
                                            </section>
                                            <span className="music-delete" onClick={this.deleteMusic.bind(this,index)}>&#xe605;</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <span className="close-music-list" onClick={this.musicHideAni}>关闭</span>
                    </section>
                </section>}
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
        },()=>{
            let musicList = [...this.props.historyMusicList]
            let hasMusic = false
            musicList.forEach(item=>{
                if (item.id === this.props.currentMusic.id) {
                    hasMusic = true
                }
            })
            if(!hasMusic) {
                musicList.unshift(this.props.currentMusic)
            }
            this.props.setHistoryMusicList(musicList)
            console.log(this.props.historyMusicList)
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
            this.isPlayEnd()
            this.setState({
                isPlay: false
            })
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
            },()=>{
                this.getLyricTop()
            })
        }catch(error){
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
        let timer
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
        try{
            const index = this.state.currentIndex
            const lyricEle = this.refs.player_lyric
            const boxTop = lyricEle.getBoundingClientRect()
            const eleTop = lyricEle.getElementsByTagName('p')[index].getBoundingClientRect()
            this.setState({
                LyricTop: eleTop.top - eleTop.height - boxTop.top
            })
        }catch(error){
        }
        }, 300)
    }
    showLyric () {
        this.setState({
            showLyric: !this.state.showLyric
        })
    }
    musicShowList () {
        this.setState({
            showMusicList: true,
            musicListAni: true
        })
    }
    musicHideAni () {
        this.setState({
            musicListAni: false
        },()=>{
            setTimeout(()=>{
                this.setState({
                    showMusicList: false
                })
            },500)
        })
    }
    deleteMusic (index,e) {
        e.stopPropagation() //阻止事件冒泡
        let musiciList = this.props.musicList
        if (musiciList.length > 1) {
            if (musiciList[index].isPlay) {
                this.playNow(index+1)
            }
            musiciList.splice(index,1)
            this.props.setMusicList(musiciList)
        } else {
            this.deleteAll()
        }
    }
    deleteAll(){
        this.musicHideAni()
        let arr = []
        this.props.setMusicList(arr)
        this.closePlayer()
        setTimeout(()=>{
            this.props.hidePlayer()
        },800)
        this.refs.audio.removeEventListener('timeupdate',this.timeupdate)
    }
    playNow(playIndex,e){
        e && e.stopPropagation() //阻止事件冒泡
        let playlist = this.props.musicList
        playlist.tracks = playlist.map((item)=>{
            item.isPlay = false
            return item
        })
        playlist.tracks[playIndex].isPlay = true
        this.props.setCurrentMusic(playlist.tracks[playIndex])
        let arr=[...playlist.tracks]
        this.props.setMusicList(arr)
    }
    isPlayEnd () { // 播放下一首 列表循环
        if (this.props.musicList.length>1) {
            let playerIndex = 0
            this.props.musicList.forEach((item,index)=>{
                if(this.props.currentMusic.id === item.id) {
                    if(index !== this.props.musicList.length-1) {
                        playerIndex = index+1
                    }
                }
            })
            this.playNow(playerIndex)
        } else {
            this.refs.audio.load()
        }
    }
    playerPrev () { //  播放上一首
        if (this.props.musicList.length>1) {
            let playerIndex = this.props.musicList.length-1
            this.props.musicList.forEach((item,index)=>{
                if(this.props.currentMusic.id === item.id) {
                    if(index !== 0) {
                        playerIndex = index-1
                    }
                }
            })
            this.playNow(playerIndex)
        } else {
            this.refs.audio.load()
        }
    }
}
const mapStateToProps = state => ({
    currentMusic: state.currentMusic,
    isShowPlayer: state.isShowPlayer,
    musicList: state.musicList,
    historyMusicList: state.historyMusicList
  })
 //映射dispatch到props上
const mapDispatchToProps = dispatch => ({
    setMusicList:list=>{
        dispatch(setMusicList(list))
    },
    hidePlayer: () => {
        dispatch(setShowPlayer(false))
    },
    setCurrentMusic:status=>{
        dispatch(currentMusic(status))
    },
    setHistoryMusicList:list =>{
        dispatch(setHistoryMusicList(list))
    }
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Player);
