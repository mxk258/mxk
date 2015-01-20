var GLOBAL = GLOBAL || {};
GLOBAL.Methods = GLOBAL.Methods || {};
GLOBAL.eventUtil = GLOBAL.eventUtil || {};
//事件绑定
GLOBAL.eventUtil = {
	addHandler: function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	removeHandler: function() {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.deathEvent) {
			element.deathEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	}
};
//tab
GLOBAL.Tab = GLOBAL.Tab || {};
GLOBAL.Tab.init = function() {
	$(".tab-btn a").bind("mouseover", function() {
		var $tab = $(this).closest(".tab");
		var index = $(this).index();
		var $selected = $(this).siblings(".selected").removeClass("selected");
		$(this).addClass("selected");
		$tab.find(".box_tab").removeClass("show").hide().eq(index).show();
	});
};
//轮播图
GLOBAL.Slide = GLOBAL.Slide || {};
GLOBAL.Slide.init = function(id) {
	var $slide = $("#" + id);
	var $lsImg = $slide.find(".ls_img li");
	var $lsBtnBox = $slide.find(".ls_btn");
	var $lsBtn;
    var slsBtn = "";
    var timer = setInterval(function(){
        var width = $("#" + id + " .ls_img li:eq(0) img").width();
        if(width > 0){
            $slide.find(".ls_img").css("marginLeft", -width/2 + "px");
            clearInterval(timer);
        }
    },30);
    $slide.selectedIndex = 0;
    $slide.time = 4000;
	//生成圆点
	for (var i = 1, iLen = $lsImg.length + 1; i < iLen; i++) {
		slsBtn += "<li>" + i + "</li>";
	}
	$lsBtnBox.empty();
	$lsBtnBox.html(slsBtn);
	//$lsBtnBox.css("marginLeft", -$lsBtnBox.width() / 2 + "px");
	$lsBtn = $lsBtnBox.find("li");
	$lsBtn.eq(0).addClass("m0 selected");
	//计算位置
	$lsImg.each(function(index, element) {
		var width = $(this).width();
		//$(this).css("marginLeft", -width / 2 + "px");
	});
	//btn点击事件绑定
	$lsBtn.on({
		click: function() {
			var index = $(this).index();
			if (!$lsImg.is(":animated")) {
				$(this).siblings("li").removeClass("selected").end().addClass("selected");
				$lsImg.removeClass("show").fadeOut("1200").eq(index).fadeIn("1000");
				$slide.selectedIndex = index;
			}
		}
	});

	//轮播图鼠标悬浮	
	$slide.bind({
		mouseover: function() {
			clearInterval($slide.timer);
		},
		mouseout: function() {
			$slide.timer = setInterval($slide.play, $slide.time);
			return false;
		}
	});

	$slide.play = function() {
		if ($slide.selectedIndex == $lsBtn.length - 1) {
			$slide.selectedIndex = -1;
		}
		$slide.selectedIndex++;
		$lsBtn.eq($slide.selectedIndex).trigger("click");
	}

	//开始动画
	$slide.timer = setInterval($slide.play, $slide.time);
};
//roll
GLOBAL.Roll = GLOBAL.Roll || {};
GLOBAL.Roll.init = function(object) {
    var id = object.id;
    var rollNum = object.rollNum;
	var $roll = $("#" + id);
	var $prev = $roll.find(".prev");
	var $next = $roll.find(".next");
    var $round = $roll.find(".ls-rollRound");
	var $ul = $roll.find(".ls_roll01");
	var $li = $ul.find("li");
	var length = $li.length;
	var width = $li.width();
	var time = 500;
    var count = 0;
	$ul.css("width", $li.rollNum * width + "px");

    if($round.length == 1){
        $round.empty();
        for(var i = 0,iLen = Math.ceil(length/4); i < iLen; i++){
            var sLi = "<li></li>";
            $round.append(sLi);
        }
        $round.find("li:eq(0)").addClass("selected");
    }
	//向左滚动
	$prev.on({
		click: function() {
            if(!$ul.is(":animated")) {
                $ul.animate({
                    left: -width * rollNum + "px"
                }, time, function () {
                    var $point = $(this).find("li:lt(" + rollNum + ")");
                    $(this).css({
                        left: 0
                    });
                    $(this).find("li:lt(" + rollNum + ")").appendTo($(this));
                    count--;
                    if (count <= 0) {
                        count = Math.ceil(length / 4);
                    }
                    $round.find("li").removeClass("selected").eq(count - 1).addClass("selected");
                });
            }
		}
	});
	//向右滚动
	$next.on({
		click: function() {
            if(!$ul.is(":animated")) {
                var pointIndex = length - (rollNum + 1);
                $ul.find("li:gt(" + pointIndex + ")").prependTo($ul);

                $ul.css({
                    left: -width * rollNum + "px"
                });
                $ul.animate({
                    left: 0
                }, time, function () {
                    count++;
                    if (count >= Math.ceil(length / 4)) {
                        count = 0;
                    }
                    $round.find("li").removeClass("selected").eq(count).addClass("selected");
                });
            }
		}
	});
};
//回到顶部
GLOBAL.Slide.returnTop = function() {
	var sBack = '<a id="returnBack"><img class="ma" src="../images/icon-27.png" /><span>回顶部</span></a>';
	$("body").append(sBack);
	var $back = $("#returnBack");
	$back.bind("click", function() {
		$('body,html').animate({
			scrollTop: 0
		}, 200, function() {
			$back.fadeOut(500);
		});
	});

	GLOBAL.eventUtil.addHandler(window, "scroll", function() {
		var top = document.documentElement.scrollTop || document.body.scrollTop;;
		if (top > 0) {
			$back.fadeIn(500);
		} else {
			$back.fadeOut(500);
		}
	});
};

//大广告
GLOBAL.Ad = GLOBAL.Ad || {};
GLOBAL.Ad.init = function(){
    var $mxkAdBig = $(".mxk-ad-big");
    $mxkAdBig.each(function(){
        var $img = $(this).find("img");
        var width = $img.width();
        var height = $img.height();
        $(this).css("height", height + "px");
        $img.css("marginLeft", -width/2 + "px");
    });
};

