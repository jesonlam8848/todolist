<template>
    <view class="title-box" justify="space-between">
        <view class="title-left" span="3">
            <text>todoList</text>
            <!-- <text class="label">全部：</text> -->
            <!-- <text>{{ length }}</text> -->
        </view>
        <u-tabs :activeStyle="{
      color: '#0085f5',
      fontWeight: 'bold',
      transform: 'scale(1.05)'
     }" :inactiveStyle="{
      color: '#606266',
      transform: 'scale(1)'
     }" :list="tabs" @click="tabClick"></u-tabs>
    </view>
</template>

<script>
    export default {
        name: "todo-head",
        props: {
            length: {
                type: Number | String,
                required: false,
                defaut: () => []
            }
        },
        data() {
            return {
                tabs: [{
                        name: '全部'
                    },
                    {
                        name: '待办'
                    },
                    {
                        name: '已完成'
                    }
                ],
            };
        },
        methods: {
            tabClick({
                index
            }) {
                this.$emit('tabClick', index);
            },
        }
    }
</script>

<style lang="scss">
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
</style>
