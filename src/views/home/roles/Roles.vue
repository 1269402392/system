<template>
  <div class="roles">
    <Breadcrumb :path-obj="{path: 'roles', detail: '权限管理', detailInfo: '角色列表'}"/>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" @click="insertBtn">新增按钮</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table
      :data="roleList"
      style="width: 100%">
      <el-table-column  type="expand">
        <template slot-scope="props">
          <el-row
            class="vcenter"
            :class="index == 0 ?'':'bdtop'"
            v-for="(level1,index) in props.row.children"
            :key="level1.id">
            <el-col :span="5">
              <el-tag>{{ level1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row
                class="vcenter"
                :gutter="20"
                v-for="level2 in level1.children"
                :key="level2.id">
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="removeRightById(props.row,level2.id)">{{ level2.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="6">
                  <el-tag
                    type="warning"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    closable
                    @close="removeRightById(props.row,level3.id)">{{ level3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"/>
      <el-table-column
        label=""
        prop="id">
      </el-table-column>
      <el-table-column
        label="角色描述"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="操作描述"
        prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editClick(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" @click="delBtn(scope.row)" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button type="warning" @click="limits(scope.row)" size="mini" icon="el-icon-setting">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增弹出框-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="InsertHandleClose">
      <el-form :model="roleObj" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色描述" prop="roleName">
          <el-input v-model="roleObj.roleName"></el-input>
        </el-form-item>
        <el-form-item label="操作描述" prop="roleDesc">
          <el-input v-model="roleObj.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('ruleForm')">重置</el-button>
       <el-button type="primary" @click="immediately('ruleForm')">确定</el-button>
      </span>
    </el-dialog>
    <!--修改弹出框-->
    <el-dialog
      title="分配权限"
      :visible.sync="editDialog"
      width="30%"
      :before-close="handleClose">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        ref="treeRef"
        :default-checked-keys="itemRoleList"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取消</el-button>
       <el-button type="primary" @click="editRole()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from "components/Breadcrumb";
  export default {
    name: "Roles",
    data() {
      return {
        data: [],//每个角色所拥有权限
        itemRoleList: [], //每个角色拥有的权限
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        roleList: [],
        title: '',
        editDialog: false,
        isInsert: true,
        roleObj: {
          id: '',
          roleName: '',
          roleDesc: ''
        },
        dialogVisible: false,
        rules: {
          roleName: [
            { required: true, message: '请输入角色名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入操作描述', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      insertBtn() {
        this.title = '新增角色';
        this.dialogVisible = true;
      },
      editClick(row) {
        this.title = '修改角色'
        this.isInsert = false;
        this.roleObj.id = row.id;
        this.roleObj.roleName = row.roleName;
        this.roleObj.roleDesc = row.roleDesc;
        this.dialogVisible = true;
      },
      immediately(ruleForm) {
        this.$refs[ruleForm].validate(async (valid) => {
          if (valid) {
            if (this.isInsert) {
              const { data : res } = await this.$axios.post('roles',this.roleObj)
              if (res.meta.status !== 201) return this.$message.error('创建角色失败');
              this.$message.success('创建成功');
            } else {
              const { data : rea } = await this.$axios.put('roles/' + this.roleObj.id,this.roleObj)
              if (rea.meta.status !== 200) return this.$message.error('修改角色失败');
              this.$message.success('修改成功');
            }
            this.refresh();
            this.dialogVisible = false;
          } else {
            return false;
          }
        })

      },
      resetForm(ruleForm) {
        this.$refs[ruleForm].resetFields();
      },
      refresh() {
        this.$axios.get('roles').then(res => {
          this.roleList = res.data.data
        })
      },
      delBtn(row) {
        this.$confirm('确定删除该角色','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data : res } = await this.$axios.delete(`roles/${row.id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败');
          this.$message.success('删除成功');
          this.refresh();
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },
      async limits(row) {
        this.editDialog = true;
        const { data : tree } = await this.$axios.get(`rights/tree`)
        this.data = tree.data
        this.roleObj.id = row.id
        for (let item1 of row.children) {
          for (let item2 of item1.children) {
            for (let item3 of item2.children) {
              this.itemRoleList.push(item3.id)
            }
          }
        }
        console.log(this.itemRoleList)
      },
      handleClose(done) {
        this.itemRoleList = []
        done();
      },
      InsertHandleClose(){
        for (let item in this.roleObj) {
          this.roleObj[item] = ''
        }
        this.dialogVisible = false
      },
      async editRole() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ];
        let idStr = keys.join(",");
        const { data: res } = await this.$axios.post(`roles/${this.roleObj.id}/rights`, { rids: idStr });
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
        this.editDialog = false;
        this.refresh()
      },
      removeRightById(role,id){
        this.$confirm('确定删除，是否继续？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(async () => {
          let { data : res } = await this.$axios.delete("roles/"+role.id+"/rights/"+id);
          role.children =res.data
        }).catch(()=>{
          this.$message.info('已取消删除')
        });
      }
    },
    components: {
      Breadcrumb
    },
    created() {
      this.refresh();
    }
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
</style>