/**
 * Created by Administrator on 2015/4/17.
 * 掺元类
 * 有一种重用代码的方法不需要用到严格的继承。如果想把一个函数用到多个类中，可以通过扩充（augmentation）的方式让这些累共享该函数。
 * 传2个参数则复制givingClass的所有属性和方法
 * 传3个参数，第三个参数为方法名，复制givingClass的制定方法
 */
function augment(receivingClass, givingClass){
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