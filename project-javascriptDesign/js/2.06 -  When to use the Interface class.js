// Constructor.

var Interface = function(name, methods) {
    if(arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length
            + "arguments, but expected exactly 2.");
    }

    this.name = name;
    this.methods = [];
    for(var i = 0, len = methods.length; i < len; i++) {
        if(typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be "
                + "passed in as a string.");
        }
        this.methods.push(methods[i]);
    }
};

// Static class method.

Interface.ensureImplements = function(object) {
    if(arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " +
            arguments.length  + "arguments, but expected at least 2.");
    }

    for(var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if(interface.constructor !== Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments "
                + "two and above to be instances of Interface.");
        }

        for(var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j];
            if(!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function Interface.ensureImplements: object "
                    + "does not implement the " + interface.name
                    + " interface. Method " + method + " was not found.");
            }
        }
    }
};

var DynamicMap = new Interface('DynamicMap', ['centerOnPoint', 'zoom', 'draw']);

function displayRoute(mapInstance) {
    Interface.ensureImplements(mapInstance, DynamicMap);
    mapInstance.centerOnPoint(12, 34);
    mapInstance.zoom(5);
    mapInstance.draw();
    //...
}

var SmallMap = function(type){
    this.type = type;
};
SmallMap.prototype.centerOnPoint = function(x, y){
    console.log(x + " : " + y);
};
SmallMap.prototype.zoom = function(z){
    console.log(z);
};
SmallMap.prototype.draw = function(){
    console.log("draw");
};

var mapInstance = new SmallMap("small");
displayRoute(mapInstance);