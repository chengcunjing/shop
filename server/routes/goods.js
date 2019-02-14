var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Goods = require("./../models/goods");
var Users = require("./../models/users");

mongoose.connect("mongodb://127.0.0.1:27017/muke");

router.get("/list", function (req, res) {
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let skip = (page - 1) * pageSize;
    let sort = req.param("sort");
    let priceLeve = req.param("priceLeve");
    var priceGt = "";
    var priceLet = "";
    var params = {};

    if (priceLeve != "all") {
        switch (priceLeve) {
            case "0":
                priceGt = 0;
                priceLet = 100;
                break;
            case "1":
                priceGt = 100;
                priceLet = 500;
                break;
            case "2":
                priceGt = 500;
                priceLet = 1000;
                break;
            case "3":
                priceGt = 1000;
                priceLet = 5000;
                break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLet
            }
        }
    }


    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'salePrice': sort});

    goodsModel.exec({}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            res.json({
                status: "0",
                msg: "",
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});


router.post("/addCart", function (req, res) {
    var userId = "100000077";
    var productId = req.body.productId;


    Users.findOne({userId: userId}, function (usererr, userdoc) {
        if (usererr) {
            res.json({
                status: "1",
                msg: usererr.message
            })
        } else {
            if (userdoc) {
                let goodsItem = "";
                userdoc.cartList.forEach(function (item) {
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++
                    }
                });
                if (goodsItem) {
                    userdoc.save(function (err, doc) {
                        if (err) {
                            res.json({
                                status: "1",
                                msg: err.message
                            })
                        } else {
                            res.json({
                                status: "0",
                                mgs: "添加成功"
                            })
                        }
                    })
                } else {
                    Goods.findOne({productId: productId}, function (goodserr, goodsdoc) {
                        if (goodserr) {
                            res.json({
                                status: "1",
                                msg: goodserr.message
                            })
                        } else {
                            if (goodsdoc) {
                                goodsdoc.productNum = 1;
                                goodsdoc.checked = 1;
                                userdoc.cartList.push(goodsdoc);
                                userdoc.save(function (err1, doc2) {
                                    if (err1) {
                                        res.json({
                                            status: "1",
                                            msg: err1.message
                                        })
                                    } else {
                                        res.json({
                                            status: "0",
                                            mgs: "添加成功"
                                        })
                                    }
                                })
                            }
                        }
                    })
                }

            }
        }

    })
});

module.exports = router;