var express = require("express");
var router = express.Router();
require("./../util/util");
var Users = require("./../models/users");

//登录
router.post("/login", function (req, res) {
    var param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd,
    };

    Users.findOne(param, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            if (doc) {
                res.cookie("userId", doc.userId, {
                    path: "/",
                    maxAge: 1000 * 60 * 60
                });
                res.cookie("userName", doc.userName, {
                    path: "/",
                    maxAge: 1000 * 60 * 60
                });
                res.json({
                    status: "0",
                    msg: "",
                    result: {
                        userName: doc.userName
                    }
                })
            } else {
                res.json({
                    status: "-1",
                    msg: ""
                })
            }
        }
    })
});

//退出
router.post("/logout", function (req, res) {
    res.cookie("userId", "", {
        path: "/",
        maxAge: -1
    });
    res.cookie("userName", "", {
        path: "/",
        maxAge: -1
    });

    res.json({
        status: "0",
        msg: "",
        result: ""
    })
});

//拦截是否登录
router.get("/checkLogin", function (req, res) {
    if (req.cookies.userId) {
        res.json({
            status: "0",
            msg: "",
            result: req.cookies.userName || ""
        })
    } else {
        res.json({
            status: "1",
            msg: "未登录",
            result: ""
        })
    }
});

//获取购物车列表
router.get("/CarList", function (req, res) {
    var userId = req.cookies.userId;

    Users.findOne({userId: userId}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            if (doc) {
                res.json({
                    status: "0",
                    msg: "",
                    result: doc.cartList
                })
            }
        }
    })
});

//删除购物车
router.post("/cartDel", function (req, res) {
    var userId = req.cookies.userId;
    var productId = req.body.productId;


    Users.update({userId: userId}, {$pull: {'cartList': {'productId': productId}}}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            res.json({
                status: "0",
                msg: "",
                result: ""
            })
        }
    })
});

//编辑数量，状态
router.post("/cartEdit", function (req, res) {
    var userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum,
        checked = req.body.checked;

    Users.update({userId: userId, "cartList.productId": productId}, {
        "cartList.$.productNum": productNum,
        "cartList.$.checked": checked,
    }, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            res.json({
                status: "0",
                msg: "",
                result: "suc"
            })
        }
    })
});

//购物车全选和计数
router.post("/editCheckAll", function (req, res) {
    var userId = req.cookies.userId;
    var checkedAll = req.body.checkedAll ? "1" : "0";

    Users.findOne({userId: userId}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            if (doc) {
                doc.cartList.forEach(item => {
                    item.checked = checkedAll
                });
                doc.save(function (err1, doc) {
                    if (err1) {
                        res.json({
                            status: "1",
                            msg: err.message,
                            result: ""
                        })
                    } else {
                        res.json({
                            status: "0",
                            msg: "",
                            result: ""
                        })
                    }
                })
            }
        }
    })
});


//获取地址信息
router.get("/addressList", function (req, res) {
    var userId = req.cookies.userId;

    Users.findOne({userId: userId}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            res.json({
                status: "0",
                msg: "",
                result: doc.addressList
            })
        }
    })
})


//设置默认地址
router.post("/setDefault", function (req, res) {
    var userId = req.cookies.userId;
    var addressId = req.body.addressId;

    if (!addressId) {
        res.json({
            status: "1003",
            msg: "addressId is null",
            result: ""
        })
    } else {
        Users.findOne({userId: userId}, function (err, doc) {
            if (err) {
                res.json({
                    status: "1",
                    msg: err.message,
                    result: ""
                })
            } else {
                if (doc) {
                    doc.addressList.forEach(item => {
                        if (item.addressId == addressId) {
                            item.isDefault = true
                        } else {
                            item.isDefault = false
                        }
                    });
                    doc.save(function (err1, doc1) {
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: err1.message,
                                result: ""
                            })
                        } else {
                            res.json({
                                status: "0",
                                msg: "",
                                result: ""
                            })
                        }
                    })
                }
            }
        })
    }

});


//删除地址
router.post("/deladdress", function (req, res) {
    var userId = req.cookies.userId;
    var addressId = req.body.addressId;

    Users.update({userId: userId}, {$pull: {"addressList": {"addressId": addressId}}}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            res.json({
                status: "0",
                msg: "",
                result: ""
            })
        }
    })
});


//生成订单数据
router.post("/payment", function (req, res) {
    var userId = req.cookies.userId;
    var orderTotal = req.body.orderTotal;
    var addressId = req.body.addressId;

    Users.findOne({userId: userId}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            var address = "";
            var goodsList = [];
            doc.addressList.forEach(item => {
                if (item.addressId == addressId) {
                    address = item
                }
            });

            doc.cartList.filter(item => {
                if (item.checked == "1") {
                    goodsList.push(item)
                }
            });

            var platform = "622";
            var r1 = Math.floor(Math.random() * 10);
            var r2 = Math.floor(Math.random() * 10);
            var sysDate = new Date().Format("yyyyMMddhhmmss");
            var createDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var orderId = platform + r1 + sysDate + r2;

            var order = {
                orderId: orderId,
                orderTotal: orderTotal,
                addressInfo: address,
                goodsList: goodsList,
                orderStatus: "1",
                createDate: createDate
            };

            doc.orderList.push(order);

            doc.save(function (err1, doc) {
                if (err1) {
                    res.json({
                        status: "1",
                        msg: err1.message,
                        result: ""
                    })
                } else {
                    res.json({
                        status: "0",
                        msg: "",
                        result: {
                            orderId: order.orderId,
                            orderTotal: order.orderTotal
                        }
                    })
                }
            })
        }
    })
});

//渲染订单页面
router.get("/orderDetail", function (req, res) {
    var userId = req.cookies.userId;
    var orderId = req.param("orderId");

    Users.findOne({userId: userId}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ""
            })
        } else {
            var orderList = doc.orderList;
            if (orderList.length > 0) {
                var orderTotal = 0;
                orderList.forEach(item => {
                    if (item.orderId == orderId) {
                        orderTotal = item.orderTotal
                    }
                });
                if (orderTotal > 0) {
                    res.json({
                        status: "0",
                        msg: "",
                        result: {
                            orderId: orderId,
                            orderTotal: orderTotal
                        }
                    })
                } else {
                    res.json({
                        status: "10001",
                        msg: "此订单无效",
                        result: ""
                    })
                }
            } else {
                res.json({
                    status: "10002",
                    msg: "当前用户未创建订单",
                    result: ""
                })
            }
        }
    })
});

//获取购物车的数量
router.get("/getCartCount", function (req, res) {
    if (req.cookies && req.cookies.userId) {
        var userId = req.cookies.userId;
        Users.findOne({userId: userId}, function (err, doc) {
            if (err) {
                res.json({
                    status: "1",
                    msg: err.message,
                    result: ""
                })
            } else {
                var cartCount = 0;
                doc.cartList.map(item => {
                    cartCount += parseInt(item.productNum)
                });

                res.json({
                    status: "0",
                    msg: "",
                    result: cartCount
                })
            }
        })
    }
});
module.exports = router;