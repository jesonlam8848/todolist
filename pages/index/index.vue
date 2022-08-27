<!-- pages/index/index -->

<template>
    <view class="container">
        <!-- 头部组件 -->
        <todo-head :length="listData.length" @tabClick="tabClick"></todo-head>

        <scroll-view scroll-y class="scoll-content">
            <!-- 中间内容组件 -->
            <todo-content ref="list" :listData="listData" @longpress="longpress" @change="change"></todo-content>
            <!-- 无任务时显示 -->
            <view class="no-task" v-if="!listData.length">
                <image src="../../static/tasks.png"></image>
                <view class="no-task-intro"> {{taskIntro}} </view>
            </view>
        </scroll-view>

        <!-- 底部操作组件 -->
        <todo-operate ref="operate" @toAddTask="toAddTask" @toMarkOver="toMarkOver" @toDel="toDel" @toSelAll="toSelAll"
            v-model="toOperate"></todo-operate>
    </view>
</template>
<script>
    import warn from '@/common/images/warn.png'
    export default {
        data() {
            return {
                checked: [],
                tabIdx: 0,
                tasks: [],
                taskIntro: '还没有任务，可点击下方按钮，开始创建任务',
                toOperate: false,
            };
        },
        computed: {
            listData() {
                if (this.tabIdx == 0) {
                    return this.tasks;
                } else if (this.tabIdx == 1) {
                    return this.tasks.filter(v => !v.read);;
                } else if (this.tabIdx == 2) {
                    return this.tasks.filter(v => v.read);;
                }
            },
        },
        onLoad() {
            uniCloud.callFunction({
                name: 'publish',
                data: {
                    apiname: 'getTask'
                }
            }).then(res => {
                // console.log('indexOnLoad', res.result.data);
                let taskTexts = res.result.data
                for (let i = 0; i < taskTexts.length; i++) {
                    this.tasks.push({
                        label: taskTexts[i].taskText
                    })
                }
            })
        },
        methods: {
            change(checked) {
                this.checked = checked;
            },
            // tab切换操作
            tabClick(
                index
            ) {
                this.tabIdx = index;
                this.checked = [];
                if (this.tabIdx == 0 || this.tabIdx == 1) {
                    this.taskIntro = '暂无任务，可点击下方输入，创建任务';
                } else if (this.tabIdx == 2) {
                    this.taskIntro = '暂无已完成的任务，可长按选择，标记为已完成任务，注意已完成任务会被销毁哦';
                }
            },
            // 长按选择
            longpress() {
                this.toOperate = true;
                this.tasks.forEach(v => {
                    !v.hasOwnProperty('show') ? this.$set(v, 'show', true) : (v.show = true)
                });
            },
            // 全选
            toSelAll() {
                let checked = [];
                this.listData.forEach(v => {
                    this.checked.push(v.label);
                    checked.push(v.label);
                })
                this.$refs.list.toChangeSel(checked);
            },
            // 选择后删除
            toDel() {
                if (this.checked.length === 0) {
                    uni.showToast({
                        title: '请选择任务',
                        image: warn
                    });
                    return;
                }
                for (let i = 0; i < this.tasks.length; i++) {
                    let v = this.tasks[i];
                    if (this.checked.includes(v.label)) {
                        this.tasks.splice(i, 1);
                        i--;
                    }!v.hasOwnProperty('show') ? this.$set(v, 'show', false) : (v.show = false);
                }
                // console.log('indexToDelChecked', this.checked);
                uniCloud.callFunction({
                    name: 'publish',
                    data: {
                        apiname: 'delete',
                        checked: this.checked
                    }
                }).then(res => console.log('111', res))
                this.toOperate = false;
            },
            // 标记为已读
            toMarkOver() {
                if (this.checked.length === 0) {
                    uni.showToast({
                        title: '请选择任务',
                        image: warn
                    });
                    return;
                }
                this.tasks.forEach(v => {
                    const result = this.checked.find(s => s === v.label || v.read);
                    if (result) {
                        !v.hasOwnProperty('read') ? this.$set(v, 'read', true) : (v.read = true);
                    } else {
                        !v.hasOwnProperty('read') ? this.$set(v, 'read', false) : (v.read = false);
                    }!v.hasOwnProperty('show') ? this.$set(v, 'show', false) : (v.show = false);
                });
                // console.log('indexToMarkOver', this.checked);
                uniCloud.callFunction({
                    name: 'publish',
                    data: {
                        apiname: 'delete',
                        checked: this.checked
                    }
                }).then(res => console.log('222', res))
                this.toOperate = false;
            },
            // 添加todo
            toAddTask(taskText) {
                // console.log('indexToAddTask', taskText);
                if (!taskText) {
                    uni.showToast({
                        title: '请输入任务名',
                        image: warn
                    });
                    return;
                }
                const result = this.tasks.find(v => v.label === taskText);
                if (result) {
                    uni.showToast({
                        title: '任务重复',
                        image: warn
                    });
                    return;
                }
                this.tasks.push({
                    label: taskText,
                });
                this.$refs.operate.resetText();
            }
        },
    };
</script>
<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px;
        font-size: 14px;
        line-height: 24px;
        overflow: hidden;

        .hide {
            display: none !important;
        }

        // 头部切换
        .title-box {
            flex: 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .title-left {
                .label {
                    color: #0085f5;
                }
            }
        }

        .scoll-content {
            height: calc(100% - 160rpx);
            padding-top: 30rpx;

            .no-task {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                image {
                    width: 300rpx;
                    height: 300rpx;
                }

                .no-task-intro {
                    font-size: 30rpx;
                    color: #b9acac;
                }
            }

            .sel-item {
                display: flex;
                padding: 15rpx;
                margin-bottom: 30rpx;
                background-color: #d3ecfa;
                border-radius: 6rpx;

                &.active {
                    background-color: #e1e1e1;
                }

                .sel-label {
                    padding: 0 20rpx;
                    font-size: 30rpx;
                }
            }
        }

        .add-tast {
            flex: 1 0 80rpx;
        }

        .to-opreate {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 80rpx;

            .item {
                display: flex;
                align-items: center;

                image {
                    width: 40rpx;
                    height: 40rpx;
                }
            }
        }
    }
</style>
