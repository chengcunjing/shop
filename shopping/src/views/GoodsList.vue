<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short">
                <svg id="icon-arrow-short" viewBox="0 0 25 32" width="100%" height="100%"><title>arrow-short</title>
                  <path
                    d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z"
                    class="path1"></path>
                </svg>
              </use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="filterbyclick">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterby}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setpriceChecked">All</a>
              </dd>
              <dd v-for="(price,index) in priceFilter" :key="index">
                <a href="javascript:void(0)" @click="priceCheckedclick(index)" :class="{'cur':priceChecked==index}">{{price.startPrice}}
                  - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList" :key="item._id">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="40"
                   class="tu">
                <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="goodsmdShow" @click="overlayflagclick"></div>
    <modal v-bind:mdShow="mdShow" @close="closeModal">
      <p slot="message">
        请先登录
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" @close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功！</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import "./../assets/css/base.css"
  import "./../assets/css/product.css"
  import NavHeader from "../components/NavHeader"
  import NavFooter from "../components/NavFooter"
  import NavBread from "../components/NavBread"
  import modal from "../components/Modal"
  import axios from "axios"

  export default {
    data() {
      return {
        priceFilter: [
          {
            startPrice: "0.00",
            endPrice: "100.00"
          },
          {
            startPrice: "100.00",
            endPrice: "500.00"
          },
          {
            startPrice: "500.00",
            endPrice: "1000.00"
          },
          {
            startPrice: "1000.00",
            endPrice: "5000.00"
          }
        ],
        priceChecked: "all",
        filterby: false,
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: true,
        loading: false,
        mdShow: false,
        goodsmdShow: false,
        mdShowCart: false
      }
    },
    mounted() {
      this.getgoodsList()
    },
    methods: {
      filterbyclick() {
        this.filterby = true;
        this.goodsmdShow = true;
      },
      overlayflagclick() {
        this.filterby = false;
        this.goodsmdShow = false;
      },
      priceCheckedclick(index) {
        this.priceChecked = index;
        this.overlayflagclick();
        this.page = 1;
        this.getgoodsList()
      },
      setpriceChecked() {
        this.priceChecked = "all";
        this.overlayflagclick();
        this.page = 1;
        this.getgoodsList()
      },
      getgoodsList(flag) {
        var param = {
          sort: this.sortFlag ? 1 : -1,
          page: this.page,
          pageSize: this.pageSize,
          priceLeve: this.priceChecked
        };
        this.loading = true;
        axios.get("/goods/list", {
          params: param
        }).then(res => {
          this.loading = false
          if (res.data.status == "0") {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.data.result.list)

              if (res.data.result.count < 8) {
                this.busy = true
              } else {
                this.busy = false
              }
            } else {
              this.goodsList = res.data.result.list
              this.busy = false
            }
          } else {
            this.goodsList = []
          }
        })
      },
      sortGoods() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getgoodsList();
      },
      loadMore() {
        setTimeout(() => {
          this.page++;
          this.getgoodsList(true)
        }, 500)
      },
      addCart(productId) {
        axios.post("/goods/addCart", {productId: productId}).then((res) => {
          if (res.data.status == "0") {
            this.mdShowCart = true
            this.$store.commit("setcartcount", 1);
          } else {
            this.mdShow = true
          }
        })
      },
      closeModal() {
        this.mdShow = false
        this.mdShowCart = false
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
  .tu {
    text-align: center;
  }
</style>
