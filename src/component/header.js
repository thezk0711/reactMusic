import React, { Component } from 'react'
import Ajax from '../api/ajax'
import { withRouter } from 'react-router-dom'
class Header extends Component{
    constructor(props){
        super(props)
        this.state= {
            searchDefaultVal: '',
            isFocus: false,
            searchVal: ''
        }
    }
    componentDidMount(){
        // 获取默认搜索关键字
        Ajax.$Get(
            '/search/default'
            ).then((res )=> {
                this.setState({
                    searchDefaultVal: res.data.realkeyword
                })
            })
    }
    componentWillUnmount() {
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return
        }
    }
    UNSAFE_componentWillReceiveProps(newprops){ // props更新时调用 初始化不调用
        if(newprops.location.state){
            this.setState({
                searchVal: newprops.location.state
            })
        }
    }
    render() {
        return (
            <header>
                {!this.state.isFocus && <div className="music-logo">
                        <img
                            src={require('../images/logo.png')}
                            alt="网易云logo"
                        />
                </div>}
                <form onSubmit={e=>{this.searchSubmit(e)}} action="" className={this.state.isFocus ? 'input-focus' : ''}>
                    <input 
                        type="search" 
                        placeholder={this.state.searchDefaultVal} 
                        onFocus={this.inputFocus.bind(this)}
                        onChange={this.inputChange.bind(this)}
                        value={this.state.searchVal}
                        onKeyDown={this.inputKeyDown.bind(this)}
                        ref="input"
                    />
                </form>
                {this.state.isFocus && <span onClick={this.cancel.bind(this)}>取消</span>}
                <i className="music-user">&#xe71d;</i>
            </header>
        )
    }
    inputFocus(){ // 搜索框聚焦
        this.setState({
            isFocus: true
        })
        if (this.props.location.pathname !== '/hotSearch' && this.props.location.pathname !== '/searchInfo') {
             this.props.history.push('/hotSearch')
        }
    }
    cancel (){ // 取消搜索
        this.setState({
            isFocus: false,
            searchVal: ''
        })
        this.props.history.push('/music')
    }
    searchSubmit(e){ //提交搜索结果
        e.preventDefault() // 阻止默认刷新事件
    }
    inputChange(e){ //监听 搜索框值改变
        this.setState({
            searchVal: e.target.value
        })
    }
    inputKeyDown(e){
        if (e.keyCode === 13) {
            this.props.history.push({
                pathname: '/searchInfo',
                state: this.state.searchVal ? this.state.searchVal : this.state.searchDefaultVal
            })
            if(!this.state.searchVal) {
                this.setState({
                    searchVal: this.state.searchDefaultVal
                })
            }
            this.refs.input.blur()
        }
    }
}
export default withRouter(Header)