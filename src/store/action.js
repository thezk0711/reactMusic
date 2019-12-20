import * as ActionTypes from './actionTypes'

// 显示Player组件
export function setShowPlayer(isShowPlayer) {
  return { type: ActionTypes.SET_SHOW_PLAYER, isShowPlayer }
}
// 设置当前播放
export const currentMusic = (currentMusic)=>{
    return{ type: ActionTypes.SET_CURRENT_MUSIC, currentMusic }
}
// 是否显示子页面header
export function setHeaderOptions(headerOptions) {
  return { type: ActionTypes.SET_HEADER_OPTIONS, headerOptions }
}
// 设置当前播放列表
export function setMusicList(musicList) {
  return { type: ActionTypes.SET_MUSIC_LIST, musicList }
}