import wxRequest from '../../utils/request'
// 文件上传
export const upload = data => {
  return wxRequest.uploadFile('/api/resource/oss/upload', data)
}

/* 坐标转位置信息 */
export const locationToAddress = params => {
  return wxRequest.post(
    '/api/system/dict/dictHttpRequest/tx/tengxun_map_geocoder_location?requstWay=get&dictType=zshb_tengxun_map',
    params
  )
}

/* 查询字典类型 */
export const getDictTypeData = dictType => {
  return wxRequest.get('/api/system/dict/type/' + dictType)
}

/* 获取手机号 */
export const getPhone = userId => {
  return wxRequest.get(`/api/user/user/info/getPhoneNumber?userId=${userId}`)
}

/* 收藏工人 */
export const collectWorker = workerCardId => {
  return wxRequest.post(
    `/api/labor/workerCard/collect?workerCardId=${workerCardId}`
  )
}

/* 收藏工作 */
export const collectJob = recruitId => {
  return wxRequest.post(`/api/labor/recruit/collect?recruitId=${recruitId}`)
}

/* 关键词搜索 */
export const mapSuggestion = parmas => {
  return wxRequest.post(
    '/api/system/dict/dictHttpRequest/tx/tengxun_map_suggestion?requstWay=get&dictType=zshb_tengxun_map',
    parmas
  )
}
