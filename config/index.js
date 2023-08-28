import dev from "./dev.config";
import prod from "./prod.config";
import trial from "./trial.config";

/**
 * 环境变量
 */
let env = "release";
let config = {};
if (wx.canIUse("getAccountInfoSync")) {
  env = wx.getAccountInfoSync().miniProgram.envVersion;
  if (env === "trial") {
    config = {
      ...trial,
    };
  } else if (env === "develop") {
    config = {
      ...dev,
    };
  } else if (env === "release") {
    config = {
      ...prod,
    };
  }
}
console.log("env", env);
module.exports = {
  env,
  config,
};
