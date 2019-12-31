import React, { Component ,lazy, Suspense} from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
  } from 'react-router-dom'
import Header from '../component/header'
import ChildHeader from '../component/childHeader'
import Player from '../component/player'
import PageLoading from '../component/pageLoading'
import { connect } from 'react-redux'
const Music = lazy(() => import('./music'))
const HotSearch = lazy(() => import('./hotSearch'))
const searchInfo = lazy(() => import('./searchInfo'))
const topList = lazy(() => import('./topList'))
const playList = lazy(() => import('./playList'))
const musicRecord = lazy(() => import('./musicRecord'))
class ReactRouter extends Component{
    render(){
        return(
            <Router>
                {this.props.headerOptions.isShowHeader ? <ChildHeader/> : <Header/>}
                <Suspense fallback={<PageLoading />}>
                    <Switch>
                        <Route path="/music" component={Music} />
                        <Route path="/hotSearch" component={HotSearch} />
                        <Route path="/searchInfo" component={searchInfo} />
                        <Route path="/topList" component={topList} />
                        <Route path="/playList/:playId" component={playList} />
                        <Route path="/musicRecord" component={musicRecord} />
                        <Redirect to="/music" />
                    </Switch>
                </Suspense>
                {this.props.isShowPlayer && <Player/>}
            </Router>
        )
    }
}
//映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
    isShowPlayer: state.isShowPlayer,
    headerOptions: state.headerOptions
})
export default connect(mapStateToProps)(ReactRouter)