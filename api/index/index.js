import wxRequest from "../../utils/request";

/** 小程序登录*/
export const xcxLogin = (code) => {
  return wxRequest.post(`/api/auth/login/xcxLogin?code=${code}`);
};

/** 小程序手机登录续期 */
export const xcxPhoneLogin = (phoneNumber, secretKey) => {
  return wxRequest.post(
    `/api/auth/login/xcxPhoneLogin?phoneNumber=${phoneNumber}&secretKey=${secretKey}`
  );
};

/** 发送凭证绑定手机号 */
export const xcxFirstLogin = (loginCode, phoneCode) => {
  return wxRequest.post(
    `/api/auth/login/xcxFirstLogin?loginCode=${loginCode}&phoneCode=${phoneCode}`
  );
};

/** 退出登录 */
export const wxLogout = () => {
  return wxRequest.delete(`/api/auth/login/logout`);
};

/* 获取招工列表 */
export const getWorkInfoList = (query) => {
  return wxRequest.get("/api/labor/recruit/scrollList", query);
};

/* 查询招工详情 */
export const getWorkDetail = (query) => {
  return wxRequest.get("/api/labor/recruit/detail", query);
};
