function getSelectors(path){
    return path.reverse().filter(ele => {
        return ele !== document && ele !== window
    }).map(ele => {
        let selector = ''
        if(ele.id){
            return `${ele.nodeName.toLowerCase()}#${ele.id}`
        } else if(ele.className && typeof ele.className === 'string'){
            return `${ele.nodeName.toLowerCase()}.${ele.className}`
        } else {
            selector = ele.nodeName.toLowerCase() 
        }
        return selector
    }).join(' ')
}
export default function(pathOrTarget){
    if(Array.isArray(pathOrTarget)){ // 可能是一个数组
        return getSelectors(pathOrTarget)
    } else { // 可能是一个对象  
        let path = []
        while(pathOrTarget){
            path.push(pathOrTarget)
            pathOrTarget = pathOrTarget.parentNode
        }
        return getSelectors(path)
    }
}