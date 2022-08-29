<template>
    <view>
        <view class="add-tast" v-if="!toOperate">
            <!-- #ifndef APP-NVUE -->
            <u-input v-model="taskText" placeholder="请输入要创建的todoList">
                <!-- #endif -->

                <!-- #ifdef APP-NVUE -->
                <u--input v-model="taskText" placeholder="请输入要创建的todoList">
                    <!-- #endif -->
                    <template slot="suffix">
                        <u-button @tap="toAddTask(taskText)" text="创建" type="success" size="mini"></u-button>
                    </template>
                    <!-- #ifndef APP-NVUE -->
            </u-input>
            <!-- #endif -->
            <!-- #ifdef APP-NVUE -->
            </u--input>
            <!-- #endif -->
        </view>
        <view class="Tips">
            <text>长按创建的list实现以下操作</text>
        </view>
        <view class="to-opreate" v-if="!toOperate">
            <view class="item" @click="toMarkOver">
                <image src="../../static/noread.png"></image>
                <text>标记为已完成</text>
            </view>
            <view class="item" @click="toDel">
                <image src="../../static/delete.png"></image>
                <text>删除</text>
            </view>
            <view class="item" @click="toSelAll">
                <image src="../../static/selall.png"></image>
                <text>全选</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "todo-operate",
        model: {
            prop: 'toOperate',
            event: 'toggle'
        },
        props: {
            toOperate: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        data() {
            return {
                taskText: ''
            };
        },
        methods: {
            toAddTask(e) {
                this.$emit('toAddTask', this.taskText.trim())
                console.log('toAddTask', e)
                uniCloud.callFunction({
                    name: 'publish',
                    data: {
                        taskText: e,
                        apiname: 'publish',
                        token: uni.getStorageSync('token')
                    }
                })
            },
            toMarkOver() {
                this.$emit('toMarkOver')
            },
            toDel() {
                this.$emit('toDel')
            },
            resetText() {
                this.taskText = '';
            },
            toSelAll() {
                this.$emit('toSelAll')
            },
        }
    }
</script>

<style lang="scss">
    .Tips {
        margin: 40rpx auto 10rpx;
        border: 1px solid #e5e5e5;
        text-align: center;
    }

    .add-tast {
        margin-top: 10rpx;
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
</style>
