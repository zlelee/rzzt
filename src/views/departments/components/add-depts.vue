<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>

</template>
<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: '',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments() // depts是所有的部门数据
      let isRepeat = false // 赋一个初始值
      if (this.formData.id) {
        // 编辑部门
        isRepeat = depts.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).some(item => item.name === this.formData.name)
      } else {
        // 新增部门
        // 如何去找技术部所有的子节点
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false // 赋一个初始值
      if (this.formData.id) {
        // 编辑部门
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === this.formData.code)
      } else {
        // 新增部门
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkNameRepeat // 自定义函数的形式校验
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      },
      peoples: [] // 员工列表
    }
  },

  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },

  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      // console.log(this.peoples)
    },
    btnOk() {
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 新增
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }

          this.$emit('addDepts') // 通知父组件重新获取一遍数据
          this.$emit('update:showDialog', false) // 关闭弹出层
        }
      })
    },
    btnCancel() {
      // 表单的resetfields方法只能重置formData绑定的数据, 不能重置新的数据
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.deptForm.resetFields() // 重置表单数据和校验规则
      this.$emit('update:showDialog', false)
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style lang="less" scoped></style>
