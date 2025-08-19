<template>
  <div class="content">
    <el-row type="flex" justify="center">
        <el-col :span="6">
            <el-upload
                class="upload"
                drag
                action="#"
                :before-upload="handleBeforeUpload"
                :on-change="handleChange"
                :file-list="fileList"
                :limit="1"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">文件上传成功后，点击下方输入框复制并粘贴到小程序提交定制</div>
            </el-upload>
            <el-button type="primary" @click="uploadChunks">确认上传</el-button>
          </el-col>
      </el-row>
      <el-row type="flex" justify="center">
          <el-col :span="6">
              <el-input v-model="filePath" disabled>
                  <div slot="suffix">
                      <el-tooltip class="item" effect="dark" content="复制" placement="top-start">
                          <i class="el-icon-document-copy" @click="onCopy" style="cursor: pointer; margin-right: 5px"></i>
                      </el-tooltip>
                  </div>
              </el-input>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import { upload, uploadChunk, uploadMerge } from "@/api/api";
export default {
  data() {
    return {
      fileList: [],
      chunkSize: 10 * 1024 * 1024, // 分片大小（10MB）,
      chunkNum: 0,
      filePath: "",
    };
  },
  methods: {
    onCopy(){
        if(!this.filePath){
            this.$message.error("请先上传文件");
            return;
        }
        navigator.clipboard.writeText(this.filePath).then(()=>{
            this.$message.success("下载链接已复制到剪切板");
        }).catch(err=>{
            this.$message.error("复制失败");
        });
    },
    handleBeforeUpload(file) {
    //   this.uploadLoading = true;
        console.log(this.fileList);
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    //   this.uploadLoading = false;
    },
    async uploadChunks() {
      if (this.fileList.length === 0) {
        this.$message.error("请选择文件");
        return;
      }
    //   this.updateLoding = true;
      const file = this.fileList[0].raw; // 获取选中的第一个文件对象
      const fileSize = file.size; // 获取文件大小
      // 判断文件大小，如果小于50M，则执行完整上传
      if (fileSize < 50 * 1024 * 1024) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        try {
          const uploadRes = await upload(formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        //   this.updateLoding = false;
          if (uploadRes.code == 0) {
            this.filePath = uploadRes.data[0].full_path;
            console.log(uploadRes.data,this.filePath);
            // this.updateWorksFile();
            this.$message({
              message: uploadRes.msg,
              type: "success",
            });
          }
        } catch (error) {
          this.updateLoding = false;
          this.$message.error("文件上传失败");
        }
      } else {
        const chunks = Math.ceil(file.size / this.chunkSize); // 计算分片数
        for (let i = 0; i < chunks; i++) {
          const start = i * this.chunkSize;
          const end = Math.min(file.size, start + this.chunkSize);
          const chunk = file.slice(start, end); // 切割文件分片
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("chunkNumber", i);
          formData.append("totalChunks", chunks);
          formData.append("fileName", file.name);
          try {
            await uploadChunk(formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            // this.$message.success(`分片 ${i + 1} 上传成功`);
            console.log(`分片 ${i + 1} 上传成功`);
          } catch (error) {
            this.$message.error(`分片 ${i + 1} 上传失败，请重新上传`);
            // this.updateLoding = false;
            break; // 遇到错误时停止后续分片上传
          }
        }
        // 所有分片上传成功后，调用合并接口进行文件合并
        const merRes = await uploadMerge({
          fileName: file.name,
          totalChunks: chunks,
        });
        // this.updateLoding = false;
        // console.log(merRes);
        if (merRes.code == 0) {
          this.$message({
            message: merRes.msg,
            type: "success",
          });
          this.filePath = merRes.data.file;
        //   this.updateWorksFile();
        } else {
          this.$message({
            message: merRes.msg,
            type: "error",
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-input__suffix{
    display: flex;
    align-items: center;
}

.content{
  padding-top: 100px;
}

</style>