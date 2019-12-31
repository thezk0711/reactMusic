import React, { Component } from 'react';
import { connect } from 'react-redux'
import {setHeaderOptions} from '../store/action'
import Ajax from '../api/ajax'
import ImgLoad from '../component/imgLoading'
import '../css/top-list.scss'
import { Link } from 'react-router-dom'
class topList extends Component{
    constructor(props){
        super(props)
        this.state={
            officialList: [], // 官方榜单
            moreList: [] // 更多榜单
        }
    }
    componentDidMount(){
        Ajax.$Get('/toplist/detail').then(res=>{
            const list = res.list
            let officialList = [],
            moreList = []
            officialList = list.filter( item => { // 官方榜单
                return item.ToplistType
            })
            moreList = list.filter( item => { // 更多榜单
                return !item.ToplistType
            })
            this.setState({
                officialList,
                moreList
            })
        })
        this.props.setHeaderOptions({
            isShowHeader: true,
            headerTitle: '排行榜', 
            status: 0
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
    render() {
        return (
            <section className="top-list-box">
                <h3>官方榜</h3>
                {
                    this.state.officialList.map(item => {
                        return (
                            <Link to={{ pathname: `/playlist/${item.id}`, state:'排行榜'}}  key={item.id}>
                                <dl className="official-list">
                                    <dd date-update={item.updateFrequency}>
                                        <ImgLoad imgSrc={item.coverImgUrl}/>
                                    </dd>
                                    <dt>
                                        {item.tracks.map((tracksItem,index)=>{
                                            return(
                                        <p className="text-overflow" key={new Date().getTime()+index}>{`${index+1}.${tracksItem.first}`}-{tracksItem.second}</p>
                                            )  
                                        })}
                                    </dt>
                                </dl>
                            </Link>
                        )
                    })
                }
                {this.state.moreList.length!== 0 && <h3>更多榜单</h3>}
                <ul className="more-list">
                {
                    this.state.moreList.map(item => {
                        return(
                            <Link to={{ pathname: `/playlist/${item.id}`, state:'排行榜'}} key={item.id}>
                                <li key={item.id}>
                                    <span date-update={item.updateFrequency}>
                                        <ImgLoad imgSrc={item.coverImgUrl}/>
                                    </span>
                                    <p className="text-overflow">
                                        {item.name}
                                    </p>
                                </li>
                            </Link>
                        )
                    })
                }
                </ul>
            </section>
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
export default  connect(
    mapStateToProps,
    mapDispatchToProps
  )(topList)