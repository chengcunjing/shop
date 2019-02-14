<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Cart</span>
    </nav-bread>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList" :key="item.productId">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'check':item.checked=='1'}"
                       @click="editCart('checked',item)">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img :src="'/static/' + item.productImage">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('minu',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.salePrice * item.productNum}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click="carttab5(item)">
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-del">
                          <svg id="icon-del" viewBox="0 0 32 32" width="100%" height="100%">
                            <title>delete</title>
                            <path class="path1"
                                  d="M11.355 4.129v-2.065h9.29v2.065h-9.29zM6.194 29.935v-23.742h19.613v23.742h-19.613zM30.968 4.129h-8.258v-3.097c0-0.569-0.463-1.032-1.032-1.032h-11.355c-0.569 0-1.032 0.463-1.032 1.032v3.097h-8.258c-0.569 0-1.032 0.463-1.032 1.032s0.463 1.032 1.032 1.032h3.097v24.774c0 0.569 0.463 1.032 1.032 1.032h21.677c0.569 0 1.032-0.463 1.032-1.032v-24.774h3.097c0.569 0 1.032-0.463 1.032-1.032s-0.463-1.032-1.032-1.032v0z"></path>
                            <path class="path2"
                                  d="M10.323 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z"></path>
                            <path class="path3"
                                  d="M16 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z"></path>
                            <path class="path4"
                                  d="M21.677 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z"></path>
                          </svg>
                        </use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;" @click="toggleCheckAll">
                  <span class="checkbox-btn item-check-btn" :class="{'check':checkAllFlag}">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"></use></svg>
                  </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class="total-price">{{totalPrice | currency('$')}}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" :class="{'btn--dis':checkedCount==0}" @click="checkOut">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :mdShow="mdShow" @close="closeModal">
      <p slot="message">确认是否删除</p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="carDel">确认</a>
        <a class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import "./../assets/css/base.css"
  import "./../assets/css/product.css"
  import "./../assets/css/checkout.css"
  import NavHeader from "../components/NavHeader"
  import NavFooter from "../components/NavFooter"
  import NavBread from "../components/NavBread"
  import modal from "../components/Modal"
  import axios from "axios"

  export default {
    data() {
      return {
        cartList: [],
        mdShow: false,
        delItem: "",
      }
    },
    computed: {
      checkAllFlag() {
        return this.checkedCount == this.cartList.length
      },
      checkedCount() {
        var i = 0;
        this.cartList.forEach(item => {
          if (item.checked == "1") i++;
        });
        return i;
      },
      totalPrice() {
        var money = 0;
        this.cartList.forEach(item => {
          if (item.checked == "1") {
            money += parseFloat(item.salePrice) * parseInt(item.productNum)
          }
        });
        return money
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        axios.get("/users/CarList").then(res => {
          if (res.data.status == "0") {
            this.cartList = res.data.result
          }
        })
      },
      closeModal() {
        this.mdShow = false
      },
      carttab5(item) {
        this.mdShow = true;
        this.delItem = item
      },
      carDel() {
        axios.post("/users/cartDel", {productId: this.delItem.productId}).then(res => {
          if (res.data.status == "0") {
            this.mdShow = false;
            this.init();
            this.$store.commit("setcartcount", -this.delItem.productNum)
          }
        })
      },
      editCart(flag, item) {
        if (flag == "add") {
          item.productNum++;
        } else if (flag == "minu") {
          if (item.productNum <= 1) {
            return
          }
          item.productNum--;
        } else {
          item.checked = item.checked == "1" ? '0' : '1'
        }

        axios.post("/users/cartEdit", {
          productId: item.productId,
          productNum: item.productNum,
          checked: item.checked
        }).then(res => {
          if (res.data.status == "0") {
            let num = 0;
            if (flag == "add") {
              num = 1
            } else if (flag == "minu") {
              num = -1
            }
            this.$store.commit("setcartcount", num)
          }
        })
      },
      toggleCheckAll() {
        var flag = !this.checkAllFlag;
        this.cartList.forEach(item => {
          item.checked = flag ? "1" : "0"
        });
        axios.post("/users/editCheckAll", {
          checkedAll: flag
        }).then(res => {
          if (res.data.status == "0") {
            console.log("成功")
          }
        })
      },
      checkOut() {
        if (this.checkedCount > 0) {
          this.$router.push({
            path: "/address"
          })
        }
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      modal
    }
  }
</script>

<style scoped>
  .input-sub, .input-add {
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }

  .item-quantity .select-self-area {
    background: none;
    border: 1px solid #f0f0f0;
  }

  .item-quantity .select-self-area .select-ipt {
    display: inline-block;
    padding: 0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
