import wxRequest from "../../utils/request";

export const getAreasList = () => {
  return wxRequest.get("/api/system/region/getAll");
};
