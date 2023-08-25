import wxRequest from '../../utils/request'
export const search = parmas => {
  return wxRequest.post(
    '/api/system/dict/dictHttpRequest/tx/tengxun_map_search?requstWay=get&dictType=zshb_tengxun_map',
    parmas
  )
}
