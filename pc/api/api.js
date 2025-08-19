import request from '@/plugins/request'

export const upload = (data) => {
  return request({
    url: '/api/v1/upload/add',
    method: 'post',
    data
  })
}

export const uploadChunk = (data) => {
  return request({
    url: '/api/v1/upload/uploadChunk',
    method: 'post',
    data,
  })
}

export const uploadMerge = (data) => {
  return request({
    url: '/api/v1/upload/mergeChunks',
    method: 'post',
    data,
 })
}

export const fileList = (params) => {
  return request({
    url: '/api/v1/file/getFileByCode',
    params
  })
}

export const download = (params) => {
  return request({
    url: '/api/v1/file/downloadFile',
    params,
 })
}

export const searchByCode = (params) => {
  return request({
    url: '/api/v1/goods/searchByCode',
    params,
 })
}

export const updateFile = (data) => {
  return request({
    url: '/api/v1/goods/updateFile',
    method: 'post',
    data,
  })
}

export const useCode = (data) => {
  return request({
    url: '/api/v1/file/usedFileCode',
    method: 'post',
    data,
  })
}

export const goodsList = (params) => {
  return request({
    url: '/api/goodsCategory',
    params,
 })
}

export const goodsCategory = () => {
  return request({
    url: '/api/category'
 })
}

export const goodsDetail = (params) => {
  return request({
    url: '/api/v1/goods/read',
    params,
 })
}

export const sendSms = (data) => {
  return request({
    url: '/api/v1/sms/sendVerifyCode',
    method: 'post',
    data,
 })
}

export const verifyCode = (data) => {
  return request({
    url: '/api/v1/sms/verifyCode',
    method: 'post',
    data,
  })
}

export const loginByPhone = (data) => {
  return request({
    url: '/api/v1/login/phoneLogin',
    method: 'post',
    data,
  })
}

export const qrCodePay = (param) => {
  return request({
    url: '/api/v1/pay/qrcodePay',
    params: param,
  })
}

export const adverts = () => {
	return request({
    url: '/api/adverts',
  })
}

export const activity = () => request({
	url: '/api/test/activity',
	methods: 'get'
})