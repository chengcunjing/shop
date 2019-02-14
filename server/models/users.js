var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var usersSchema = new Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [
        {
            "productImage": String,
            "salePrice": String,
            "productName": String,
            "productId": String,
            "productNum": String,
            "checked": String
        }
    ],
    "addressList": [
        {
            "addressId": String,
            "userName": String,
            "streetName": String,
            "postCode": String,
            "tel": String,
            "isDefault": Boolean
        }
    ]

});

module.exports = mongoose.model("User", usersSchema);