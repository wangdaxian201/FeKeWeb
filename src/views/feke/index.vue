<template>
    <div class="dashboard-container">
      <!-- 当前时间 -->
      <div>
        <span>{{ currentTime }}</span>
      </div>
      <div class="dashboard-text">User</div>
      <!-- 搜索框 -->
      <!-- <el-row>
        <el-col :span="8">
          <el-input v-model="searchText" placeholder="请输入关键词搜索" prefix-icon="el-icon-search"
            clearable @clear="handleSearch"></el-input>
        </el-col>
      </el-row> -->
      
      <div class="input">
        <el-input
          v-model="listQuery.search_name"
          placeholder="name"
          style="width: 300px"
          size="small"
          @keyup.enter.native="handleFilter"
        />
        <el-button
          class="search-btn"
          type="primary"
          icon="el-icon-search"
          clearable
          size="small"
          @click="handleFilter"
        >
          Search
        </el-button>
      </div>
      <!-- 房间列表 -->
      <el-table :data="roomList" border stripe class="room_table"
      element-loading-text="loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)">
        <el-table-column prop="roomNumber" label="房间号" width="120"></el-table-column>
        <el-table-column prop="roomType" label="房间类型" width="120"></el-table-column>
        <!-- 入住时间 -->
        <el-table-column label="入住时间" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="showTime(row)">{{ row.time }}</el-button>
          </template>
        </el-table-column>
        <!-- 入住用户 -->
        <el-table-column label="入住用户" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="showUser(row)">{{ row.user }}</el-button>
          </template>
        </el-table-column>
        <!-- 平台 -->
        <el-table-column label="平台" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="showPlatform(row)">{{ row.platform }}</el-button>
          </template>
        </el-table-column>
        <!-- 预定天数 -->
        <el-table-column label="预定天数" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="showDays(row)">{{ row.days }}</el-button>
          </template>
        </el-table-column>
        <!-- 预定时间 -->
        <el-table-column label="预定时间" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="showOrderTime(row)">{{ row.orderTime }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="120"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="{ row }">
            <div class="button-group">
              <el-button type="primary" size="mini" @click="editRoom(row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteRoom(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加房间弹框 -->
      <el-dialog title="添加房间" :visible.sync="addDialogVisible" width="30%">
        <el-form :model="form" :rules="formRules" ref="form" label-width="80px">
          <el-form-item label="房间号" prop="roomNumber">
            <el-input v-model="form.roomNumber"></el-input>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomType">
            <el-select v-model="form.roomType" placeholder="请选择房间类型">
              <el-option v-for="item in roomTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择房间状态">
              <el-option label="空闲" value="空闲"></el-option>
              <el-option label="已预订" value="已预订"></el-option>
              <el-option label="已入住" value="已入住"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoom">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑房间弹框 -->
      <el-dialog title="编辑房间" :visible.sync="editDialogVisible" width="30%">
        <el-form :model="editForm" :rules="formRules" ref="editForm" label-width="80px">
          <el-form-item label="房间号" prop="roomNumber">
            <el-input v-model="editForm.roomNumber"></el-input>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomType">
            <el-select v-model="editForm.roomType" placeholder="请选择房间类型">
              <el-option v-for="item in roomTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="editForm.price"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="editForm.status" placeholder="请选择房间状态">
              <el-option label="空闲" value="空闲"></el-option>
              <el-option label="已预订" value="已预订"></el-option>
              <el-option label="已入住" value="已入住"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRoom">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除房间弹框 -->
      <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
        <span>确定删除该房间吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmDeleteRoom">确 定</el-button>
        </span>
      </el-dialog>

      
      
    </div>
  </template>

  <script>
  import { getRoomList, deleteRoom, addRoom, updateRoom, getRoomTypes, searchRoom } from '@/api/room'

  export default {
    data() {
      
      return {
        roomList: [
          {roomNumber: '101', roomType: '单人间', price: 100, status: '空闲'},
        ], // 房间列表
        roomTypes: [], // 房间类型列表
        search: '', // 搜索关键字
        searchText: '', // 搜索框输入的内容
        addDialogVisible: false, // 添加房间弹框是否可见
        editDialogVisible: false, // 编辑房间弹框是否可见
        deleteDialogVisible: false, // 删除房间弹框是否可见
        listQuery: {
          page: 1,
          limit: 10,
          search_name: '',
        },
        form: { // 添加/编辑房间表单
          roomNumber: '',
          roomType: '',
          price: '',
          status: ''
        },
        editForm: { // 编辑房间表单
          id: '',
          roomNumber: '',
          roomType: '',
          price: '',
          status: ''
        },
        deleteForm: { // 删除房间表单
          id: '',
          roomNumber: ''
        },
        formRules: { // 添加/编辑房间表单校验规则
          roomNumber: [{ required: true, message: '请输入房间号', trigger: 'blur' }],
          roomType: [{ required: true, message: '请选择房间类型', trigger: 'change' }],
          price: [{ required: true, message: '请输入房间价格', trigger: 'blur' }, { type: 'number', message: '价格必须为数字值', trigger: 'blur' }],
          status: [{ required: true, message: '请选择房间状态', trigger: 'change' }]
        }
      }
    },
    computed: {
      currentTime() {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }
    },
    created() {
      // 获取房间列表和房间类型列表
      this.getRoomList()
      this.getRoomTypes()
    },
    methods: {
      // 编辑房间
      editRoom(row) {
        this.editDialogVisible = true
        this.editForm.id = row.id
        this.editForm.roomNumber = row.roomNumber
        this.editForm.roomType = row.roomType
        // 转换为数字类型
        this.editForm.price = Number(row.price)
        this.editForm.status = row.status
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              this.addRoom(this.ruleForm);
            } else if (formName === 'editForm') {
              this.updateRoom();
            } else if (formName === 'deleteForm') {
              this.confirmDeleteRoom();
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // confirmDeleteRoom
      confirmDeleteRoom() {
        deleteRoom(this.deleteForm.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.deleteDialogVisible = false
          this.getRoomList()
        })
      },
      // 处理搜索
      handleSearch() {
        // 调用后端 API，将搜索文本传递给后端进行处理，得到符合条件的房间列表
        searchRoomList({ searchText: this.searchText }).then(res => {
          this.roomList = res.data;
        });
      },
      // 获取房间列表
      getRoomList() {
        getRoomList().then(response => {
          this.roomList = response.data
        })
      },
      // 获取房间类型列表
      getRoomTypes() {
        // TODO: 从后端获取房间类型列表
        getRoomTypes().then(response => {
          this.roomTypes = response.data
        })
      },
      // 添加房间
      addRoom() {
        this.$refs.form.validate(valid => {
          if (valid) {
            addRoom(this.form).then(() => {
              this.$message.success('添加成功')
              this.addDialogVisible = false
              this.getRoomList()
            })
          }
        })
      },
      // 编辑房间
      updateRoom() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            updateRoom(this.editForm.id, this.editForm).then(() => {
              this.$message.success('修改成功')
              this.editDialogVisible = false
              this.getRoomList()
            })
          }
        })
      },
      // 删除房间
      deleteRoom() {
        deleteRoom(this.deleteForm.id).then(() => {
          this.$message.success('删除成功')
          this.deleteDialogVisible = false
          this.getRoomList()
        })
      }
    }
  }
</script>

<style>
.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.room-table {
  border-radius: 4px;
}
.dashboard-text {
  display: flex !important;
  margin-bottom: 10px !important;
}
.input {
  margin-bottom: 15px;
}
</style>
