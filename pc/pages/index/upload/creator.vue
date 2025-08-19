<template>
    <div>
      <div class="input-box">
        <el-input v-model="inputValue" placeholder="请输入识别码上传资源"></el-input>
        <el-button type="warning" @click="searchWorks" :loading="searchLoading">搜索</el-button>
      </div>
      <transition name="el-zoom-in-top">
        <el-card class="box-card" v-if="isGoodsExit">
          <div slot="header">
            <span>资源上传</span>
            <!-- <el-upload class="upload-demo"
              :action="`${baseUrl}/api/v1/upload/add`"
              :on-remove="handleRemove"
              :on-success="handleSuccess" :on-error="handleError" :before-remove="beforeRemove" multiple :limit="1"
              :on-exceed="handleExceed" :file-list="fileList" :before-upload="beforeUpload">
              <el-button type="text" :loading="uploadLoading">上传</el-button>
              <div slot="tip" class="el-upload__tip">支持文件格式：jpg、png、eps、ai、cdr、pdf、stp、igs、stl、obj、fbx、glb、dxf、dwg、3ds、max
              </div>
            </el-upload> -->
            <el-upload action="#" :before-upload="handleBeforeUpload" :on-change="handleChange" :file-list="fileList"
                :limit="1">
              <el-button type="text" :loading="uploadLoading">选择文件</el-button>
            </el-upload>
            <el-button type="success" @click="uploadChunks" :disabled="!fileList.length"
              :loading="updateLoding">确认上传</el-button>
          </div>
          <div>
            作品名：{{ goodsInfo.name }}
          </div>
        </el-card>
      </transition>
    </div>
  </template>
  
  <script>
  import request from '@/plugins/request';
  import {
    searchByCode,
    upload,
    updateFile,
    uploadChunk,
    uploadMerge
  } from '@/api/api';
  import axios from 'axios';
  export default {
    data() {
      return {
        inputValue: '',
        goodsInfo: {},
        fileList: [],
        chunkSize: 10 * 1024 * 1024, // 分片大小（10MB）,
        chunkNum: 0,
        baseUrl: '',
        filePath: '',
        searchLoading: false,
        uploadLoading: false,
        updateLoding: false
      }
    },
    computed: {
      isGoodsExit() {
        return this.goodsInfo && Object.keys(this.goodsInfo).length > 0
      }
    },
    created() {
      this.baseUrl = request.defaults.baseURL;
    },
    mounted() {
      const param = this.$route.query;
      if (param.code) {
        this.inputValue = param.code;
        this.searchWorks();
      }
    },
    methods: {
      handleBeforeUpload(file) {
        this.uploadLoading = true;
      },
      handleChange(file, fileList) {
        this.fileList = fileList;
        this.uploadLoading = false;
      },
      async uploadChunks() {
        if (this.fileList.length === 0) {
          this.$message.error('请选择文件');
          return;
        }
        this.updateLoding = true;
        const file = this.fileList[0].raw; // 获取选中的第一个文件对象
        const fileSize = file.size; // 获取文件大小
        // 判断文件大小，如果小于50M，则执行完整上传
        if (fileSize < 50 * 1024 * 1024) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('fileName', file.name);
          try {
            const uploadRes = await upload(formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            this.updateLoding = false
            if (uploadRes.code == 0) {
              this.filePath = uploadRes.data.full_path;
              this.updateWorksFile();
              this.$message({
                message: uploadRes.msg,
                type: 'success'
              });
            }
          } catch (error) {
            this.updateLoding = false
            this.$message.error('文件上传失败');
          }
        } else {
          const chunks = Math.ceil(file.size / this.chunkSize); // 计算分片数
          for (let i = 0; i < chunks; i++) {
            const start = i * this.chunkSize;
            const end = Math.min(file.size, start + this.chunkSize);
            const chunk = file.slice(start, end); // 切割文件分片
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkNumber', i);
            formData.append('totalChunks', chunks);
            formData.append('fileName', file.name);
            try {
              await uploadChunk(formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              // this.$message.success(`分片 ${i + 1} 上传成功`);
              console.log(`分片 ${i + 1} 上传成功`);
            } catch (error) {
              this.$message.error(`分片 ${i + 1} 上传失败，请重新上传`);
              this.updateLoding = false;
              break; // 遇到错误时停止后续分片上传
            }
          }
          // 所有分片上传成功后，调用合并接口进行文件合并
          const merRes = await uploadMerge({
            fileName: file.name,
            totalChunks: chunks
          });
          this.updateLoding = false;
          // console.log(merRes);
          if (merRes.code == 0) {
            this.$message({
              message: merRes.msg,
              type: 'success'
            });
            this.filePath = merRes.data.file;
            this.updateWorksFile();
          } else {
            this.$message({
              message: merRes.msg,
              type: 'error'
            });
          }
        }
      },
      // beforeUpload() {
      //   this.uploadLoading = true;
      // },
      // 更新作品附件信息
      updateWorksFile() {
        updateFile({
          id: this.goodsInfo.id,
          file: this.filePath,
          file_name: this.fileList[0].name
        }).then(result => {
          if (result.code == 0) {
            console.log(result);
            this.$message({
              message: result.msg,
              type: 'success'
            });
          }
        })
      },
      searchWorks() {
        if (this.inputValue) {
          this.searchLoading = true;
          searchByCode({
            code: this.inputValue
          }).then(res => {
            this.searchLoading = false;
            if (res.code == 0) {
              this.goodsInfo = res.data
              this.$message({
                message: res.msg,
                type: 'success'
              });
            }
          })
        } else {
          this.$message({
            message: '请输入内容',
            type: 'error'
          });
        }
      },
      // handleRemove(file, fileList) {
      //   console.log(file, fileList);
      // },
      // handleExceed(files, fileList) {
      //   this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      // },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${file.name}？`);
      // },
      // handleSuccess(res, file, fileList) {
      //   this.uploadLoading = false;
      //   if (res.code == 0) {
      //     this.$message({
      //       message: '上传成功',
      //       type: 'success'
      //     });
      //     this.filePath = res.data[0].full_path
      //     updateFile({
      //       id: this.goodsInfo.id,
      //       file: this.filePath,
      //       file_name: file.name
      //     }).then(result => {
      //       if (result.code == 0) {
      //         console.log(result);
      //         this.$message({
      //           message: result.msg,
      //           type: 'success'
      //         });
      //       }
      //     })
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     });
      //   }
      // },
      // handleError(err, file, fileList) {
      //   console.log(err);
      //   this.uploadLoading = false;
      //   this.$message({
      //     message: err.msg || '上传失败',
      //     type: 'error'
      //   });
      // }
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