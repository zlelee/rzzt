<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-item :tree-node="company" :is-root="true" />
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <tree-item slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" />
        </el-tree>
      </el-card>
      <!-- 新增弹窗 -->
      <add-depts :show-dialog="showDialog" />
    </div>
  </div>
</template>

<script>
import treeItem from './components/tree-item'
import addDepts from './components/add-depts'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'Departments',
  components: {
    treeItem, addDepts
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: {},
      showDialog: false,
      node: null // 当前点击的部门信息
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      // console.log(result)
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化成树形结构
    },
    addDepts(node) {
      this.node = node
      this.showDialog = true
    }
  }
}
</script>
<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
