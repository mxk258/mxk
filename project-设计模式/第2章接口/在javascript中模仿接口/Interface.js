/**
 * Created by Administrator on 2015/4/3.
 */
//Constructor
var Interface = function(name, methods){
    if(arguments.length != 2){
        throw new Error("Interface constructor called with " + arguments.length + " arguments, but expected exactly 2.");
    }
    this.name = name;
    this.methods = [];
    for(var i = 0, iLen = methods.length; i < iLen; i++){
        if(typeof methods[i] !== "string"){
            throw new Error("Interface constructor expects methods names to be passed in a string");
        }
        this.methods.push(methods[i]);
    }
};

//static class method
Interface.ensureImplements = function(object){
    if(arguments.length < 2){
        throw new Error("Function Interface.ensureImplements class with " + arguments.length + " arguments, but expected at least 2.");
    }
    for(var i = 1, iLen = arguments.length; i < iLen; i++){
        var interface = arguments[i];
        if(interface.constructor !== Interface){
            throw new Error("Function Interface.unsureImplements expected arguments two and above to be instances of Interface.");
        }
        for(var j = 0, jLen = interface.methods.length; j < jLen; j++){
            var method = interface.methods[j];
            if(!object[method] || typeof object[method] !== "function"){
                throw new Error("Function Interface.ensureImplements: object dose not implement the " + interface.name + " interface.Method " + method + " was not found.");
            }
        }
    }
};
