<template>
  <div>
    <el-upload
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :http-request="upload"
      list-type="picture-card"
      action="#"
      :limit="1"
      :class="{disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDEDvTmoa3jFXZKpmSaU7TYRKwHL8fqvys',
  SecretKey: 'nKZXAYfa6QTFk00jFcjZ8QSK7dfRxC9q'
})
export default {
  name: '',

  data() {
    return {
      fileList: [{ url: 'https://img2.baidu.com/it/u=3355464299,584008140&fm=26&fmt=auto&gp=0.jpg' }], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: ''
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      // file是点击删除的文件
    //   将原来的文件给排除掉了 剩下的就是最新的数组了
      // this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList
    },
    changeFile(file, fileList) {
      this.fileList.push({ url: file.url, status: 'success' })
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        // 上传的格式不正确
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }

      return true
    },
    upload(params) {
      if (params.file) {
        console.log(params)
        cos.putObject({
          Bucket: 'hhh-1305395754', // 储存桶名称
          Region: 'ap-beijing', // 地域
          Key: params.file.uid.toString(), // 唯一标识
          Body: params.file, // 上传文件对象
          StorageClass: 'STANDARD' // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          // console.log(err || data)
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            //   此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
          }
          // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
        }
        )
      }
    }
  }
}
</script>

<style scoped>
.disabled >>> .el-upload--picture-card {
  display: none
}
</style>
