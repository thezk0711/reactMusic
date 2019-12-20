import { combineReducers } from 'redux'
import * as ActionTypes from './actionTypes'
const defaultState = {
    isShowPlayer: false,
    currentMusic:{},
    headerOptions: {
        isShowHeader: false, // 是否显示子导航栏
        headerTitle: '', // 子导航栏标题
        status: 0 // 子导航栏文字颜色 0黑色 1白色
    },
    musicList: []
}
function isShowPlayer(isShowPlayer = defaultState.isShowPlayer,action){
    if(action.type === ActionTypes.SET_SHOW_PLAYER){
        return action.isShowPlayer
    }
    return isShowPlayer
}
function headerOptions(headerOptions = defaultState.headerOptions,action){
    if(action.type === ActionTypes.SET_HEADER_OPTIONS){
        return action.headerOptions
    }
    return headerOptions
}
function currentMusic(currentMusic = defaultState.currentMusic,action){
    if(action.type === ActionTypes.SET_CURRENT_MUSIC){
        return action.currentMusic
    }
    return currentMusic
}
function musicList(musicList = defaultState.musicList,action){
    if(action.type === ActionTypes.SET_MUSIC_LIST){
        return action.musicList
    }
    return musicList
}
const reducer = combineReducers({
    isShowPlayer,
    currentMusic,
    headerOptions,
    musicList
})
export default reducer