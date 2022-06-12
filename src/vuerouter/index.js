let _Vue = null

export default class VueRouter {
    // Vue.use调用install方法会传递两个参数
    // 一个是vue的构造函数，一个是可选的选项对象
    static install(Vue) {
        // 1.判断当前插件是否已经被安装
        if (VueRouter.install.installed) {
            return
        }
        VueRouter.install.installed = true
        // 2. 把Vue构造函数记里到全局变量
        // 在将来VueRouter中实例方法中还要使用Vue的构造函数(比如创建routerview,routerlink组件要调用Vue.component创建)
        _Vue = Vue
        // 3. 把创建Vue实例时候传入的router对象注入到Vue实例上
        // 混入 给所有的vue实例混入选项
        _Vue.mixin({
            // 在这个选项里设置一个beforeCreate钩子函数，所有的组件也都会执行
            beforeCreate() {
                // this是指向vue的
                // 只需要执行一次，在vue实例创建并且传入的options选项中有router的时候
                if (this.$options.router) {
                    // 是可以使用this.$router
                    _Vue.prototype.$router = this.$options.router
                    // 初始化
                    this.$options.router.init()
                }
            }
        })
    }

    constructor(options) {
        this.options = options
        this.routeMap = {}
        // 响应式对象使用Vue.observable静态方法传入的对象会转换成响应式对象
        this.data = _Vue.observable({
            current: '/'
        })
    }

    init() {
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }

    // 遍历所有的路由规则，把路由规则解析成键值对的形式 存储到routeMap
    createRouteMap() {
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }

    // 注册router-link组件
    initComponents(Vue) {
        Vue.component('router-link', {
            // 通过props接收传入的参数
            props: {
                to: String
            },
            // h函数是Vue传递过来的
            render(h) {
                // 第一个参数是元素选择器，这里使用标签选择器
                // 第二个参数可以设置属性
                // 第三个参数可以设置生成元素的子元素，所以是数组的形式
                return h('a', {
                    // dom对象属性
                    attrs: {
                        // history模式不需要拼#
                        href: this.to
                    },
                    // 注册事件
                    on: {
                        click: this.clickHander
                    }
                    // 默认插槽
                }, [this.$slots.default])
            },
            methods: {
                clickHander(e) {
                    // 改变浏览器地址栏，但是不会向服务器发送请求
                    // 第一个参数是将来触发popstate的事件对象参数
                    // 第二个参数是网页的标题
                    history.pushState({}, '', this.to)
                    // router里的data是响应式对象，
                    // 值改变了会重新加载对应的组件重新渲染到视图
                    this.$router.data.current = this.to
                    // 阻止默认事件，不向服务器发起请求，没有刷新
                    e.preventDefault()
                }
            }
            // 使用插槽<slot></slot>显示router-link内容
            // template: '<a :href="to"><slot></slot></a>'
        })

        const self = this
        Vue.component('router-view', {
            render(h) {
                // 根据当前地址获取当前组件
                const component = self.routeMap[self.data.current]
                // 传给h函数，h函数会把组件转换成虚拟dom最终返回
                return h(component)
            }
        })
    }

    initEvent() {
        // popstate只会在历史发生变化的时候触发
        window.addEventListener('popstate', () => {
            this.data.current = window.location.pathname
        })
    }
}
