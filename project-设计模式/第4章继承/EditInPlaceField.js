/**
 * Created by Administrator on 2015/4/27.
 */
/*类式继承解决方案*/
function EditInPlaceField(id, parent, value){
    this.id = id;
    this.value = value || "default value";
    this.parentElement = parent;

    this.createElements(this.id);
    this.attachEvents();
}

EditInPlaceField.prototype = {
    createElements:function(id){
        this.containerElement = document.createElement("div");
        this.parentElement.appendChild(this.containerElement);

        this.staticElement = document.createElement("span");
        this.containerElement.appendChild(this.staticElement);
        this.staticElement.innerHTML = this.value;

        this.fieldElement = document.createElement("input");
        this.fieldElement.type = "text";
        this.fieldElement.value = this.value;
        this.containerElement.appendChild(this.fieldElement);

        this.saveButton = document.createElement("input");
        this.saveButton.type = "button";
        this.saveButton.value = "Save";
        this.containerElement.appendChild(this.saveButton);

        this.cancelButton = document.createElement("input");
        this.cancelButton.type = "button";
        this.cancelButton.value = "Cancel";
        this.containerElement.appendChild(this.cancelButton);
        this.convertToText();
    },
    attachEvents:function(){
        var that = this;
        GLOBAL.EventUtil.addHandler(this.staticElement, "click", function(e){
            var e = e || window.event;
            that.convertToEditable();
            GLOBAL.Method.stopPropagation(e);
        });
        GLOBAL.EventUtil.addHandler(this.saveButton, "click", function(e){
            var e = e || window.event;
            that.save();
            GLOBAL.Method.stopPropagation(e);
        });
        GLOBAL.EventUtil.addHandler(this.cancelButton, "click", function(e){
            var e = e || window.event;
            that.cancel();
            GLOBAL.Method.stopPropagation(e);
        });
        GLOBAL.EventUtil.addHandler(document, "click", function(){
            that.cancel();
        });
        /*addEvent(this.staticElement, "click", function(){
         that.convertToEditable();
         });
         addEvent(this.saveButton, "click", function(){
         that.save();
         });
         addEvent(this.cancelButton, "click", function(){
         that.cancel();
         });*/
    },
    convertToEditable:function(){
        this.staticElement.style.display = "none";
        this.fieldElement.style.display = "inline";
        this.saveButton.style.display = "inline";
        this.cancelButton.style.display = "inline";

        this.setValue(this.value);
    },
    save:function(){
        this.value = this.getValue();
        var that = this;
        var callback = {
            success:function(){
                that.convertToText();
            },
            failure:function(){
                alert("Error saving value.");
            }
        };
        ajaxRequest("GET", "save.php?id=" + this.id + "&value=" + this.value, callback);
    },
    cancel:function(){
        this.convertToText();
    },
    convertToText:function(){
        this.fieldElement.style.display = "none";
        this.saveButton.style.display = "none";
        this.cancelButton.style.display = "none";
        this.staticElement.style.display = "inline";

        this.setValue(this.value);
    },
    setValue:function(value){
        this.fieldElement.value = value;
        this.staticElement.innerHTML = value;
    },
    getValue:function(){
        return this.fieldElement.value;
    }
};

