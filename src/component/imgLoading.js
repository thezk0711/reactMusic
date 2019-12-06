import React, { Component } from 'react';
import PropTypes from 'prop-types'
class ImgLoad extends Component{
    constructor(props){
        super(props)
        this.state = {
            imgSrc: this.props.imgSrc,  // 图片地址
            isLoad: false // 图片是否加载完毕
        }
    }
    componentDidMount(){
        let img = new Image()
        img.src = this.state.imgSrc
        img.onload=()=>{
            this.setState({
                isLoad: true
            })
        }
    }
    componentWillUnmount () {
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return
        }
    }
    render(){
        return(
            <img
                src={this.state.isLoad ? this.state.imgSrc : require('../images/loading.gif')}
                alt=""
            />
        )
    }
}
ImgLoad.propTypes = {
    imgSrc: PropTypes.string.isRequired
}
export default ImgLoad