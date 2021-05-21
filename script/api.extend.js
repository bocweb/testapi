//api.js扩展库，对api.js中的一些函数与常用方法进行封装，便于管理。
! function (context) {
  var apiready_base; //指向apiready
  var apireadyExtend = function () { //apiready的扩展，先执行此方法，后执行apiready，此函数也是在api初始化完毕后自动调用，所以api在此函数中可正常调用
    //console.log封装，非debug环境下，不打印控制台日志，注意要在apiready后调用
    window.log = function () {
      if (api.debug) {
        return Function.prototype.bind.call(console.log, console);
      } else {
        return new Function();
      }
    }();
    //
    window.apicloud_rootPageInit = function () {
      // console.log("——————————启动后,只在root页执行一次,但不必强制在root引入该js " + api.winName + " : " + api.frameName);
      window.apicloud_isLaunched = true;
      //移除启动后判断是否第一次执行的所有标志位
      $api.rmStorage('firstByLaunchFlags');
      //移除图片缓存记录，注意不是移除缓存，只是移除记录，防止多页面同时调用imgCache，详见refreshImg方法
      $api.setStorage('apicloud_httpImg_pageMap', {});
    }

    window.apiclpud_execApiready = function () {
      //执行apiready
      apiready_base();
    }

    if (api.winName == "root" && !api.frameName) {
      log('winName:' + api.winName)
      apicloud_rootPageInit();
      apiclpud_execApiready();
    } else {
      //函数注入，将function注入root页中去执行
      api.execScript({
        name: "root",
        script: "setTimeout(function(){" +
          "if(!window.apicloud_isLaunched){" +
          "(" + apicloud_rootPageInit.toString() + ")();" +
          "}" +
          "}());"
      });
      api.execScript({
        name: api.winName,
        frameName: api.frameName,
        script: "apiclpud_execApiready()"
      });
    }

    if (api.systemType == 'ios') {
      FastClick.attach(document.body);
    }
  }

  var DEFAULT_IMG = "../image/default.png"
  var ERR_IMG = ""
  var imgCacheMap = {}; //图片网络地址对缓存地址的映射，{httpImgPath：cacheImgPath}

  if (window.Vue) {
    //Vue版本图片缓存策略
    var apicloud_assistVue = new Vue({
      data: function () {
        return {
          imgCacheMap: {}
        }
      }
    })
    // var apicloud_imgLoadingMap = {}; //相同的网络图片计数器，没获取一次相同的网络图片加一
    Vue.prototype.$api = {}
    Vue.prototype.DEFAULT_IMG2 = "../image/default2.jpg";
    Vue.prototype.$api.getCacheImg = function (httpImg, defaultImg, errImg) {
      defaultImg = defaultImg || DEFAULT_IMG
      if (!httpImg) { //传参有误，返回默认图片地址
        return defaultImg;
      } else if (httpImg) { //传入的是本地地址，直接返回
        httpImg = 'https://app-img.xunbaowang.net' + httpImg
        return httpImg;
      } else if (apicloud_assistVue.imgCacheMap[httpImg]) { //网络图片已经缓存，返回缓存地址
        if (apicloud_assistVue.imgCacheMap[httpImg] == "error") {
          return errImg || ERR_IMG || defaultImg;
        } else {
          return apicloud_assistVue.imgCacheMap[httpImg]
        }
      }
      // if (apicloud_imgLoadingMap[httpImg]) { //此图片正在缓存
      //   return defaultImg
      // }
      // var imgPageMap = $api.getStorage("apicloud_httpImg_pageMap") || {};
      // if (imgPageMap[httpImg]) { //有其他页面正在缓存这个图片，将当前页存入storage，当缓存图片完毕后，会通过该storage通知当前页面
      //   apicloud_imgLoadingMap[httpImg] = true;
      //   imgPageMap[httpImg].push({
      //     winName: api.winName,
      //     frameName: api.frameName
      //   })
      //   $api.setStorage('apicloud_httpImg_pageMap', imgPageMap);
      //   return defaultImg
      // } else {
      //   imgPageMap[httpImg] = [{
      //     winName: api.winName,
      //     frameName: api.frameName
      //   }]
      //   $api.setStorage('apicloud_httpImg_pageMap', imgPageMap);
      // }
      // apicloud_imgLoadingMap[httpImg] = true;
      api.imageCache({
        url: httpImg
      }, function (ret, err) {
        var cacheImg = ret.status ? ret.url : null;
        // var imgPageMap = $api.getStorage("apicloud_httpImg_pageMap");
        // for (var i = 0; i < imgPageMap[httpImg].length; i++) {
        //   var page = imgPageMap[httpImg][i]
        //   if (page.winName != api.winName || page.frameName != api.frameName) { //当前页无需通知，直接在下边设置
        //     api.execScript({
        //       name: page.winName,
        //       frameName: page.frameName,
        //       script: "apicloud_listenerImgCache(" + JSON.stringify({
        //           httpImg: httpImg,
        //           cacheImg: cacheImg
        //         }) + ")" //通知其他页面
        //     });
        //   }
        // }
        refreshImgByPath(httpImg, cacheImg);
        // delete imgPageMap[httpImg];
        // $api.setStorage('apicloud_httpImg_pageMap', imgPageMap);
      })
      return defaultImg;
    }
  }


  var refreshImgByPath = function (httpImg, cacheImg) {
    // apicloud_imgLoadingMap[httpImg] = false;
    if (window.Vue) {
      if (cacheImg) {
        Vue.set(apicloud_assistVue.imgCacheMap, httpImg, cacheImg);
      } else {
        Vue.set(apicloud_assistVue.imgCacheMap, httpImg, "error");
      }
    }
  }

  window.apicloud_listenerImgCache = function (refreshImgData) {
    refreshImgByPath(refreshImgData.httpImg, refreshImgData.cacheImg)
  }

  //查看文件
  context.showFileByDir = function (dirPath) {
    if (!dirPath) return
    try {
      var docInteraction = api.require('docInteraction');
      var fs = api.require('fs');
    } catch (e) {
      return
    }
    var dirRes = fs.readDirSync({
      path: dirPath
    });
    if (!dirRes.status || dirRes.data.length <= 0) {
      $api.toast("文件路径不存在: " + dirPath)
      return
    }
    var buttons = dirRes.data
    api.actionSheet({
      title: '选择文件',
      cancelTitle: '取消',
      buttons: buttons
    }, function (ret, err) {
      var index = ret.buttonIndex - 1;
      docInteraction.open({
        path: dirPath + "/" + dirRes.data[index]
      }, function (ret, err) {
        if (err) {
          api.toast({
            msg: '未知类型'
          });
        }
      });
    });
  }

  //当天第一次执行该标志位方法，当前第一次启动
  context.isFirstByDay = function (flag) {
    flag = flag || "";
    var dateStr = $api.getStorage("apicloud_" + flag + "_day");
    if (dateStr && dateStr == new Date().toDateString()) {
      return false
    } else {
      $api.setStorage("apicloud_" + flag + "_day", new Date().toDateString());
      return true
    }
  }

  //启动后第一次执行该标志位方法
  context.isFirstByLaunch = function (flag) {
    flag = flag || "";
    var firstByLaunchFlags = $api.getStorage("firstByLaunchFlags") || {};
    if (!firstByLaunchFlags[flag]) {
      firstByLaunchFlags[flag] = 1
      $api.setStorage('firstByLaunchFlags', firstByLaunchFlags);
      return true;
    }
    return false;
  }

  //发送事件
  context.send = function (flag, extra) {
    extra = extra || {}
    api.sendEvent({
      name: flag,
      extra: extra
    });
  }

  //监听事件
  context.listener = function (flag, callback) {
    api.addEventListener({
      name: flag
    }, function (ret, err) {
      callback(ret, err)
    });
  }

  //双击退出
  context.dblBackQuit = function (msg) {
    msg = msg || "再按一次退出应用";
    $api.listener("keyback", function (ret, err) {
      $api.toast(msg);
      $api.listener("keyback", function (ret, err) {
        api.closeWidget({
          silent: true
        });
      });
      setTimeout(function () {
        $api.dblBackQuit();
      }, 3000);
    });
  }

  //清除缓存
  context.clearCache = function (callback) {
    imgCacheMap = {}; //清空图片网络地址对缓存地址的映射
    $api.setStorage('apicloud_httpImg_pageMap', {}); //清空缓存图片的页面通知
    api.clearCache(function (ret, err) {
      if (callback) callback(ret, err);
    });
  }

  context.setRefreshHeaderInfo = function (callback) {
    api.setCustomRefreshHeaderInfo({
      bgColor: '#eee',
      image: {
        pull: 'widget://image/pull.png',
        transform: [
          'widget://image/up.png'
        ],
        load: [
          'widget://image/loading/01.png',
          'widget://image/loading/02.png',
          'widget://image/loading/03.png',
          'widget://image/loading/04.png',
          'widget://image/loading/05.png',
          'widget://image/loading/06.png',
          'widget://image/loading/07.png',
          'widget://image/loading/08.png',
          'widget://image/loading/09.png',
          'widget://image/loading/10.png',
        ]
      }
    }, function () {
      callback()
    })
  }

  //监听apiready的调用，调用apiready时会自动先执行此库中的apireadyExtend，后执行apiready
  Object.defineProperty(window, "apiready", {
    get: function () {
      return apireadyExtend;
    },
    set: function (value) {
      apiready_base = value;
    },
    enumerable: true, //可枚举
    configurable: true //apiready可删除，可修改属性的特性
  });

  //将秒转化为时分秒
  if (window.Vue) {
    Vue.prototype.$api.formatSeconds = function (result) {
      var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
      var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
      var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
      return result = h + ":" + m + ":" + s;
    }

  }


}(window.$api)

// fastclick
!function () {
  "use strict";
  function t(e, o) { var i; if (o = o || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = o.touchBoundary || 10, this.layer = e, this.tapDelay = o.tapDelay || 200, this.tapTimeout = o.tapTimeout || 700, !t.notNeeded(e)) { for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], a = 0, c = r.length; a < c; a++)this[r[a]] = s(this[r[a]], this); n && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function (t, n, o) { var i = Node.prototype.removeEventListener; "click" === t ? i.call(e, t, n.hijacked || n, o) : i.call(e, t, n, o) }, e.addEventListener = function (t, n, o) { var i = Node.prototype.addEventListener; "click" === t ? i.call(e, t, n.hijacked || (n.hijacked = function (t) { t.propagationStopped || n(t) }), o) : i.call(e, t, n, o) }), "function" == typeof e.onclick && (i = e.onclick, e.addEventListener("click", function (t) { i(t) }, !1), e.onclick = null) } function s(t, e) { return function () { return t.apply(e, arguments) } } } var e = navigator.userAgent.indexOf("Windows Phone") >= 0, n = navigator.userAgent.indexOf("Android") > 0 && !e, o = /iP(ad|hone|od)/.test(navigator.userAgent) && !e, i = o && /OS 4_\d(_\d)?/.test(navigator.userAgent), r = o && /OS [6-7]_\d/.test(navigator.userAgent), a = navigator.userAgent.indexOf("BB10") > 0; t.prototype.needsClick = function (t) { switch (t.nodeName.toLowerCase()) { case "button": case "select": case "textarea": if (t.disabled) return !0; break; case "input": if (o && "file" === t.type || t.disabled) return !0; break; case "label": case "iframe": case "video": return !0 }return /\bneedsclick\b/.test(t.className) }, t.prototype.needsFocus = function (t) { switch (t.nodeName.toLowerCase()) { case "textarea": return !0; case "select": return !n; case "input": switch (t.type) { case "button": case "checkbox": case "file": case "image": case "radio": case "submit": return !1 }return !t.disabled && !t.readOnly; default: return /\bneedsfocus\b/.test(t.className) } }, t.prototype.sendClick = function (t, e) { var n, o; document.activeElement && document.activeElement !== t && document.activeElement.blur(), o = e.changedTouches[0], (n = document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(t), !0, !0, window, 1, o.screenX, o.screenY, o.clientX, o.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, t.dispatchEvent(n) }, t.prototype.determineEventType = function (t) { return n && "select" === t.tagName.toLowerCase() ? "mousedown" : "click" }, t.prototype.focus = function (t) { var e; o && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type && "email" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e), t.focus()) : t.focus() }, t.prototype.updateScrollParent = function (t) { var e, n; if (!(e = t.fastClickScrollParent) || !e.contains(t)) { n = t; do { if (n.scrollHeight > n.offsetHeight) { e = n, t.fastClickScrollParent = n; break } n = n.parentElement } while (n) } e && (e.fastClickLastScrollTop = e.scrollTop) }, t.prototype.getTargetElementFromEventTarget = function (t) { return t.nodeType === Node.TEXT_NODE ? t.parentNode : t }, t.prototype.onTouchStart = function (t) { var e, n, r; if (t.targetTouches.length > 1) return !0; if (e = this.getTargetElementFromEventTarget(t.target), n = t.targetTouches[0], o) { if ((r = window.getSelection()).rangeCount && !r.isCollapsed) return !0; if (!i) { if (n.identifier && n.identifier === this.lastTouchIdentifier) return t.preventDefault(), !1; this.lastTouchIdentifier = n.identifier, this.updateScrollParent(e) } } return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = n.pageX, this.touchStartY = n.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0 }, t.prototype.touchHasMoved = function (t) { var e = t.changedTouches[0], n = this.touchBoundary; return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n }, t.prototype.onTouchMove = function (t) { return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0) }, t.prototype.findControl = function (t) { return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea") }, t.prototype.onTouchEnd = function (t) { var e, a, c, s, u, l = this.targetElement; if (!this.trackingClick) return !0; if (t.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0; if (t.timeStamp - this.trackingClickStart > this.tapTimeout) return !0; if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, a = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, r && (u = t.changedTouches[0], (l = document.elementFromPoint(u.pageX - window.pageXOffset, u.pageY - window.pageYOffset) || l).fastClickScrollParent = this.targetElement.fastClickScrollParent), "label" === (c = l.tagName.toLowerCase())) { if (e = this.findControl(l)) { if (this.focus(l), n) return !1; l = e } } else if (this.needsFocus(l)) return t.timeStamp - a > 100 || o && window.top !== window && "input" === c ? (this.targetElement = null, !1) : (this.focus(l), this.sendClick(l, t), o && "select" === c || (this.targetElement = null, t.preventDefault()), !1); return !(!o || i || !(s = l.fastClickScrollParent) || s.fastClickLastScrollTop === s.scrollTop) || (this.needsClick(l) || (t.preventDefault(), this.sendClick(l, t)), !1) }, t.prototype.onTouchCancel = function () { this.trackingClick = !1, this.targetElement = null }, t.prototype.onMouse = function (t) { return !this.targetElement || (!!t.forwardedTouchEvent || (!t.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1)))) }, t.prototype.onClick = function (t) { var e; return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail || ((e = this.onMouse(t)) || (this.targetElement = null), e) }, t.prototype.destroy = function () { var t = this.layer; n && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1) }, t.notNeeded = function (t) { var e, o, i; if (void 0 === window.ontouchstart) return !0; if (o = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) { if (!n) return !0; if (e = document.querySelector("meta[name=viewport]")) { if (-1 !== e.content.indexOf("user-scalable=no")) return !0; if (o > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0 } } if (a && (i = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1] >= 10 && i[2] >= 3 && (e = document.querySelector("meta[name=viewport]"))) { if (-1 !== e.content.indexOf("user-scalable=no")) return !0; if (document.documentElement.scrollWidth <= window.outerWidth) return !0 } return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction || (!!(+(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] >= 27 && (e = document.querySelector("meta[name=viewport]")) && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === t.style.touchAction || "manipulation" === t.style.touchAction)) }, t.attach = function (e, n) { return new t(e, n) }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () { return t }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach, module.exports.FastClick = t) : window.FastClick = t
}();
