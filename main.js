import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
    createSSRApp
} from 'vue'
export function createApp() {
    const app = createSSRApp(App)
    return {
        app
    }
}
// #endif

// Vue 2 转 Vue 3, 在 main.js 中写入以下代码即可
function isPromise(obj) {
    return (
        !!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function"
    );
}

uni.addInterceptor({
    returnValue(res) {
        if (!isPromise(res)) {
            return res;
        }
        return new Promise((resolve, reject) => {
            res.then((res) => {
                if (res[0]) {
                    reject(res[0]);
                } else {
                    resolve(res[1]);
                }
            });
        });
    },
});
