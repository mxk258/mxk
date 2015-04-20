/**
 * Created by Administrator on 2015/4/15.
 */
function clone(object){
    function F(){}
    F.prototype = object;
    return new F();
}
