(function (window) {
  var u = {};
  var isAndroid = (/android/gi).test(navigator.appVersion);
  var uzStorage = function () {
    var ls = window.localStorage;
    if (isAndroid) {
      ls = os.localStorage();
    }
    return ls;
  };
  u.setStorage = function (key, value) {
    if (arguments.length === 2) {
      var v = value;
      if (typeof v == 'object') {
        v = JSON.stringify(v);
        v = 'obj-' + v;
      } else {
        v = 'str-' + v;
      }
      var ls = uzStorage();
      if (ls) {
        ls.setItem(key, v);
      }
    }
  };
  u.getStorage = function (key) {
    var ls = uzStorage();
    if (ls) {
      var v = ls.getItem(key);
      if (!v) {
        return;
      }
      if (v.indexOf('obj-') === 0) {
        v = v.slice(4);
        return JSON.parse(v);
      } else if (v.indexOf('str-') === 0) {
        return v.slice(4);
      }
    }
  };
  u.rmStorage = function (key) {
    var ls = uzStorage();
    if (ls && key) {
      ls.removeItem(key);
    }
  };
  u.clearStorage = function () {
    var ls = uzStorage();
    if (ls) {
      ls.clear();
    }
  };
  u.isArray = function (obj) {
    if (Array.isArray) {
      return Array.isArray(obj);
    } else {
      return obj instanceof Array;
    }
  };
  u.isEmptyObject = function (obj) {
    // if (JSON.stringify(obj) === '{}') {
    for (var attr in obj) {
      return false;
    }
    return true;
  };
  u.append = function (el, html) {
    if (!u.isElement(el)) {
      console.warn('$api.append Function need el param, el param must be DOM Element');
      return;
    }
    el.insertAdjacentHTML('beforeend', html);
    return el;
  };
  u.html = function (el, html) {
    if (!u.isElement(el)) {
      console.warn('$api.html Function need el param, el param must be DOM Element');
      return;
    }
    if (arguments.length === 1) {
      return el.innerHTML;
    } else if (arguments.length === 2) {
      el.innerHTML = html;
      return el;
    }
  };
  u.setStatusBarStyle = function (style) {
    api.setStatusBarStyle({
      style: style,
      color: 'transparent'
    });
  };
  u.fixStatusBar = function (el) {
    if (!u.isDefine(el)) {
      el = document.querySelector("header");
    }
    if (!u.isElement(el)) {
      console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
      return 0;
    }
    el.style.height = el.offsetHeight + 'px';
    el.style.paddingTop = api.safeArea.top + 'px';
    return el.offsetHeight;
  };
  u.fixTabBar = function (el) {
    if (!u.isDefine(el)) {
      el = document.querySelector("footer");
    }
    if (!u.isElement(el)) {
      console.warn('$api.fixTabBar Function need el param, el param must be DOM Element');
      return 0;
    }
    el.style.height = el.offsetHeight + 'px';
    el.style.paddingBottom = api.safeArea.bottom + 'px';
    return el.offsetHeight;
  };

  u.remove = function (el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  };
  u.isElement = function (obj) {
    return !!(obj && obj.nodeType == 1);
  };
  u.offset = function (el) {
    if (!u.isElement(el)) {
      console.warn('$api.offset Function need el param, el param must be DOM Element');
      return;
    }
    var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

    var rect = el.getBoundingClientRect();
    return {
      l: rect.left + sl,
      t: rect.top + st,
      w: el.offsetWidth,
      h: el.offsetHeight
    };
  };
  u.openWin = function (name, params, slidBackEnabled) {
    console.log(name);
    if (!this.isJson(params)) {
      params = {};
    }
    api.openWin({
      name: name,
      url: 'widget://html/' + name + '.html',
      pageParam: params,
      slidBackEnabled: slidBackEnabled,
      slidBackType: 'edge',
      useWKWebView: false
    });
  };
  u.openFrame = function (params, safeAreaBottom, addTop) {
    // console.log(api.winName);

    if (!this.isJson(params)) {
      params = api.pageParam;
    }
    var header = document.querySelector("header");
    var header_h = 0;
    if (header) {
      header_h = $api.offset(header).h;
    }
    var body_h = api.winHeight;
    var rect_h = body_h - header_h;
    if (!$api.isDefine(safeAreaBottom)) {
      safeAreaBottom = 0;
    }
    if ($api.isDefine(addTop)) {
      addTop = -1
    } else {
      addTop = 0
    }
    api.openFrame({
      name: api.winName + '_frm',
      url: 'widget://html/' + api.winName + '_frm.html',
      rect: {
        marginTop: header_h + addTop,
        marginBottom: safeAreaBottom,
        w: 'auto'
      },
      pageParam: params,
      vScrollBarEnabled: false,
      useWKWebView: true,
      reload: true
    });
  };
  //判断是否json对象
  u.isJson = function (obj) {
    var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() ==
      "[object object]" && !obj.length;
    return isjson;
  };
  //判断变量是否定义
  u.isDefine = function (value) {
    if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value ==
      "(null)" || value == 'NULL' || typeof (value) == 'undefined') {
      return false;
    } else {
      value = value + "";
      value = value.replace(/\s/g, "");
      if (value == "") {
        return false;
      }
      return true;
    }
  };
  // 检测手机号
  u.testTel = function (val) {
    if (!(/^[1][2,3,4,5,6,7,8,9][0-9]{9}$/.test(val))) {
      $api.toast('请输入正确的手机号');
      return false;
    } else {
      return true;
    }
  }
  // 检测密码
  u.testPwd = function (val, text) {
    // if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,20}$/.test(val))) {
    if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)])+$)([^(0-9a-zA-Z)]|[a-zA-Z]|[0-9]){6,20}$/.test(val))) {
      if (text) {
        $api.toast(text);
      } else {
        $api.toast('请设置6-20位数字,字母密码');
      }
      return false;
    } else {
      return true;
    }
  }
  // 检测身份证号
  u.testCard = function (val) {
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val))) {
      $api.toast('身份证格式错误！');
      return false;
    } else {
      return true;
    }
  }
  u.toast = function (msg) {
    console.log(api.frameName);
    api.toast({
      msg: msg,
      duration: 1500,
      location: 'middle'
    });
  };
  //loading框
  u.showProgress = function (title, msg) {
    title = title ? title : '正在加载';
    msg = msg ? msg : '';
    api.showProgress({
      style: 'default',
      animationType: 'zoom',
      title: title,
      text: msg,
      modal: true
    });
  };

  u.get = function (url, data, callback, isNeedLogin) {
    api.ajax({
      headers: {
        'Authorization': 'Bearer token=' + $api.getStorage('token')
      },
      url: url,
      method: 'get',
      timeout: 60,
      dataType: 'json',
      data: {
        values: data
      }
    }, function (ret, err) {

      u.httpFn(ret, err, callback, isNeedLogin)
    });
  };

  u.post = function (url, data, callback, isNeedLogin) {
    api.ajax({
      headers: {
        'Authorization': 'Bearer token=' + $api.getStorage('token')
      },
      url: url,
      method: 'post',
      timeout: 60,
      dataType: 'json',
      data: {
        values: data
      }
    }, function (ret, err) {

      u.httpFn(ret, err, callback, isNeedLogin)
    });
  };

  u.postForm = function (url, data, callback, isNeedLogin) {
    api.ajax({
      headers: {
        'Authorization': 'Bearer token=' + $api.getStorage('token'),
        'Content-Type': 'application/json'
      },
      url: url,
      method: 'post',
      timeout: 60,
      dataType: 'json',
      data: {
        body: data
      }
    }, function (ret, err) {

      u.httpFn(ret, err, callback, isNeedLogin)
    });
  };

  u.postUpload = function (url, img, type, callback, isNeedLogin) {
    api.ajax({
      url: url,
      // encode:false,
      // returnAll:true,
      method: 'post',
      headers: {
        'Authorization': 'Bearer token=' + $api.getStorage('token')
      },
      // dataType:'text',
      // safeMode:'both',
      data: {
        values: {
          file_extension: type
        },
        files: {
          "file": img
        }
      }
    }, function (ret, err) {
      u.httpFn(ret, err, callback, isNeedLogin)
    });
  };

  u.delete = function (url, data, callback, isNeedLogin) {
    api.ajax({
      headers: {
        'Authorization': 'Bearer token=' + $api.getStorage('token')
      },
      url: url,
      method: 'delete',
      timeout: 60,
      dataType: 'json',
      data: {
        values: data
      }
    }, function (ret, err) {

      u.httpFn(ret, err, callback, isNeedLogin)
    });
  };

  u.httpFn = function (ret, err, callback, isNeedLogin) {
    if (ret) {
      var nointernet = document.querySelector("#nointernet");
      if (nointernet) {
        $api.remove(nointernet);
      }
      if (ret.error_code * 1 == 4002) {
        $api.logoutHandle('授权过期，请重新登录', isNeedLogin);
      } else if (ret.error_code * 1 == 4001) {
        $api.logoutHandle('授权错误，请重新登录', isNeedLogin);
      } else if (ret.error_code * 1 == 4003) {
        $api.logoutHandle('授权失效，请重新登录', isNeedLogin);
      } else if (ret.error_code * 1 == 1001) {
        console.log(JSON.stringify(ret))
        var errData = ret.error_fields;
        var msgArr = []
        for (var i in errData) {
          for (var a = 0; a < errData[i].length; a++) {
            msgArr.push(errData[i][a])
          }
        }
      //  u.toast(msgArr.join());

      } else {

        callback(ret)
      }
    } else {
      api.hideProgress();
      if (err.statusCode == 0) {

        console.log(err.statusCode);
        var connectionType = api.connectionType;
        if (connectionType == 'none' || connectionType == 'unknown') {
          console.log(connectionType);
          var nointernet = document.querySelector("#nointernet");
          if (!nointernet) {
            var code = '<div id="nointernet" class="">\
                          <div class="icon">\
                            <img src="../image/404.png" alt="">\
                            <p class="fz28">网络连接失败</p>\
                            <div class="refresh active-color fz30" tapmode onclick="$api.refresh()">点击重试</div>\
                          </div>\
                        </div>';
            $api.append(document.querySelector("body"), code);
          }
        } else {
          $api.toast(err.msg);
        }

      }
    }
  };

  u.logoutHandle = function (msg, isNeedLogin) {
    console.log(isNeedLogin)
    if (isNeedLogin === 0) {

    } else {
      u.toast(msg);
      setTimeout(function () {
        // $api.clearStorage('token');
        $api.openWin('login_frm', {
          name: api.winName,
          name_frm: api.frameName,
        })
        // api.closeToWin({
        //   name: 'login_frm'
        // });
        // $api.clearStorage('token');
        // $api.clearStorage($storage.TOKEN);
        // $api.send($eventType.LOGOUTSUCCESS);
      }, 1000)
    }

  };

  u.addCls = function (el, cls) {
    if (!u.isElement(el)) {
      console.warn('$api.addCls Function need el param, el param must be DOM Element');
      return;
    }
    if ('classList' in el) {
      el.classList.add(cls);
    } else {
      var preCls = el.className;
      var newCls = preCls + ' ' + cls;
      el.className = newCls;
    }
    return el;
  };
  u.removeCls = function (el, cls) {
    if (!u.isElement(el)) {
      console.warn('$api.removeCls Function need el param, el param must be DOM Element');
      return;
    }
    if ('classList' in el) {
      el.classList.remove(cls);
    } else {
      var preCls = el.className;
      var newCls = preCls.replace(cls, '');
      el.className = newCls;
    }
    return el;
  };
  u.byId = function (id) {
    return document.getElementById(id);
  };

  u.getConnectionType = function () {
    if (api.connectionType == 'none' || api.connectionType == 'unknown') {

    } else {
      var nointernet = document.querySelector("#nointernet");
      if (nointernet) {
        $api.remove(nointernet);
      }
    }
  };

  u.hidePhoneNumber = function (tel) {
    var mtel = tel.substr(0, 3) + '****' + tel.substr(7);
    return mtel;
  };
  u.formatTime = function (value, type) {
    if (value && value.toString().indexOf('-') == -1) {
      var dataTime = "";
      var data = new Date();
      data.setTime(value);
      var year = data.getFullYear();
      var month = data.getMonth() + 1 >= 10 ? data.getMonth() + 1 : '0' + (data.getMonth() + 1);
      var day = data.getDate() >= 10 ? data.getDate() : '0' + data.getDate();
      var hour = data.getHours() >= 10 ? data.getHours() : '0' + data.getHours();
      var minute = data.getMinutes() >= 10 ? data.getMinutes() : '0' + data.getMinutes();
      var second = data.getSeconds() >= 10 ? data.getSeconds() : '0' + data.getSeconds();
      if (type == "YMD") {
        dataTime = year + "-" + month + "-" + day;
      } else if (type == "YMDHMS") {
        dataTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
      } else if (type == "YMDHM") {
        dataTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      } else if (type == "HMS") {
        dataTime = hour + ":" + minute + ":" + second;
      } else if (type == "YM") {
        dataTime = year + "-" + month;

      }
      return dataTime; //将格式化后的字符串输出到前端显示
    } else {
      return value;
    }
  };

  u.refresh = function () {
    window.location.reload(true);
  };

  u.unopened = function () {
    u.toast('暂未开放');
  };

  u.lisViewappear = function (style) {
    api.addEventListener({
      name: 'viewappear'
    }, function (ret, err) {
      $api.setStatusBarStyle(style)
    });
  };
  // 适配iPhone X底部
  u.addSafeBottom = function () {
    var el = document.querySelector('.add-safe-bottom');
    if (el) {
      $(".add-safe-bottom").css('paddingBottom', api.safeArea.bottom + 'px')
    } else {
      console.log('add-safe-bottom class不存在，请添加');
    }
  };

  // 检测应用是否有某个或多个权限
  u.hasPermission = function (perm) {
    // console.log(perm);
    var resultList = api.hasPermission({
      list: [perm]
    });
    // console.log(JSON.stringify(resultList));
    if (resultList[0].granted) {
      return 1; // 有权限
    } else {
      if ((api.systemType == 'android' && $api.getStorage('stop' + perm)) || (api.systemType == 'ios' && !
          resultList[0].undetermined)) {
        return 3; // 拒绝，跳转设置页面
      } else {
        return 2; // 可以请求权限
      }
    }
  }

  // 向系统请求某个或多个权限
  u.requestPermission = function (perm, callback) {
    api.requestPermission({
      list: [perm],
      code: 1
    }, function (res, err) {
      console.log(JSON.stringify(res));
      if (res.list[0].granted) {
        callback && callback(true);
      } else {
        if (api.systemType == 'android' && res.never) {
          $api.setStorage('stop' + perm, '1');
        }
        callback && callback(false);
      }
    });
  }

  u.confirm = function (title, msg, buttons, callback) {
    api.confirm({
      title: title,
      msg: msg,
      buttons: buttons
    }, function (ret, err) {
      callback && callback(ret.buttonIndex);
    });
  }


  u.confirmPer = function (perm, callback) {
    var has = $api.hasPermission1(perm);
    console.log(JSON.stringify(has));
    if (!has || !has[0] || !has[0].granted) {
      $api.reqPermission(perm, callback);
      if (!callback) {
        return false;
      }
    }
    if (callback) {
      callback(true);
    } else {
      return true;
    }
  }

  u.hasPermission1 = function (perm) {
    var perms = new Array();
    perms.push(perm);
    var rets = api.hasPermission({
      list: perms
    });
    return rets;
  }

  u.reqPermission = function (perm, callback) {
    api.requestPermission({
      list: [perm],
      code: 1
    }, function (res, err) {
      // console.log(JSON.stringify(res));
      if (res.list[0].granted) {
        callback && callback(true);
      } else {
        if (api.systemType == 'android' && res.never) {
          $api.setStorage('stop' + perm, '1');
        }
        callback && callback(false);
      }
    });
  }

  u.premConfirm = function (perm, callback) {
    $api.confirm($api.paramsName[perm] + '服务未开启', '请在设置中开启服务', ['暂不', '去开启'], function (index) {
      callback && callback(index)
    })
  }

  u.UIActionSelector = function (data, col, title, callback) {
    var UIActionSelector = api.require('UIActionSelector');
    UIActionSelector.open({
      datas: data,
      layout: {
        row: 5,
        col: col,
        height: 32,
        size: 18,
        sizeActive: 20,
        rowSpacing: 8,
        colSpacing: 10,
        maskBg: 'rgba(0,0,0,0.2)',
        bg: '#fff',
        color: '#999',
        colorActive: '#333',
        colorSelected: '#333'
      },
      animation: true,
      cancel: {
        text: '取消',
        size: 17,
        w: 55,
        h: 35,
        bg: '#fff',
        bgActive: '#fff',
        color: '#666',
        colorActive: '#666'
      },
      ok: {
        text: '确定',
        size: 17,
        w: 55,
        h: 35,
        bg: '#fff',
        bgActive: '#fff',
        color: '#EB5048',
        colorActive: '#EB5048'
      },
      title: {
        text: title,
        size: 17,
        bg: '#fff',
        color: '#000000',
      },
      lineColor: "#dddddd"
    }, function (ret, err) {
      if (ret) {
        // console.log(JSON.stringify(ret));
        if (ret.eventType == 'ok') {
          callback(ret);
        }
      } else {
        // alert(JSON.stringify(err));
      }
    });
  }

  // 时间选择器
  u.UIDatePicker = function (type, title, callback) {
    var UIDatePicker = api.require('UIDatePicker');
    UIDatePicker.open({
      type: type,
      rowHeight: 40,
      title: title,
      styles: {
        bg: 'rgba(0,0,0,0)',
        headerViewBackgroundColor: 'rgba(0,0,0,0)',
        lineBackgroundColor: 'rgba(0,0,0,.4)',
        item: {
          normal: 'rgba(0,0,0,0.8)',
          normalFont: 15,
          selected: '#000',
          selectedFont: 17,
          cancelBtn: {
            cancelButtonTextColor: '#999999',
            cancelButtonText: '取消',
            cancelButtonFont: 17
          },
          confirmBtn: {
            confirmButtonTextColor: '#F46A0C',
            confirmButtonText: '完成',
            confirmButtonFont: 17
          },
        }
      },
    }, function (ret, err) {
      if (ret.eventType == 'submit') {
        callback(ret);
        var hour = String(ret.hour);
        var minute = String(ret.minute);
        if ($api.isDefine(hour)) {
          if (hour.length == 1) {
            hour = '0' + hour;
          }
        } else {
          hour = '00';
        }
        if ($api.isDefine(minute)) {
          if (minute.length == 1) {
            minute = '0' + minute;
          }
        } else {
          minute = '00';
        }
      } else {
        // alert(JSON.stringify(err));
      }
    });
  }

  // 判断app退到后台是否超过一定的时间
  u.pauseAndResumeToRefresh = function (callback, time) {
    time = time ? time * 1000 : 300000;
    api.addEventListener({
      name: 'pause'
    }, function (ret, err) {
      api.setPrefs({
        key: 'pauseTime',
        value: new Date().getTime()
      });
    });

    api.addEventListener({
      name: 'resume'
    }, function (ret, err) {
      var pauseTime = api.getPrefs({
        sync: true,
        key: 'pauseTime'
      });
      var resumeTime = new Date().getTime();
      if (resumeTime - pauseTime > time) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  u.focusAndKeyboard = function (el) {
    setTimeout(function () {
      // document.querySelector(el).focus();
      document.getElementById('search').focus()
    }, 1000)
  }

  u.toFixed2 = function (num) {
    num = num.toString();
    if (num == '0.00') {
      return 0;
    }
    num = num.replace(/[^\d.]/g, "");
    num = num.replace(/^\./g, "");
    num = num.replace(/\.{2,}/g, "");
    num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (num.length >= 2) {
      if (num.indexOf('.') == -1) {
        num = parseInt(num)
      }
    }
    return num;
  }

  u.toFixed1 = function (num) {
    num = num.toString();
    if (num == '0.0') {
      return 0;
    }
    num = num.replace(/[^\d.]/g, "");
    num = num.replace(/^\./g, "");
    num = num.replace(/\.{2,}/g, "");
    num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    num = num.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');
    if (num.length >= 2) {
      if (num.indexOf('.') == -1) {
        num = parseInt(num)
      }
    }
    return num;
  }

  u.toFixed0 = function (num) {
    num = num.replace(/[^\d]/g, "");
    return num;
  }

  // 拨打电话
  u.callPhone = function (tel, type) {
    if (type == 1) {
      api.call({
        type: 'tel',
        number: tel
      });
    } else {
      if (api.systemType == 'ios') {
        api.call({
          type: 'tel_prompt',
          number: tel
        });
      } else {
        $api.confirm('', tel, ['取消', '呼叫'], function (index) {
          if (index == 2) {
            api.call({
              type: 'tel',
              number: tel
            });
          }
        })
      }
    }
  }

  u.wechatPay = function (data, callback) {
    var stringA = "appid=" + data.appid + "&noncestr=" + data.nonce_str + "&package=Sign=WXPay&partnerid=" + data.mch_id + "&prepayid=" + data.prepay_id + "&timestamp=" + data.timeStamp;
    var stringSignTemp = stringA + "&key=" + data.key;
    var sign = $.md5(stringSignTemp).toUpperCase();
    var wxPay = api.require('wxPay');
    wxPay.payOrder({
      apiKey: data.appid,
      orderId: data.prepay_id,
      mchId: data.mch_id,
      nonceStr: data.nonce_str,
      timeStamp: data.timeStamp,
      package: 'Sign=WXPay',
      sign: sign
    }, function (ret, err) {
      callback(ret);
    })
  }

  u.aliPay = function (data, callback) {
    var aliPayPlus = api.require('aliPayPlus');
    aliPayPlus.payOrder({
      orderInfo: data
    }, function (ret, err) {
      callback(ret);
    });
  }

  u.isFirstOpen = function () {
    var isFirst = api.getPrefs({
      sync: true,
      key: 'firstOpen'
    });
    if ($api.isDefine(isFirst)) {
      return false;
    } else {
      return true;
    }
  }

  u.decrypt = function (val) {
    var aseKey = api.loadSecureValue({
      sync: true,
      key: 'aseKey'
    });
    var decrypt = CryptoJS.DES.decrypt(val, CryptoJS.enc.Utf8.parse(aseKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    return decrypt;
  }

  // 数字转中文
  u.numToChinese = function (section) {
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
    var chnUnitChar = ["", "十", "百", "千"];
    var strIns = '',
      chnStr = '';
    var unitPos = 0;
    var zero = true;
    while (section > 0) {
      var v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  }

  u.getQueryString = function (key, url) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var index = url.indexOf("?") + 1;
    var result = url.substr(index).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
  };

  // 批量上传图片
  var UIAlbumBrowser_imgs = 0,
    UIAlbumBrowser_imgList = [],
    UIAlbumBrowser_imgIndex = 0;
  u.openUIAlbumBrowser = function (num, filetypes, callback) {
    var UIAlbumBrowser = api.require('UIAlbumBrowser');
    UIAlbumBrowser.open({
      type: 'image',
      max: num,
      styles: {
        bg: '#fff',
        mark: {
          icon: '',
          position: 'top_right',
          size: 20
        },
        nav: {
          bg: 'rgba(0,0,0,0.6)',
          titleColor: '#fff',
          titleSize: 18,
          cancelColor: '#fff',
          cancelSize: 16,
          finishColor: '#fff',
          finishSize: 16
        }
      }
    }, function (ret, err) {
      if (ret) {
        if (ret.eventType == 'confirm') {
          UIAlbumBrowser_imgs = ret.list.length;
          UIAlbumBrowser_imgList = ret.list;
          UIAlbumBrowser_imgIndex = 0;
          api.showProgress({
            title: '上传第1张',
            text: '共有' + UIAlbumBrowser_imgs + '张',
          });
          if (api.systemType == 'ios') {
            that.UIAlbumBrowser_compress = function (index) {
              UIAlbumBrowser.transPath({
                path: UIAlbumBrowser_imgList[index].path
              }, function (ret, err) {
                // console.log(JSON.stringify(ret));
                if (ret) {
                  u.compress(ret.path, filetypes, callback);
                } else {
                  //alert(JSON.stringify(err));
                }
              });
            }
            that.UIAlbumBrowser_compress(UIAlbumBrowser_imgIndex);
          } else {
            that.UIAlbumBrowser_compress = function (index) {
              u.compress(UIAlbumBrowser_imgList[index].path, filetypes, callback);
            }
            that.UIAlbumBrowser_compress(UIAlbumBrowser_imgIndex);
            // for (var i = 0; i < ret.list.length; ++i) {}
          }
        }
      }
    });
  }

  u.compress = function (path, filetypes, callback) {
    var Caches = api.cacheDir;
    //console.log(Caches);
    var imageFilter = api.require('imageFilter');
    imageFilter.getAttr({
      path: path
    }, function (ret, err) {
      if (ret.status) {
        // console.log(JSON.stringify(ret));
        var scale = 1;
        if (ret.width > 1000) {
          scale = 1000 / ret.width;
        }
        var name = new Date().getTime() + ".jpg";
        imageFilter.compress({
          img: path,
          quality: 1,
          scale: scale,
          save: {
            album: false,
            imgPath: Caches,
            imgName: "1234567.jpg",
          }
        }, function (ret, err) {
          //alert(JSON.stringify(ret));
          if (ret.status) {
            //alert(JSON.stringify(ret));
            u.uploadImg(Caches + "/1234567.jpg", filetypes, callback)
          } else {
            alert(JSON.stringify(err) + "图片压缩失败，请联系客服");
            api.hideProgress();
          }
        });
      } else {
        alert(JSON.stringify(err) + "获取图片信息失败，请联系客服");
        api.hideProgress();
      }
    });
  }

  u.getPageFz = function (size) {
    var fz = $('html').css('fontSize').replace('px', '');
    return fz / 75 * size;
  }

  u.uploadImg = function (path, filetypes, callback) {
    api.ajax({
      url: $config.uploadFile,
      method: 'post',
      data: {
        values: {
          token: $api.getStorage($storage.TOKEN),
          filetypes: filetypes
        },
        files: {
          file: path
        }
      }
    }, function (res, err) {
      if (res.status == 1) {
        callback(res.img_url);
      } else {
        $api.toast(res.msg);
      }
      if (++UIAlbumBrowser_imgIndex < UIAlbumBrowser_imgs) {
        api.showProgress({
          title: '上传第' + (UIAlbumBrowser_imgIndex + 1) + '张',
          text: '共有' + UIAlbumBrowser_imgs + '张',
        });
        that.UIAlbumBrowser_compress(UIAlbumBrowser_imgIndex);
      } else {
        api.hideProgress();
      }
    });
  }

  u.openUIInput = function (el, styles, placeholder, keyboardType, callback) {
    var search = document.querySelector(el);
    var rect = {
      x: $api.offset(search).l,
      y: $api.offset(search).t,
      w: $api.offset(search).w,
      h: $api.offset(search).h
    }
    var UIInput = api.require('UIInput');
    UIInput.open({
      rect: rect,
      styles: styles,
      placeholder: placeholder,
      keyboardType: keyboardType,
    }, function (ret) {
      callback(ret, UIInput);
    });
  }


  //分享
  u.share = function (title, description, url, data, thumbnail) {

    var thumbnail = thumbnail ? thumbnail : 'widget://./image/wx-share-img2.png';
    var link = url;
    if (data) {
      if (data.id) {
        link = link + data.id
      }
      if (data.params) {
        var result = [];
        for (var key in data.params) {
          var value = data.params[key];
          result.push(key + '=' + value);
        }
        link = link + '?' + result.join('&')
      }
    }
    var colSpacing_px = api.systemType === 'ios' ? 20 : 10;
    var MNActionButton = api.require('MNActionButton');
    MNActionButton.open({
      layout: {
        row: 1,
        col: 5,
        rowSpacing: 25,
        colSpacing: colSpacing_px,
        offset: 0
      },
      animation: true,
      autoHide: true,
      styles: {
        maskBg: 'rgba(0,0,0,0.2)',
        bg: '#f4f4f4',
        cancelButton: {
          size: 22,
          bg: '#f4f4f4',
          icon: 'widget://res/action-button-cancel.png',
          text: "取消"
        },
        item: {
          titleColor: '#888',
          titleHighlight: 'dd2727',
          titleSize: 10
        },
        indicator: {
          color: '#c4c4c4',
          highlight: '#9e9e9e'
        }
      },
      items: [{ //JSON 对象类型；一个菜单项的设置信息
        icon: '../image/share_wx.png', //（可选项）字符串类型；一个菜单按钮的图标，支持 rgb，rgba，#，img；默认：#fff
        title: '微信' //字符串类型；菜单按钮的文字；默认：未设置时不显示，但文字栏仍按 titleSize 设置显示高度
      }, {
        icon: '../image/share_wxTimeline.png',
        title: '朋友圈'
      }, {
        icon: '../image/share_qq.png',
        title: 'QQ'
      }, {
        icon: '../image/share_weibo.png',
        title: '微博'
      }, {
        icon: '../image/share_link.png',
        title: '分享链接'
      }]
    }, function (ret) {
      if (ret) {
        console.log(JSON.stringify(ret));
        if (ret.index == 0 || ret.index == 1) {
          u.wx_share(ret.index, title, description, link, thumbnail)
        } else if (ret.index == 4) {
          u.shareLink(link)
        } else if (ret.index == 2 || ret.index == 3) {
          $api.toast("系统升级中，敬请期待")
        }
      }
    });
  }
  u.wx_share = function (ret_index, title, description, link, thumbnail) {
    // console.log(title)
    // console.log(description)
    // console.log(link)
    // console.log(thumbnail)
    var wx = api.require('wx');
    wx.shareWebpage({
      apiKey: 'wx83630bbc51183521',
      scene: ret_index == 0 ? "session" : "timeline", //timeline 朋友圈 session 会话
      title: title,
      description: description,
      thumb: thumbnail,
      contentUrl: link
    }, function (ret, err) {
      console.log(JSON.stringify(ret));
      console.log(JSON.stringify(err));
      if (ret.status) {
        alert('分享成功');
      } else {
        alert('分享失败');
      }
    });
  }
  u.shareLink = function (link) {
    var clipBoard = api.require('clipBoard');
    clipBoard.set({
      value: link
    }, function (ret, err) {
      if (ret) {
        // console.log(JSON.stringify(ret));
        if (ret.status == true) {
          $api.toast("复制成功")
        }
      } else {
        alert(JSON.stringify(err));
      }
    });
  }

  //新闻头条滚动
  u.slideUp = function () {
    var docthis = this;
    //向上滑动动画
    function autoani() {
      $(".dynamic-ul li:first").animate({
        "margin-top": "-25px"
      }, 1000, function () {
        $(this).css("margin-top", 0).appendTo(".dynamic-ul");
      })
    }
    //自动间隔时间向上滑动
    setInterval(autoani, 2000);
  }

  // 新首页头条滚动
  u.homeSlideUp = function (newsItemHeight) {
    var docthis = this;
    var height = "-" + newsItemHeight + "px"
    console.log(height)
    //向上滑动动画
    function autoani() {
      $(".dynamic-ul li:first").animate({
        "margin-top": height
      }, 1000, function () {
        $(this).css("margin-top", 0).appendTo(".dynamic-ul");
      })
      // setTimeout(autoani,2000);
    }
    //自动间隔时间向上滑动
    setInterval(autoani, 2000);
  }

  //----透明的头部
  u.openTransparentFrame = function (params, safeAreaBottom, addTop) {
    // console.log(api.winName);
    if (!this.isJson(params)) {
      params = api.pageParam;
    }

    if (!$api.isDefine(safeAreaBottom)) {
      safeAreaBottom = 0;
    }
    api.openFrame({
      name: api.winName + '_frm',
      url: 'widget://html/' + api.winName + '_frm.html',
      rect: {
        x: 0,
        y: 0,
        marginTop: 0,
        marginBottom: safeAreaBottom,
        w: 'auto',
      },
      bgColor: '#FFFFFF',
      pageParam: params,
      vScrollBarEnabled: false,
      useWKWebView: true,
      reload: true
    });
  };
  //设置透明头部高度
  u.fixTransparenStatusBar = function (el) {

    // if (!u.isDefine(el)) {
    // el = document.querySelector("header");
    // }
    // if (!u.isElement(el)) {
    //   console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
    //   return 0;
    // }
    // el.style.height = el.offsetHeight+api.safeArea.top + 'px';
    // el.style.paddingTop = api.safeArea.top + 'px';
    var el1 = document.getElementById('header1');
    var el2 = document.getElementById('header2');
    el1.style.height = el1.offsetHeight + api.safeArea.top + 'px';
    el1.style.paddingTop = api.safeArea.top + 'px';
    if (el2) {
      el2.style.height = el2.offsetHeight + api.safeArea.top + 'px';
      el2.style.paddingTop = api.safeArea.top + 'px';
    }


    // return el.offsetHeight;
  };
  //iosX 距离底部 不被遮挡
  u.iosXbottom = function (name) {
    var lastEl = document.getElementsByClassName(name)[0];
    lastEl.style.paddingBottom = api.safeArea.bottom + 'px'
  }
  u.deepClone = function (obj) {
      var _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
      return objClone;
    },
    u.toThousands = function (num) { //隔符，例如2000转换为2,000
      return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    u.getCurrentTime = function () {
      var time = new Date();
      var n = time.getFullYear();
      var y = time.getMonth() + 1 > 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1);
      var r = time.getDate() > 10 ? time.getDate() : '0' + time.getDate();
      return n + '-' + y + '-' + r;
    }

  u.hasPermission = function (one_per) {
    var perms = new Array();
    if (one_per) {
      perms.push(one_per);
    }
    var rets = api.hasPermission({
      list: perms
    });
    if (!one_per) {
      //    apialert('判断结果：' + JSON.stringify(rets));
      return;
    }
    return rets;
  }
  u.confirmPer = function (perm) {
    var has = u.hasPermission(perm);
    if (!has || !has[0] || !has[0].granted) {
      api.confirm({
        title: '提醒',
        msg: '没有获得 ' + perm + " 权限\n是否前往设置？",
        buttons: ['去设置', '取消']
      }, function (ret, err) {});
      return false;
    }
    return true;
  }
  // 点击操作

  window.$api = u;

})(window);
