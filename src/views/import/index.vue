<template>
  <div>
    <!-- 公共导入组件 -->
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
// import { importEmployee } from '@/api/employees'
export default {
  name: '',

  data() {
    return {
    }
  },

  methods: {
    success({ header, results }) {

    }
  }
}
</script>

<style lang='less' scoped>

</style>
