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
      if (this.$route.query.type === 'user') {
        // 如果是导入员工
        const userRelations = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber'
        }
        const arr = results.map(user => {
          const userInfo = {}
          console.log(Object.keys(user))
          Object.keys(user).forEach(key => {
            if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              userInfo[userRelations[key]] = new Date(this.formatDate(user[key], '/'))
              return
            } else {
              userInfo[userRelations[key]] = user[key]
            }
          })
          return userInfo
        })
        await importEmployee(arr)
        this.$message.success('导入excel成功')
      }
      this.$router.back()
    },
    // excel日期格式转换 numb为数字，format为拼接符“-”
    formatDate(numb, format) {
      if (numb !== undefined) {
        const time = new Date((numb - 1) * 24 * 3600000 + 1)
        time.setYear(time.getFullYear() - 70)
        const year = time.getFullYear() + ''
        const month = time.getMonth() + 1 + ''
        const date = time.getDate() + ''
        if (format && format.length === 1) {
          return year + format + month + format + date
        }
        return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
      } else {
        return undefined
      }
    }
  }
}
</script>

<style lang='less' scoped>

</style>
