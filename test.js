var sql = '';
var zid = '';
$(function () {
    //公式管理
    $('#tt').tree({
        dnd: true,
        lines: true,
        url: 'FormulaMenuServlet',
        onClick: function (node) {
            $("#tt").tree('expandAll', node.target);
        },
        onBeforeDrag: function (node) {
            //判断是文件夹或模块是不让拖动 （拖动之前触发）
            var zll = node.id;
            zll = zll.substring(zll.indexOf(",") + 1);
            if (zll == 'module' || zll == 'folder') {
                return false;
            }
        },
        onDblClick: function (node) {//双击事件
            var pd = $("#tt").tree('getChildren', node.target).id;
            if (pd == undefined) {
                var id = node.id.substring(0, node.id.indexOf(","));
                zid = id;
                $.ajax({
                    type: 'post',
                    url: "FormulaUpdate",
                    data: {yid: 'yy', pid: id},
                    success: function (data) {
                        console.info(data);
                        $.each($.parseJSON(data), function (p1, p2) {
                            $("#shu").val(p2.ruleJavaSource);
                            sql = p2.ruleExeClass;
                        });
                    }
                });
            }
        },
        onDrop: function (target, source, point) {
            var id = $("#tt").tree('getSelected', $("#tt").tree('select', target).target).id;
            id = id.substring(0, id.indexOf(","));
            $.ajax({
                type: 'post',
                url: "FormulaUpdate",
                data: {yid: source.id, pid: id},
                success: function (data) {

                }
            });
        },
        onBeforeDrop: function (target, source, point) {
            var id = $("#tt").tree('getSelected', $("#tt").tree('select', target).target).id;
            var p = id.substring(id.indexOf(",") + 1);
            var pp = source.id.substring(source.id.indexOf(",") + 1);
            /* if(p=='r'){
             return false;
             } */
            /* if(pp=='s'&&p!='folder'){
             return false;
             } */
            /* if(pp=='r'&&p!='s'){
             return false;
             } */
            if (pp == 's' && p == 's') {//如果是平级排序

                $('#tt').tree('insert', {
                    before: target,
                    data: {
                        id: source.id,
                        text: source.text,
                        state: 'closed',
                        children: [
                            {
                                text: 'node241'
                            },
                            {
                                text: 'node242'
                            }
                        ]
                    }
                });

                $('#tt').tree('remove', source.target);
            }

            if (pp == 'r' && p == 'r') {//如果是平级排序

                $('#tt').tree('insert', {
                    before: target,
                    data: {
                        id: source.id,
                        text: source.text
                    }
                });

                $('#tt').tree('remove', source.target);
            }
            return false;
        }

    });

    //实体字段
    $('#shiti').tree({
        lines: true,
        url: 'FormulaServlet',
        onDblClick: function (node) {

            var pd = $("#shiti").tree('getChildren', node.target).id;
            var f = null;
            if ($("#shiti").tree('getParent', node.target) != null) {
                f = $("#shiti").tree('getParent', $("#shiti").tree('getParent', node.target).target);
            }
            if ($("#shiti").tree('getParent', node.target) != null) {
                /* var zhi=$("#shu").val();
                 if(zhi.trim().length!=0){
                 zhi=zhi+'  ,  '+'['+$("#shiti").tree('getParent', node.target).text+'.'+node.text+']';
                 sql=sql+'  ,  '+$("#shiti").tree('getParent',node.target).attributes.code+'.'+node.attributes.code;
                 }else{
                 zhi='['+$("#shiti").tree('getParent', node.target).text+'.'+node.text+']';
                 sql=$("#shiti").tree('getParent', node.target).attributes.code+'.'+node.attributes.code+']';
                 }  */
                var zhi = '';
                if (f == null) {
                    zhi = '[' + node.text + ']';
                } else {
                    zhi = '[' + $("#shiti").tree('getParent', node.target).text + '.' + node.text + ']';
                }
                $("#shu").insertAtCaret(zhi);
                var xin = $("#shu").val();
                if (xin.indexOf("]]") > 0 || xin.indexOf("[[") > 0) {
                    $.messager.alert('温馨提示', '语法有误，请改正。');
                }
            }
        }
    });

});
function getdbd() {
    var dd = $("#tt").tree('getSelected');
    alert($("#tt").tree('getParent', $("#tt").tree('select', dd.target)).text);
}
function qing() {
    $("#shu").val('');
}
function sqlzh() {
    $.ajax({
        type: 'post',
        url: "FormulasqlServlet",
        data: {sql: $("#shu").val()},
        success: function (data) {
            sql = data;
            $("#dda").html(data);
            $('#dda').dialog({
                title: '查询转化',
                width: 400,
                height: 200,
                closed: false,
                modal: true
            });

        }
    });

}
//sql校验
function sqlxy() {
    $.ajax({
        type: 'post',
        async: false,
        url: "FormulasqlServlet",
        data: {sql: $("#shu").val()},
        success: function (data) {
            sql = data;


        }
    });

    $.ajax({
        type: 'post',
        url: "FormulaSqlCheck",
        data: {sql: sql},
        success: function (data) {
            if (data == 's') {
                $.messager.alert('温馨提示', 'SQL语法有误');
            } else {
                $.messager.show({
                    title: '温馨提示',
                    msg: 'SQL校验成功！',
                    timeout: 800,
                    style: {
                        right: '',
                        top: document.body.scrollTop
                            + document.documentElement.scrollTop,
                        bottom: ''
                    }
                });
            }
        }
    });
}
//保存sql
function saveSql() {
    if (zid == '') {
        $.messager.alert('温馨提示', '请选择你要保存的公式');
        return false;
    }
    $.ajax({
        type: 'post',
        async: false,
        url: "FormulasqlServlet",
        data: {sql: $("#shu").val()},
        success: function (data) {
            sql = data;
            $.ajax({
                type: 'post',
                async: false,
                url: "FormulaSqlCheck",
                data: {sql: sql, save: 'save', hsql: $("#shu").val(), pid: zid},
                success: function (data) {
                    if (data == 's') {
                        $.messager.alert('温馨提示', 'SQL语法有误！');
                    } else {

                        $.messager.alert('温馨提示', '保存成功！');

                    }
                }
            });


        }
    });

}
function getdbd() {
    $('#tt').tree({
        dnd: true,
        lines: true,
        url: 'FormulaMenuServlet'});
}
//删除
function removeRole() {
    var node = $('#tt').tree('getSelected');

    $.messager.alert('温馨提示', '请选择你要删除的节点！');

    $.messager.confirm('温馨提示', '确定要删除吗？', function (r) {
        if (r) {
            $.ajax({
                url: "MenuPaixuServlet",
                data: {
                    ff: "shan",
                    menuid: node.id
                },
                success: function () {
                    $('#tt').tree('remove', node.target);
                }
            });
        }
    });
}
//修改
function editRole() {
    var node = $('#tt').tree('getSelected');
    if (node == null) {
        $.messager.alert('温馨提示', '请选择你要修改的节点菜单');
        return false;
    }
    $('#dd').css({
        'display': 'block'
    });
    $('#dd').dialog({
        title: '请输入菜单名称：',
        width: 350,
        height: 130,
        closed: false,
        cache: false,
        modal: true,
        buttons: [
            {
                text: '保存',
                handler: function () {


                    $.post("MenuPaixuServlet", {ff: 'gai', mid: node.id, mname: $("#menuName").val()},
                        function (data) {
                            $('#tt').tree('update', {
                                target: node.target,
                                text: $("#menuName").val()
                            });
                            $("#dd").dialog('close');
                            saveSuccess();
                        });
                }
            },
            {
                text: '取消',
                handler: function () {
                    $("#dd").dialog('close');
                }
            }
        ]

    });

}
function addRole(id) {
    var node = $('#tt').tree('getSelected');
    var id = node.id;
    var bs = id.substring(id.indexOf(",") + 1);
    id = id.subtring(0, id.indexOf(","));
    if (ba == 's' && id == 1) {


    } else if (ba == 'r' && id == 2) {


    } else {
        if (id == 1) {
            $.messager.alert('温馨提示', '请选择你要增加的方案');
        }
        if (id == 2) {
            $.messager.alert('温馨提示', '请选择你要增加的公式');
        }

    }
}