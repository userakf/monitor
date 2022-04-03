import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
import tracker from "../utils/tracker";

export function injectJsError() {
    window.addEventListener('error', function (event) {
        // console.log('event',event);
        let lastEvent = getLastEvent(event)
        // 这是一个脚本加载错误
        if(event.target && (event.target.src || event.target.href)){
            tracker.send({
                kind: 'stability',
                type: 'error',
                errorType: 'resourceError', //js或css加载错误
                filename: event.target.src || event.target.href,
                tagName: event.target.tagName, // 脚本名字
                selector: getSelector(event.target)
            })
        } else {
            tracker.send({
                kind: 'stability',
                type: 'error',
                errorType: 'jsError',
                message: event.message,
                filename: event.filename,
                position: `${event.lineno}:${event.colno}`,
                stack: getLines(event.error.stack),
                selector: lastEvent ? getSelector(lastEvent.path) : ''
            })
        }
    },true)
    window.addEventListener('unhandledrejection', function (event) {
        console.log(event);
        let lastEvent = getLastEvent(event)
        let message
        let filename
        let lineno = 0
        let colno = 0
        let stack = ''
        let reason = event.reason
        if (typeof reason === 'string') {
            message = reason
        } else if (typeof reason === 'object') { // 如果是一个错误对象
            message = reason.message

            //at http://localhost:8082/:20:38
            if(reason.stack){
                let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
                filename = matchResult[1]
                lineno = matchResult[2]
                colno = matchResult[3]
            }
            stack = getLines(reason.stack)
        }
        tracker.send({
            kind: 'stability',
            type: 'error',
            errorType: 'Promise Error',
            message,
            filename,
            position: `${lineno}:${colno}`,
            stack,
            selector: lastEvent ? getSelector(lastEvent.path) : ''
        })
    },true)

    function getLines(stack) {
        return stack.split('\n').slice(1).map((item) => item.replace(/^\s+at\s+/g, '')).join('^')
    }
}