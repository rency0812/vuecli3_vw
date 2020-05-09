import axios from 'axios'

// let completed = 1 // 上次请求应完成后，下次请求才能开始
const transformData = (data) => {
  const arr = []
  if (!data) {
    return ''
  }
  Object.keys(data).forEach(k => {
    arr.push(`${k}=${data[k]}`)
  })
  return arr.join('&')
}

axios.defaults.timeout = 1000 * 15
// axios.defaults.transformRequest = [function (data) {
//   data = Qs.stringify(data)
//   return data
// }]
axios.interceptors.request.use(config => {
  config.headers.token = ''
  const data = transformData(config.data)
  if (config.method === 'post') {
    config.url = `${config.url}?${data}`
  }
  console.log(config)
  return config
}, error => {
  return Promise.reject(error)
})
axios.interceptors.response.use(res => {
  if (res) {
  }
  return res
}, error => {
  return Promise.reject(error)
})

export default axios
