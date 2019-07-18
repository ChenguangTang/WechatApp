const cloud = require('wx-server-sdk')
const tencentcloud = require("tencentcloud-sdk-nodejs");//node.js环境
cloud.init()
var Englishout = function (url) {
  const OcrClient = tencentcloud.ocr.v20181119.Client;
  const models = tencentcloud.ocr.v20181119.Models;
  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;
  let cred = new Credential("AKIDnTs1u3lby3td8LM4RbVN4WsnSt3xnkz7", "h8NL3kCOW7TeZFBtKfmb9QPDk1B7IFwM");
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "ocr.tencentcloudapi.com";
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  let client = new OcrClient(cred, "ap-beijing", clientProfile);
  let req = new models.EnglishOCRRequest();
  let params = '{"ImageUrl":"' + url + '"}' //图像地址
  req.from_json_string(params);//获得返回的数据
  //构造异步函数，调用OCR接口，将图像地址传送给API，获得返回的解析数据。
  return new Promise(function (resolve, reject) {
    client.EnglishOCR(req, function (errMsg, response) {
      if (errMsg) {
        reject(errMsg)
      } else {
        resolve(response);
      }
    })
  })
}
exports.main = async (event, context) => {
  const data = event
  const fileList = [data.fileID] //读取来自客户端的fileID
  const result = await cloud.getTempFileURL({
    fileList, //向云存储发起读取文件临时地址请求
  })
  datas = await Englishout(result.fileList[0].tempFileURL)
  //调用异步函数，向腾讯云API发起请求
  return datas
}