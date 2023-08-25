import wxRequest from "../../utils/request";

/* 我的 */
/* 查询当前用户信息 */
export const getCurrentUser = () => {
  return wxRequest.get("/api/user/user/info/getCurrentUser");
};

/* 修改当前用户信息 */
export const updateUserInfo = (query) => {
  return wxRequest.get("/api/user/user/info/updateUserInfo", query);
};

export const getWorkDetail = (query) => {
  return wxRequest.get("/api/labor/recruit/detail", query);
};
// 好活收藏
export const getRecruitMyCollect = (query) => {
  return wxRequest.get("/api/labor/recruit/myCollect", query);
};
// 好工收藏
export const getWorkerCardMyCollect = (query) => {
  return wxRequest.get("/api/labor/workerCard/myCollect", query);
};

/* 关闭找活名片 */
export const closeWorkerCard = (workerCardId) => {
  return wxRequest.post(
    `/api/labor/workerCard/closeWorkerCard?workerCardId=${workerCardId}`
  );
};
/* 重新发布找活名片 */
export const publishWorkerCard = (workerCardId) => {
  return wxRequest.post(
    `/api/labor/workerCard/addWorkerCardAgain?workerCardId=${workerCardId}`
  );
};
/* 招工管理 */

export const myRecruitList = (query) => {
  return wxRequest.get("/api/labor/recruit/myRecruit", query);
};

/* 找活名片 */
export const myWorkerCard = (query) => {
  return wxRequest.get("/api/labor/workerCard/myWorkerCard", query);
};
/* 关闭招工 */
export const closeRecruit = (id) => {
  return wxRequest.post("/api/labor/recruit/closeRecruit?recruitId=" + id);
};

/* 重新发布招工 */
export const addRecruitAgain = (id) => {
  return wxRequest.post("/api/labor/recruit/addRecruitAgain?recruitId=" + id);
};

/* 注销账号 */
export const cancelAccount = (data) => {
  return wxRequest.post("/api/user/user/info/cancelAccount", data);
};
