// components/common/van-popup/index.js
import { xcxFirstLogin } from "../../../api/index/index";
import { getCurrentUser } from "../../../api/mine/index";
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  options: {
    styleIsolation: "shared",
  },
  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    phoneCode: "",
    authorizationShow: false, // 授权弹窗
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 展示
    show() {
      this.setData({
        isShow: true,
      });
    },
    // 隐藏
    onCancel() {
      this.setData({
        isShow: false,
      });
    },
    async getPhoneNumber(e) {
      console.log("手机号绑定数据获取code", e);
      if ("getPhoneNumber:ok" === e.detail.errMsg) {
        var loginCode = app.globalData.loginCode;
        var phoneCode = e.detail.code;
        const res = await xcxFirstLogin(loginCode, phoneCode);
        if (res.code == 200) {
          wx.setStorageSync("phoneNumber", res.data.phoneNumber);
          wx.setStorageSync("accessToken", res.data.token);
          wx.setStorageSync("secretKey", res.data.secretKey);
          this.setData({
            authorizationShow: true,
          });
          const { code, data } = await getCurrentUser();
          if (code === 200) {
            app.globalData.userInfo = data;
          }
        } else if (res.code == 402 && res.msg == "此手机号已和其他微信绑定") {
          wx.showToast({
            title: "此手机号已和其他微信绑定",
            icon: "error",
            duration: 2000,
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 1000,
          });
        }
      }
    },
    onConfirm() {
      this.setData({
        isShow: false,
      });
    },
    /* 授权弹窗 */
    handlerAutnoeization(data) {
      this.setData({
        authorizationShow: data.detail,
      });
    },
  },
});
