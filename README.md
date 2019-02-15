# Vue+Node.js+MongoDB 全栈打造商城系统


**登录与注销**<br>

![](https://github.com/liuanming/shangcheng/blob/master/images/dengluyuzhuxiao.gif) <br>

**商品分页和价格排序**<br>

![](https://github.com/liuanming/shangcheng/blob/master/images/fenyehepaixun.gif) <br>


**商品价格过滤**<br>

![](https://github.com/liuanming/shangcheng/blob/master/images/jaigeguolv.gif) <br>


**加入购物车**<br>

![](https://github.com/liuanming/shangcheng/blob/master/images/jiaruguowuche.gif) <br>

**商品删除**<br>

![](https://github.com/liuanming/shangcheng/blob/master/images/gouwucheshanchu.gif) <br>

**购买商品总金额的实时计算**<br>

![](https://github.com/liuanming/shangcheng/blob/master/images/shishijine.gif) <br>

**地址功能**<br>

![](https://github.com/liuanming/shangcheng/blob/master/images/dizhi.gif) <br>

**创建订单成功**<br>

![](https://github.com/liuanming/shangcheng/blob/master/images/djngdanchenggong.gif) <br>





***




# 技术栈
* vue 页面展示
* node.js 打开服务器，响应请求
* MongoDB 存放数据
* webpack 文件打包
* vuex 用于集中管理状态,实现数据组件共享
* vue-router 实现spa
* axios 解决异步请求
* vue-lazyload 图片懒加载
* es6 代码书写优雅美观
* vue-infinite-scroll 无限加载，实现图片分页加载
* Express 是一个简洁而灵活的 node.js Web应用框架, 提供一系列强大特性帮助你创建各种Web应用
* express-session 拦截登录状态，实现登录功能



***


# 实现功能
* **登录与注销**<br>
  用户进入页面时会有两种状态，登录和未登录，未登录时有些页面会正常展示，在你进行某些操作时会提醒你需要登录，那我们要怎么样来记录这种状态呢？这里我使用了express-session来帮助我记录这种状态。当你没登录时拿不到通过express-session设置的值，这时就会认为你没登录，在进行某些请求时，服务器通过获取前端传来的内容，没有拿到express-session的值，认为你没登录，就会拦截请求，不让他请求成功，但可以通过设置白名单让某些不在登录状态上但需要正常展示的页面的请求正常的去请求。当你点击登录时express-session会设置值，服务器拿到后会判断你已登录，允许你的请求。点击退出时会注销express-session设置的值。
* **商品分页和价格排序**<br>
  一个页面太小，不可能同时展示太多的商品，这时就需要分页功能，当你需要看查更多的商品时，往下滚动鼠标就会加载更多的商品。排序功能让你清楚的知道商品价格的升降。在前端通过请求，传递参数：展示第几页page，一页展示多少条商品数量pageSize，价格排序的状态码，1位升序，-1为降序，服务器收到参数后，通过拿到的参数进行语句查询，返回结果。前端拿到返回的数据进行页面渲染。
* **商品价格过滤**<br>
  当你点击价格区间时，页面会展示对应区间价格的商品，这个功能跟商品分页和价格排序的做法差不多，传递参数，返回结果，然后渲染页面。
* **加入购物车**<br>
  原理与商品分页和价格排序一样，传递参数，返回结果，然后渲染页面。不同的是加入购物车时购物车的数量会随加入商品的数量的改变而改变，这里使用了vuex。
* **商品删除**<br>
  删除商品时，需要知道我们删除的是那件商品，这时会把被删除商品的唯一ID传到后台，拿到ID后通过查询数据库，如果匹配，就把这个商品的数据从数据库中删除，然后返回给前端重新渲染页面。
* **购买商品总金额的实时计算**<br>
  当我们在购物车页面时，我们选择要买的商品，我们可能会增加或减少要购买商品的数量，或选择要不要买这件商品，这些改变都会影响最后总金额的计算，我们要让用户实时的知道买这些东西要花多少钱，增加数量或减少数量时总金额变化要让用户知道。这里我使用了computed，它是vue中的一个功能，在computed中可以定义一些属性叫计算属性，计算属性的本质就是一个方法，只要计算属性这个function内部，所用到的任何vue中data中的数据发生了变化，就会立即重新计算这个计算属性的值。使用这个功能就会很方便的实现购买商品总金额的实时计算。
* **地址功能**<br>
  这个比较简单，通过请求接口，返回地址数据，然后渲染页面。地址展开功能也使用了computed，当点击展开时，computed里面的计算属性发生改变，渲染地址的条数变多，就会展示更多的地址。
* **创建订单成功**<br>
  我们要拿到买的商品的Id和选择配送地址的ID，传递到服务器，进行数据库查询，如果没有此订单就会创建一个新的订单添加保存到数据库中去，然后返回此次生成的订单号和买的商品的总金额，前端拿到后渲染页面。

***

# 遇到的坑