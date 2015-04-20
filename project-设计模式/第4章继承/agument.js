/**
 * Created by Administrator on 2015/4/17.
 */
function agument(receivingClass, givingClass){
    receivingClass.prototype = receivingClass.prototype || {};
    if(arguments[2]){
        for(var i = 2, len = arguments.length; i < len; i++){
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    }else{
        for(var methodName in givingClass.prototype){
            if(!receivingClass.prototype || !receivingClass.prototype[methodName]){
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }
        }
    }
}