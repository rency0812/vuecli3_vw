const weekDay = []
weekDay[0] = '周一'
weekDay[1] = '周二'
weekDay[2] = '周三'
weekDay[3] = '周四'
weekDay[4] = '周五'
weekDay[5] = '周六'
weekDay[6] = '周末'

export const formatTime = (date, type) => {
  const oDate = new Date(date)
  const year = oDate.getFullYear()
  const month = oDate.getMonth() + 1
  const day = oDate.getDate()
  const hour = oDate.getHours()
  const minute = oDate.getMinutes()
  const week = oDate.getDay()
  if (type === 1) {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
  if (type === 2) {
    return [year, month, day].map(formatNumber).join('.') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
  return year + '年' + [month, day].map(formatNumber).join('月') + '日' + ' ' + weekDay[week] + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export const scroll = (e, fn, val = 0) => {
  const $div = e.target || e.srcElement
  // scrollHeight: padding+ 全部内容的高度
  // scrollTop： 滚动条滚动的高度
  // clientHeight：padding+当前高度
  // $div.scrollHeight <= $div.scrollTop + $div.clientHeight
  const distance = $div.scrollHeight - ($div.scrollTop + $div.clientHeight)
  let timer = null
  if (distance <= val) {
    timer = setTimeout(fn, 300)
  }
}

export function qrScan (domId) {
  return new QRScan(domId)
}
function QRScan (domId) {
  this.domId = domId
  this.divCan = null
  this.videos = []
  this.medioConfig = {}
  this.canOpen = false
  this.init()
}
QRScan.prototype = {
  init () {
    window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL)
    let promisifiedOldGUM = function(constraints) {
      let getUserMedia = (navigator.getUserMedia ||
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia)
      if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
      }
      return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
    if(navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {}
    }
    if(navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = promisifiedOldGUM
    }

    // let self = this
    this.divCan = document.getElementById(self.domId);
    this.canOpen = true
    this.medioConfig = {
      audio: false,
      video: true
    }
    // navigator.mediaDevices.enumerateDevices().then(function(devices) {
    //   devices.forEach(function (dv) {
    //     let kind = dv.kind
    //     if (kind.match(/^video.*/)) {
    //       self.videos.push(dv.deviceId)
    //       console.log(dv)
    //     }
    //   })
    //   let len = self.videos.length
    //   self.canOpen = true
    //   self.medioConfig = {
    //     audio: false,
    //     video: { deviceId: self.videos[len - 1] }
    //   }
    // })
  },
  openScan () {
    let self = this
    if (self.canOpen) {
      let vd = document.createElement('video')
      vd.setAttribute('id', 'video_id')
      navigator.mediaDevices.getUserMedia(self.medioConfig).then(stream => {
        vd.src = window.URL.createObjectURL(stream)
        self.divCan.appendChild(vd)
      }).catch(err => {
        const str = `
          ERROR: ${err.name}
          <br>该浏览器不支持调用摄像头，请更换浏览器！
        `
        alert(str)
      })
      vd.play()
    }
  },
  closeScan () {
    this.divCan.innerHTML = ''
  },
  getImgDecode (func) {
    let self = this
    let video = document.getElementById('video_id')
    let canvas = document.createElement('canvas')
    canvas.width = 340
    canvas.height = 305
    let ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, 340, 305)
    if (canvas.toBlob === undefined) {
      let base64 = canvas.toDataURL()
      let blob = self.base64ToBlob(base64)
      self.sendBlob(blob, func)
    } else {
      canvas.toBlob(blob => {
        self.sendBlob(blob, func)
      })
    }
  },
  base64ToBlob (base64) {
    let code = window.atob(base64.split(',')[1])
    let len = code.length
    let as = new Uint8Array(len)
    for (let i=0; i < len; i++) {
      as[i] = code.charCodeAt(i)
    }
    return new Blob([as], {type: 'image/png'})
  },
  sendBlob (blob, func) {
    let fd = new FormData()
    fd.append('auth', 'lkl123456')
    fd.append('file', blob)
    let xhr = new XMLHttpRequest()
    // xhr.open('post', 'http://123.206.7.80:10082/api/parse', true)
    // xhr.onload = function () {
    //   func ? func(JSON.parse(xhr.responseText)) : null
    // }
    // xhr.send(fd)
  }
}

//日期格式化
export function formDate(date,format){
  var args = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
      "S": date.getMilliseconds()
  };
  if (/(y+)/.test(format))
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var i in args) {
      var n = args[i];
      if (new RegExp("(" + i + ")").test(format))
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
  }
  return format;
}