<template>
  <div>
    <!-- 公共导入组件 -->
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: '',

  data() {
    return {
    }
  },

  methods: {
    async success({ results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      console.log(results)
      const arr = results.map(user => {
        const userInfo = {}
        console.log(Object.keys(user))
        Object.keys(user).forEach(key => {
          userInfo[userRelations[key]] = user[key]
        })
        return userInfo
      })
      await importEmployee(arr)
      this.$message.success('导入excel成功')
      this.$router.back()
    }
  }
}
</script>

<style lang='less' scoped>

</style>
