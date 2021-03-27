<template>
  <el-upload list-type="picture-card" :limit="1" action="#" :on-preview="preview">
    <i class="el-icon-plus" />
  </el-upload>
</template>

<script>
export default {
  name: '',

  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: ''
    }
  },

  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    }
  }
}
</script>

<style lang='less' scoped>

</style>
