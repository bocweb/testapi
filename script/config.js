var serverip = 'http://shuyueyun.cn/admin/';
var $config = {
  // 登陆页
    login:serverip+'login/phone',//登陆
    Verificationn:serverip+"login/checkcode",//获取验证码


    // 首页
    homelun:serverip+"index/getbanner",//轮播图
    Editor:serverip+"index/getbook",//主编推荐
    shujia:serverip+"shujia/index",//书架
    apple:serverip+"pay/applePay",
    appleid:serverip+"pay/appleOrder",

    // 分类
    buzhid1:serverip+"book/getAppleContent",
    buzhid2:serverip+"book/getAppleNext",
    buzhid3:serverip+"book/getApplePrev",



    list:serverip+"index/getcategory",//分类
    details:serverip+"book/bookdetail",//详情页
    Reward:serverip+"book/gettips",//打赏记录
    xiangqi:serverip+"book/readbook",//
    dashang:serverip+"book/gettipslist",//
    addashanglis:serverip+"book/addtips",//
    revashanglis:serverip+"book/getprev",//
    revashanglisw:serverip+"book/getnext",//
    qiand:serverip+"user/addcore",//签到
    youke:serverip+"login/appVerify",//youke

    //登录
    weixlogin:serverip+"logins/wxcallback",
    qqlogins:serverip+"ouath/getuserinfo",
    qqbans:serverip+"ouath/bindqq",

    //支付
    zhifub:serverip+"pay/alipay",
    weix:serverip+"pay/wechatpay",
    weixs:serverip+"pay/wechatpays",
    shangc:serverip+"user/uploadphoto",
    // 记录
    jilu:serverip+"user/paylog",//充值
    xiaof:serverip+"user/consumelog",//消费

    //个人
    gerenxinxss:serverip+"user/getuserinfo",//
    data:serverip+"user/profile",//个人资料展示
    chuan:serverip+"user/uploadpic",//个人资料展示
    xiug:serverip+"user/updateprofile",//个人资料展示
    weuxb:serverip+"logins/wxcallback",//个人资料展示
    bangd:serverip+"logins/bindwx",
    phoneban:serverip+"logins/bindphone",


    zhifufangs:serverip+"pay/getgoods",
    yuedu:serverip+"book/readhistory",
    jiarushuj:serverip+"shujia/addshujia",
    jiarushujs:serverip+"book/getchapter",
    jiarushujq:serverip+"shujia/deletesjs",

    qiandzhuangt:serverip+"user/corelog"
};
// var $shareConfig = {
//   // 分享相关
//   wx_title: "寻宝网", //分的标题
//   wx_description: "寻宝网，基于互联网移动平台的古董古玩交易、互动类综合电商平台，专注于古玩古董的线上拍卖和交易。", //分享描述
//   wx_thumb: "widget://./image/wx-share-img2.png", //分享的图片，要求.png格式
//   wx_contentUrl: "https://m.xunbaowang.net/downloadApp", //分享的路径
// }
