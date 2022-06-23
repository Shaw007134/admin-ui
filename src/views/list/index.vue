<template>
  <div class="app-container">
    <el-row class="mb8 tableHeader">
      <el-col :span="1.5">
        <el-button plain size="small" class="addBtn" @click="handleAdd" v-hasPermi="['user.list.add']"
          >Create List Info</el-button
        >
      </el-col>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="ListList" row-key="id">
      <el-table-column prop="id" label="Message ID" align="center" width="165"></el-table-column>
      <el-table-column
        prop="content"
        label="Message Content"
        width="200"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="group" label="Telegram Group" width="165"></el-table-column>
      <el-table-column prop="status" label="Status" width="90">
        <template slot-scope="scope">
          <el-tag style="background-color: #F4F4F5; color: #A5A8AD">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Type" width="90"></el-table-column>

      <el-table-column label="Send Time" prop="send_time" width="220">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.send_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Creation Time" prop="creat_time" width="220">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.creat_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="Creator" width="150"></el-table-column>

      <el-table-column label="Operations" width="155">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            class="editBtn"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['user.list.update']"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="text"
            class="delBtn"
            @click="handleDelete(scope.row)"
            v-hasPermi="['user.list.delete']"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改列表对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Creator" prop="creator">
              <el-input v-model="form.creator" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Telegram Group" prop="group">
              <el-input v-model="form.group" controls-position="right" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Status" prop="status">
              <el-input v-model="form.status" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Type" prop="type">
              <el-input v-model="form.type" controls-position="right" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Send Time" prop="send_time">
              <el-input type="datetime" v-model="form.send_time" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Creation Time" prop="creat_time">
              <el-input type="datetime" v-model="form.creat_time" controls-position="right" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listList, getListById, delList, addList, updateList } from '@/api/list'

export default {
  name: 'List',

  data() {
    return {
      // 遮罩层
      loading: true,
      // 列表表格数据
      ListList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        creator: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        creator: [{ required: true, message: 'status cannot be null', trigger: 'blur' }],
        status: [{ required: true, message: 'status cannot be null', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表列表 */
    getList() {
      this.loading = true
      listList(this.queryParams).then(response => {
        this.ListList = response.data.items
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        creator: undefined,
        group: undefined,
        status: undefined,
        type: undefined,
        send_time: undefined,
        creat_time: undefined
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      if (row != null && row.id) {
        this.form.parentId = row.id
      } else {
        this.form.parentId = 0
      }
      this.open = true
      this.title = 'Add list'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()

      getListById(row.id).then(response => {
        this.form = response.data
        this.open = true
        this.title = 'Update list'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateList(this.form).then(response => {
              this.$modal.msgSuccess('Update Success')
              this.open = false
              this.getList()
            })
          } else {
            addList(this.form).then(response => {
              this.$modal.msgSuccess('Add success')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('Confirm to delete"' + row.id + '"？')
        .then(function() {
          return delList(row.id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('Delete Success')
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.tableHeader {
  background-color: #f0f2f5;
  height: 60px;
  border-radius: 5px;
}
.addBtn {
  background-color: #eabb1a;
  margin-top: 10px;
  margin-left: 10px;
  padding: 8px 16px;
  color: black;
}
.editBtn {
  background-color: #eabb1a;
  padding: 8px 16px;
  color: black;
}
.delBtn {
  background-color: #ef6d6e;
  padding: 8px 16px;
  color: white;
}
</style>
