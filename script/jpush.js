var $jpush = {
  initJpush: function() {
    //console.log(1111)
    var ajpush = api.require('ajpush');
    if (api.systemType == 'ios') {
      // $jpush.listenerMsgClicked();
    } else {
      $jpush.loadJpush();
    }
    // $jpush.setListenerMsg();
    $jpush.postRegId();
  },
  loadJpush: function() {
    var ajpush = api.require('ajpush');
    ajpush.init(function(ret) {
      // $jpush.listenerMsg();
    });
  },
  listenerMsg: function() {
    api.addEventListener({
      name: 'appintent'
    }, function(ret, err) {
      $jpush.setBadge(0);
    })
  },

  listenerMsgClicked: function() {
    api.addEventListener({
      name: 'noticeclicked'
    }, function(ret, err) {
      $jpush.setBadge(0);
    })
  },

  setListenerMsg: function() {
    var ajpush = api.require('ajpush');
    ajpush.setListener(function(ret) {

    });
  },

  clearNotice: function() {
    var ajpush = api.require('ajpush');
    var param = {
      id: -1
    };
    ajpush.clearNotification(param, function(ret) {
      if (ret && ret.status) {}
    });
  },

  setBadge: function(num) {
    if (num <= 0) {
      num = 0;
    }
    api.setAppIconBadge({
      badge: num
    });
    var ajpush = api.require('ajpush');
    ajpush.setBadge({
      badge: num
    });
  },

  setAlias: function(id) { //绑定别名
    var param = {
      alias: id,
      tags: ['tag_' + id, 'ib1ack']
    };
    var ajpush = api.require('ajpush');
    ajpush.bindAliasAndTags(param, function(ret) {
      var statusCode = ret.statusCode;
      if (statusCode == '6002') {
        $jpush.setAlias();
      }
    });
  },
  //统一的消息结构
  UniStructure: function(ret) {
    var push_id = ret.id;
    var extra;
    if (api.systemType == 'ios') {
      if (ret.value.extra) {
        extra = ret.value.extra;
      } else if (ret.value.extras) {
        extra = ret.value.extras;
      }
    } else {
      if (!$api.isJson(ret.appParam.ajpush.extra)) {
        extra = JSON.stringify(ret.appParam.ajpush.extra);
      } else {
        extra = ret.appParam.ajpush.extra;
      }
    }
    return extra;
  },
  //post极光推送id
  postRegId: function() {
    var ajpush = api.require('ajpush');
    ajpush.getRegistrationId(function(ret) {
      $api.setStorage($storage.REGISTRATIONID, ret.id);
      var registrationId = $api.getStorage($storage.REGISTRATIONID);
      console.log(api.systemType + '-----' + registrationId);
      if (!registrationId) {
        setTimeout(function() {
          $jpush.postRegId();
        }, 2000)
      }
    });
  }

};
