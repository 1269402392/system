<template>
  <div class="users">
    <Breadcrumb :path-obj="{path: 'users', detail: '用户管理', detailInfo: '用户列表'}"/>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" @clear="refresh()" v-model="searchValue" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openAdd()" plain>添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--List-->
    <el-table
      :data="userList"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label=""
        width="90">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            @change="show(scope.row)"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" size="mini" @click="showRole(scope.row)">分配</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[5,2]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    <!--新增弹出框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :rules="rules" ref="ruleForm" label-width="80px" :model="user">
        <el-form-item prop="username" label="用户名称">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="用户密码">
          <el-input v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="user.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="enterBtn('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改弹出框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialog"
      width="30%">
      <el-form :rules="rules" ref="ruleForm" label-width="80px" :model="user">
        <el-form-item prop="username" label="用户名称">
          <el-input disabled v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="user.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="enterBtn('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色-->
    <el-dialog
      title='分配角色'
      :visible.sync="roleDialog"
      width="30%">
      <div class="show-role-box">
        <p>当前的用户 : {{roleUser.username}}</p>
        <p>当前的角色 : {{roleUser.roleName}}</p>
        <p>
          分配新角色 :
          <el-select v-model="roleUser.roleValue" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
        <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button @click="rolePut" type="primary" >确 定</el-button>
      </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from "components/Breadcrumb";
  export default {
    name: "Users",
    data() {
      let validateEmail = (rule, value, callBack) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if(regEmail.test(value)) {
          callBack()
        } else {
          new callBack(new Error('请输入正确格式'))
        }
      }
      let validateMobile = (rule, value, callBack) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)) {
          callBack()
        } else {
          new callBack(new Error('请输入正确的手机号'))
        }
      }
      return {
        userList: [],
        isAdd: true,//添加 or 修改
        searchValue: '',//搜索参数
        dialogTitle: '添加',
        disable: false,
        page: { //分页相关参数
          total: 0,
          pageInfo: {
            query: '',
            pagenum: 1,
            pagesize: 5,
          },
          currentPage: 1, //去往哪一页
        },
        user: {
          id: '',
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        roleUser: {
          roleValue: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
        },
        roleList: [],
        dialogVisible: false,
        roleDialog: false,
        editDialog: false,
      };
    },
    methods: {
      //切换页面显示多少数据
      handleSizeChange(val) {
        this.page.pageInfo.pagesize = val;
        this.refresh();
      },
      //点击页数
      handleCurrentChange(val) {
        this.page.pageInfo.pagenum = val
        this.refresh();
      },
      //添加用户按钮
      openAdd() {
        let user = this.user
        this.isAdd = true;
        Object.keys(user).forEach(key => user[key] = '');
        this.dialogVisible = true;
      },
      //弹出框确认按钮
      enterBtn(ruleForm) {
        this.$refs[ruleForm].validate(async (valid) => {
          if (valid) {
            if (this.isAdd) {
              let { data : res } = await this.$axios.post('users',this.user)
              if (res.meta.status !== 201) this.$message.error('添加失败');

              this.$message.success('添加成功')
            } else {
              let {email, mobile} = this.user
              this.$axios.put('users/' + this.user.id,{email: email, mobile: mobile}).then(res => {
                if (res.data.meta.status !== 200) this.$message.error('更新失败');

                this.$message.success('更新成功')

              })
            }
            this.handleClose('ruleForm');
            this.refresh();
          } else {
            return false;
          }
        })
      },
      //修改框展示数据
      async handleEdit(row) {
        const { data : res } = await this.$axios.get(`users/${row.id}`)
        this.title = '编辑'
        this.user.id = res.data.id
        this.user.username = res.data.username
        this.user.password = res.data.password
        this.user.email = res.data.email
        this.user.mobile = res.data.mobile
        this.editDialog = true
        this.isAdd = false
      },
      //角色框展示数据
      async showRole(row) {
        const { data : res } = await this.$axios.get(`users/${row.id}`)
        this.roleUser.username = res.data.username;
        this.roleUser.roleName = row.role_name;
        this.roleUser.rid = res.data.rid
        this.roleUser.id = res.data.id

        this.roleDialog = true;
        let { data } = await this.$axios.get('roles')
        this.roleList = data.data

        this.roleValue = row.role_name
      },
      //修改角色提交
      async rolePut() {
        if (!this.roleUser.roleValue) {
          return this.$message.error('请选择要分配的角色！')
        }
        const { data : res } = await this.$axios.put(`users/${parseInt(this.roleUser.id)}/role`, {rid: this.roleUser.roleValue})
        if(res.meta.status !== 200) return this.$message.error('修改角色失败');
        this.$message.success('修改角色成功')
        this.roleDialog = false;
        this.searchValue = '';
        this.refresh();
      },
      //删除角色
      handleDelete(row) {
        this.$confirm('确认删除该用户吗?','提示',{
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete('users/' + row.id).then(res => {
            if (res.data.meta.status !== 200) this.$message.error('删除失败');

            this.$message.success('删除成功')
            this.refresh();
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },
      //根据Id查询角色
      async searchClick() {
        const { data : res } = await this.$axios.get(`users/${this.searchValue}`)
        console.log(res.data)
        this.userList.splice(0)
        this.userList.push(res.data)
      },
      //更新状态
      async show(row) {
        const { data : res } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
        if (res.meta.status !== 200) {
          row.mg_state = !row.mg_state;
          this.$message.error('更新失败');
        }
        this.$message.success('更新成功')
      },
      //关闭并清空表单
      handleClose(ruleForm) {
        this.$refs[ruleForm].resetFields();
        this.dialogVisible = false
        this.editDialog = false
        let user = this.user
        Object.keys(user).forEach(key => user[key] = '');
      },
      //刷新
      refresh() {
        this.$axios.get('users',{
          params: this.page.pageInfo
        }).then(res => {
          console.log(res)
          this.page.total = res.data.data.total
          this.userList = res.data.data.users
        })
      }
    },
    created() {
      this.refresh();
    },
    components: {
      Breadcrumb
    }
  }
</script>

<style lang="less" scoped>
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .show-role-box{
    >*{
      height: 50px;
    }
    .dialog-footer{
      display: block;
      margin-top: 22px;
    }
  }
</style>