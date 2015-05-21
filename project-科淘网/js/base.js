var GLOBAL = GLOBAL || {};

/*广告*/
GLOBAL.Ad = GLOBAL.Ad || {};
GLOBAL.Ad.init = function(){
	$(".ls-hover a").hover(
		function(){
			$(this).find(".title-bg").show();
			$(this).find(".title").show();
		},
		function(){
			$(this).find(".title-bg").fadeOut();
			$(this).find(".title").fadeOut();
		}
	);
};


GLOBAL.Methods = GLOBAL.Methods || {};
//事件绑定
GLOBAL.Methods.eventUtil = {
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

//创建xmlHttpRequest
GLOBAL.Methods.createXHR = function() {
	var xhr = null;
	if (typeof XMLHttpRequest != "undefined") {
		xhr = new XMLHttpRequest();
	} else if (typeof ActiveXObject != "undefined") {
		if (typeof arguments.callee.activeXString != "string") {
			var versions = ["MSXML2.XMLHttp.6.0", "MSXMLK2.XMLHttp.3.0", "MSXML2.XMLHttp"],
				len;
			for (i = 0, len = versions.length; i < len; i++) {
				try {
					new ActiveXObject(versions[i]);
					arguments.callee.activeXString = versions[i];
				} catch (ex) {}
			}
		}
		xhr = new ActiveXObject(arguments.callee.activeXString);
	} else {
		throw new Error("No XHR obejct available.");
	}
	return xhr;
};

//遮罩层
GLOBAL.Shade = GLOBAL.Shade || {};
GLOBAL.Shade.init = function() {
	var $shade = $("#shade");
	var $body = $("body");
	if ($shade.length == 0) {
		var sShade = "<div id='shade'></div>";
		$("body").append(sShade);
	}
	$("#shade").fadeIn();
	$("#shadeContent").fadeIn();
	GLOBAL.Shade.close();
};

GLOBAL.Shade.close = function() {
	$(".shade_close").bind("click", function(){
		$("#shade").fadeOut();
		$("#shadeContent").fadeOut();	
	});
};

//搜索
GLOBAL.Search = GLOBAL.Search || {};
GLOBAL.Search.init = function() {

	var $searchBtn = $("#searchList li a");
	var $searchForm = $("#searchForm");
	$searchBtn.bind("click", function() {
		$searchBtn.removeClass("selected");
		$(this).addClass("selected");
		$searchForm.attr("action", $(this).attr("value"));
	});
};

//轮播图
GLOBAL.Slide = GLOBAL.Slide || {};
GLOBAL.Slide.init = function(id) {
	var $slide = $("#" + id);
	var $lsImg = $slide.find(".ls_img li");
	var $lsBtnBox = $slide.find(".ls_btn");
	var $lsBtn;
	$slide.selectedIndex = 0;
	var slsBtn = "";
	$slide.time = 4000;
	//生成圆点
	for (var i = 1, iLen = $lsImg.length + 1; i < iLen; i++) {
		slsBtn += "<li>" + i + "</li>";
	}
	$lsBtnBox.empty();
	$lsBtnBox.html(slsBtn);
	$lsBtnBox.css("marginLeft", -$lsBtnBox.width() / 2 + "px");
	$lsBtn = $lsBtnBox.find("li");
	$lsBtn.eq(0).addClass("m0 selected");
	//计算位置
	$lsImg.each(function(index, element) {
		var width = $(this).width();
		$(this).css("marginLeft", -width / 2 + "px");
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
//回到顶部
GLOBAL.Slide.returnTop = function() {
	var sBack = '<div id="returnBack"></div>';
	$("body").append(sBack);
	var $back = $("#returnBack");
	$back.bind("click", function() {
		$('body,html').animate({
			scrollTop: 0
		}, 200, function() {
			$back.fadeOut(500);
		});
	});

	GLOBAL.Methods.eventUtil.addHandler(window, "scroll", function() {
		var top = document.documentElement.scrollTop || document.body.scrollTop;;
		if (top > 0) {
			$back.fadeIn(500);
		} else {
			$back.fadeOut(500);
		}
	});
};
GLOBAL.Slide.returnTop();

//首页一级导航hover
GLOBAL.Nav1 = GLOBAL.Nav1 || {};
GLOBAL.Nav1.hover = function() {
	var $lsNav1 = $(".ls_nav1 li");
	var selectedIndex = $(".ls_nav1 li.selected").index();
	$(".ls_nav1 li").on({
		mouseover: function() {
			$(this).siblings("li").removeClass("selected").end().addClass("selected");
		},
		mouseout: function() {
			$(this).removeClass("selected");
			$lsNav1.eq(selectedIndex).addClass("selected");
		}
	});
};
GLOBAL.Nav1.Slide = function() {
	$("#showNavSlide").bind("mouseover", function() {
		$(".nav_slide").fadeIn(200);
	});
	$("#navSlide li").bind("mouseover", function() {
		$(this).find(".subitem").fadeIn(200);
	});
	$("#navSlide li").bind("mouseleave", function() {
		$(this).find(".subitem").fadeOut(50);
	});
	$(".nav_slide").bind("mouseleave", function() {
		$(".nav_slide").fadeOut(50);
	});
};

//首页二级导航菜单hover
GLOBAL.Nav2 = GLOBAL.Nav2 || {};
GLOBAL.Nav2.hover = function() {
	$(".ls_nav_main li").each(function(index, element) {
		var $img = $(this).find(".left img");
		var src = $img.attr("src");
		$(this).data("img", src);
		src = src.slice(0, -4) + "_hover.png";
		$(this).data("img_hover", src);
	});
	$(".ls_nav_main li").on({
		mouseover: function() {
			var $img = $(this).find(".left img");
			var $subitem = $(this).find(".subitem");
			$(this).addClass("hover");
			$img.attr("src", $(this).data("img_hover"));
			$subitem.fadeIn(100);
			return false;
		},
		mouseleave: function() {
			var $img = $(this).find(".left img");
			var $subitem = $(this).find(".subitem");
			$(this).removeClass("hover");
			$img.attr("src", $(this).data("img"));
			$subitem.fadeOut(100);
		}
	});
};

//tab
GLOBAL.Tab = GLOBAL.Tab || {};
GLOBAL.Tab.init = function() {
	$(".ls_tab li").bind("mouseover", function() {
		var $tab = $(this).closest(".tabs");
		var index = $(this).index();
		var $selected = $(this).siblings(".selected").removeClass("selected");
		if ($selected.find(".arrowDown")) {
			$selected.find(".arrowDown").hide();
		}
		$(this).addClass("selected");
		if ($(this).find(".arrowDown")) {
			$(this).find(".arrowDown").fadeIn();
		}
		$tab.find(".box_tab").removeClass("show").hide().eq(index).show();
	});
};

//roll
GLOBAL.Roll = GLOBAL.Roll || {};
GLOBAL.Roll.init = function(id) {
	var $roll = $("#" + id);
	var $prev = $roll.find(".prev");
	var $next = $roll.find(".next");
	var $ul = $roll.find(".ls_roll01");
	var $li = $ul.find("li");
	var length = $li.length;
	var width = $li.width() + 1;
	var time = 500;
	$ul.css("width", $li.length * width + "px");
	//向左滚动
	$prev.on({
		click: function() {
			$ul.animate({
				left: -width * 3 + "px"
			}, time, function() {
				var $point = $(this).find("li:lt(3)");
				$(this).css({
					left: 0
				});
				$(this).find("li:lt(3)").appendTo($(this));
			});
		}
	});
	//向右滚动
	$next.on({
		click: function() {
			var pointIndex = length - 4;
			$ul.find("li:gt(" + pointIndex + ")").prependTo($ul);

			$ul.css({
				left: -width * 3 + "px"
			});
			$ul.animate({
				left: 0
			}, time);
		}
	});
};
GLOBAL.Roll.init2 = function(id) {
	var $roll = $("#" + id);
	var $prev = $roll.find(".prev");
	var $next = $roll.find(".next");
	var $ul = $roll.find(".roll").find(".ls_roll01");
	var $li = $ul.find("li");
	var length = $li.length;
	var width = $li.width() + 13;
	var rollLength = 2;
	var time = 500;
	$ul.css("width", $li.length * width + "px");
	//向左滚动
	$prev.on({
		click: function() {
			$ul.animate({
				left: -width * rollLength + "px"
			}, time, function() {
				var $point = $(this).find("li:lt(" + rollLength + ")");
				$(this).css({
					left: 0
				});
				$(this).find("li:lt(" + rollLength + ")").appendTo($(this));
			});
		}
	});
	//向右滚动
	$next.on({
		click: function() {
			var pointIndex = length - rollLength - 1;
			$ul.find("li:gt(" + pointIndex + ")").prependTo($ul);

			$ul.css({
				left: -width * rollLength + "px"
			});
			$ul.animate({
				left: 0
			}, time);
		}
	});
};

//title
GLOBAL.Title = GLOBAL.Title || {};
GLOBAL.Title.init = function() {
	var $title = $("#title");
	$title.fadeIn();
	//打开
	$("#title .titleOpen").bind({
		click: function() {
			$title.removeClass("title01").addClass("title02");
		}
	});
	//隐藏
	$("#title .titleHide").bind({
		click: function() {
			$title.removeClass("title02").addClass("title01");
		}
	});
	//关闭
	$("#title .titleClose").bind({
		click: function() {
			$title.fadeOut();
		}
	});
};

//遮罩层
GLOBAL.Shade = GLOBAL.Shade || {};
GLOBAL.Shade.init = function() {
    var $shade = $("#shade");
    var $body = $("body");
    if ($shade.length == 0) {
        var sShade = "<div id='shade'></div>";
        $("body").append(sShade);
    }
    $("#shade").fadeIn();
    $("#shadeContent").fadeIn();
    GLOBAL.Shade.close();
};

GLOBAL.Shade.close = function() {
    $(".shade_close").bind("click", function(){
        $("#shade").fadeOut();
        $("#shadeContent").fadeOut();
    });
};