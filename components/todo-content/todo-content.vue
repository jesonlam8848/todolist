<template>
    <view>
        <u-checkbox-group placement="column" @change="change" v-model="checked">
            <view :class="{active: item.read}" @longpress="longpress" class="sel-item" v-for="item in listData"
                :key="item.label">
                <view class="sel" :class="{hide: !item.show}">
                    <u-checkbox :disabled="item.disabled" :name="item.label" :value="item.label" shape="circle"
                        size="20" activeColor="green"></u-checkbox>
                </view>
                <view class="sel-label u-line-1"> {{item.label}} </view>
            </view>
        </u-checkbox-group>
    </view>
</template>

<script>
    export default {
        name: "todo-content",
        props: {
            listData: {
                type: Array,
                required: false,
                default: () => []
            },
            userSel: {
                type: Array,
                required: false,
                default: () => []
            },
        },
        data() {
            return {
                checked: []
            };
        },
        methods: {
            // 长按选择
            longpress() {
                console.log('longpress')
                this.checked = [];
                this.$emit('longpress');
            },
            change(data) {
                this.$emit('change', data)
                // console.log('contentChange', data);
            },
            toChangeSel(checked) {
                this.checked = checked;
            }
        },
    }
</script>

<style lang="scss">
    .sel-item {
        display: flex;
        padding: 15rpx;
        margin-bottom: 30rpx;
        background-color: #d3ecfa;
        border-radius: 6rpx;

        .hide {
            display: none !important;
        }

        &.active {
            background-color: #e1e1e1;
        }

        .sel-label {
            padding: 0 20rpx;
            font-size: 30rpx;
        }
    }
</style>
