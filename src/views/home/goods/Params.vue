<template>
  <div class="params">
    <Breadcrumb :path-obj="{path: 'goods', detail: '商品管理', detailInfo: '分类参数'}"/>
    <!--搜索框-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-alert show-icon title="注意：只允许第三极分类设置相关参数" type="warning" :closable="false"/>
        </el-col>
      </el-row>
      <el-form label-position="right" label-width="110px" style="margin: 30px 0px 0px 0px">
        <el-form-item label="请选择商品分类">
          <el-cascader
            v-model="value"
            :options="options"
            :props="props"
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" type="primary" :disabled="isDisable" @click="openAdd()" style="margin: auto">添加动态参数</el-button>
          <el-table
            border
            stripe
            :data="manyTableData"
            style="width: 80%;">
            <el-table-column type="index"/>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  :key="tag"
                  v-for="tag in props.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(props.row.index,props.row)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name">
            </el-table-column>
            <el-table-column
              label="操作"
              prop="name">
              <template slot-scope="scope">
                <el-button size="mini" @click="editParam(scope.row)" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" @click="delParam(scope.row.attr_id)" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button size="mini" type="primary" :disabled="isDisable" @click="openAdd()" style="margin: auto">添加静态参数</el-button>
          <el-table
            border
            stripe
            :data="onlyTableData"
            style="width: 80%;">
            <el-table-column type="index"/>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  :key="tag"
                  v-for="tag in props.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(props.row.index,props.row)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name">
            </el-table-column>
            <el-table-column
              label="操作"
              prop="name">
              <template slot-scope="scope">
                <el-button size="mini" @click="editParam(scope.row)" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" @click="delParam(scope.row.attr_id)" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog :title="titleTxt  + titleText + '参数'" :visible.sync="addDialogVisible" width="30%" :before-close="addHandleClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText + '参数'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="quxiao">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from "../../../components/Breadcrumb";
  export default {
    name: "Params",
    data() {
      return {
        tableData: [],
        addDialogVisible: false,
        titleTxt: '添加',
        cateList: [],
        value: [],
        cateId: '',
        activeName: 'many',
        manyTableData: [],
        onlyTableData: [],
        options: [],
        props: {
          label: 'cat_name',
          value: 'cat_id',
          expandTrigger: 'hover',
        },
        addForm: {
          attr_name: ''
        },
        editForm: {

        },
        // 添加非空验证
        addFormRules:{
          attr_name:[
            {required:true,$message:'请输入参数名称', trigger:'blur'}
          ]
        },
      }
    },
    methods: {
      handleChange(value) {
        this.cateId = value[value.length - 1];
        this.refresh();
      },
      handleClick(tab, event) {
        this.refresh();
      },
      openAdd() {
        this.titleTxt = '添加'
        this.addDialogVisible = true
      },
      editParam(row) {
        this.titleTxt = '修改'
        this.addDialogVisible = true
        this.addForm.attr_name = row.attr_name
        this.editForm = row
      },
      delParam(id) {
        this.$confirm('确定删除？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(_ => {
          this.$axios.delete(`categories/${this.cateId}/attributes/${id}`).then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success(res.data.meta.msg)
            this.refresh();
          })
        }).catch(_ => {
          this.$message.info('取消删除')
        })
      },
      handleClose(i,row) {
        //删除页面数据
        row.attr_vals.splice(i,1)
        this.saveAttrVals(row)
      },

      showInput(row) {
        row.inputVisible = true;
        //等待DOM加载完成执行的函数 $nextTick
        this.$nextTick(item => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
      },

      handleInputConfirm(row) {
        row.inputVisible = false;
        //处理空格不提交
        if (row.inputValue.trim().length === 0) {
          row.inputVisible = false;
          row.inputValue = '';
          return
        }
        row.attr_vals.push(row.inputValue.trim())
        row.inputVisible = false;
        row.inputValue = '';
        this.saveAttrVals(row);
      },
      async saveAttrVals(row) {
        const{ data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
            attr_name:row.attr_name,
            attr_sel:row.attr_sel,
            attr_vals:row.attr_vals.join(',')
          }
        )
        console.log(res)
        this.$message.success(res.meta.msg)
      },

      //dialog
      addHandleClose() {
        this.$refs.addFormRef.resetFields()
        this.addDialogVisible = false
      },
      addParams() {
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return;
          if (this.titleTxt === '添加') {
            const{ data : res } = await this.$axios.post(`categories/${this.cateId}/attributes`, {
                attr_name: this.addForm.attr_name,
                attr_sel: this.activeName
            })
            if(res.meta.status !==201){
              return this.$message.error('添加参数失败')
            }
            this.$message.success('添加参数成功')
            this.$refs.addFormRef.resetFields()
          } else {
            const { data : res } = await this.$axios.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
              attr_name : this.addForm.attr_name,
              attr_sel:this.activeName,
              attr_vals:this.editForm.attr_vals.join(',')
            })
            console.log(res)
            this.$message.success('修改成功')
          }
          this.addDialogVisible = false;
          this.refresh();
        })
      },
      quxiao() {
        this.$refs.addFormRef.resetFields()
        this.addDialogVisible = false
      },
      async refresh() {
        const { data : res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName }
        })
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.inputVisible = false
          item.inputValue = ''
        })

        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }
    },
    computed: {
      isDisable() {
        return this.value.length > 0 ? false : true
      },
      titleText() {
        return this.activeName === 'many' ? '动态' : '静态'
      }
    },
    created() {
      this.$axios.get('categories').then(res => {
        this.options = res.data.data
      })
    },
    components: {
      Breadcrumb
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-alert--warning.is-light {
    padding: 30px;
  }
  /deep/ .el-table .el-table__cell{
    padding: 12px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>