<template>
    <div>
        <div class="input-box">
            <el-input v-model="inputValue" placeholder="请输入凭证搜索下载资源" autocomplete="on"
                suffix-icon="el-search"></el-input>
            <div>
                <el-button type="warning" @click="handleClick" :loading="searchLoading">搜索</el-button>
            </div>
        </div>
        <transition name="el-zoom-in-top">
            <el-card class="box-card" v-if="file.goods">
                <div slot="header">
                    <span>资源下载</span>
                    <el-button style="float: right; padding: 3px 0" icon="el-icon-download" type="text"
                        @click="redirectToDownload" :loading="downloadLoading">下载</el-button>
                </div>
                <div>
                    文件名：{{ file.file_name }}
                </div>
            </el-card>
        </transition>
    </div>
</template>

<script>
import {
    fileList,
    useCode
} from "@/api/api";
export default {
    data() {
        return {
            inputValue: '',
            file: {},
            searchLoading: false,
            downloadLoading: false
        }
    },
    mounted() {
        const param = this.$route.query;
        if(param.code) {
            this.inputValue = param.code;
            this.handleClick();
        }
    },
    methods: {
        handleClick() {
            if (this.inputValue) {
                this.searchLoading = true;
                fileList({
                    code: this.inputValue
                }).then(res => {
                    this.searchLoading = false;
                    this.file = res.data;
                    if (res.code == 0) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else {
                this.$message({
                    message: '请输入内容',
                    type: 'error'
                });
            }
        },
        redirectToDownload() {
            const downloadUrl = this.file.goods.file;
            window.open(downloadUrl, '_blank');
            useCode({
                id: this.file.id
            }).then(res=>{
                console.log(res);
            })
            // this.downloadLoading = true;
            // const downloadUrl = this.file.download_url;
            // window.open('http://api.culture-creative.com/upload/attachment/large_file/three.js-master.zip','_blank');
            //             fetch(downloadUrl) // 使用 fetch API 请求文件
            //             .then(response => {
            //     const contentLength = parseInt(response.headers.get('Content-Length'), 10);
            //     const fileSizeMB = contentLength / (1024 * 1024);
            //     console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);
            //     return response.blob();
            // }) // 将响应转换为 Blob 对象
            //             .then(blob => {
            //                 this.downloadLoading = false;
            //                 // 创建一个指向 Blob 对象的 URL
            //                 const url = window.URL.createObjectURL(blob);
            //                 // 创建一个 a 标签用于下载
            //                 const a = document.createElement('a');
            //                 a.href = url;
            //                 // 设置下载文件的名称（可选，根据后端响应的 Content-Disposition 设置）
            //                 a.download = this.file.file_name; // 如果后端没有提供文件名，可以手动设置
            //                 // 触发下载操作
            //                 a.click();
            //                 // 释放 URL 对象
            //                 window.URL.revokeObjectURL(url);
            //             })
            //             .catch(error => {
            //                 this.downloadLoading = false;
            //                 // 处理错误情况，如网络错误或后端响应问题
            //                 console.error('Download failed:', error);
            //                 this.$message({
            //                     message: '下载失败',
            //                     type: 'error'
            //                 });
            //             });
        }
    }
}
</script>

<style lang="scss" scoped>
.input-box {
    display: flex;
    justify-content: center;
    width: 40%;
    margin: 250px auto 0;
}

.box-card {
    width: 40%;
    margin: 50px auto 0;
}
</style>