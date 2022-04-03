let host = 'cn-guangzhou.log.aliyuncs.com'
let project = 'czp-monitor'
let logStore = 'czp-monitor-store'
let userAgent = require('user-agent')

function getExtraDate() {
    return {
        title: document.title,
        url: location.href,
        timestamp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent).name
        // 用户ID / token
    }
}
class SendTracker {
    constructor() {
        this.url = `http://${project}.${host}/logstores/${logStore}/track` // 上报路径
        this.xhr = new XMLHttpRequest
    }
    send(data = {}) {
        let extraData = getExtraDate()
        let log = { ...extraData, ...data }
        
        // 对象的值不能是数字
        for(let key in log){
            if(typeof log[key] === 'number'){
                log[key] = `${log[key]}`
            }
        }
       
        this.xhr.open('POST', this.url, true)
        console.log(log);
        let body = JSON.stringify({
            __logs__:[log]
        })
        this.xhr.setRequestHeader('Content-Type', 'application/json')
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0')
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length)
        this.xhr.onload = function () {

        }
        this.xhr.onerror = function (error) {

        }
        this.xhr.send(body)
    }
}
export default new SendTracker()