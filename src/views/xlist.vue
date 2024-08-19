<template>
    <el-button class="btn-center" type="primary" @click="onBack">已在新页面打开，点击返回</el-button>
</template>

<script>
    export default {
        metaInfo: {
            title: "女优识别",
            meta: [
                {
                    name: "description",
                    content:
                        "提供免费98堂签到、女优识别、找番号服务。",
                },
                {
                    name: "keywords",
                    content: "女优识别",
                },
            ],
        },

        methods: {
            onBack() {
                this.$router.go(-1)
            }
        },
    };
</script>

<style>
    .btn-center {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%)
    }
</style>