<template>
  <div class="categories">
    <Breadcrumb :path-obj="{path: 'users', detail: '商品管理', detailInfo: '商品分类'}"/>
    <!--添加按钮-->
    <el-card class="card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="openAdd()" plain>添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--表格-->
    <zk-table
      ref="table"
      :data="data"
      empty-text="系统加载中"
      :selection-type="false"
      :expand-type="false"
      :columns="columns">
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success"
           v-if="scope.row.cat_deleted === false"
           style="color: green"></i>
        <i class="el-icon-error" v-else style="color: red"></i>
      </template>
      <template
        slot="tag"
        scope="scope">
        <el-tag
          size="mini"
          v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag
          type="success"
          size="mini"
          v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag
          type="warning"
          size="mini"
          v-else>三级</el-tag>
      </template>
      <template slot-scope="scope" slot="likes">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini" @click="editCate(scope.row)">编辑</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini" @click="delClick(scope.row)">删除</el-button>
      </template>
    </zk-table>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[3, 8, 10, 15, 30]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    <!--添加弹出框-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form label-position="right" label-width="80px" :model="cateObj">
        <el-form-item label="分类名称">
          <el-input v-model="cateObj.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="value"
            :disabled="isDisable"
            :options="options"
            :props="props"
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="submitCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import Breadcrumb from "../../../components/Breadcrumb";
  export default {
    name: "Categories",
    data() {
      return {
        title: '添加',
        isDisable: false,
        value: [],
        data: [],
        columns: [
          //表格列数据
          {
            label: '分类名称',
            prop: 'cat_name',
            width: '400px',
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
            minWidth: '50px',
            type: 'template',
            template: 'isok',
          },
          {
            type: 'template',
            template: 'tag',
            label: '排序',
            prop: 'cat_level',
          },
          {
            label: '操作',
            prop: 'likes',
            minWidth: '200px',
            type: 'template',
            template: 'likes',
          },
        ],
        dialogVisible: false,
        props: {
          label: 'cat_name',
          value: 'cat_id',
          expandTrigger: 'hover',
          checkStrictly: true,
        },
        cateObj: {
          cat_name: '',
          cat_id: '',
          cat_level: 0, //level id
          cat_pid: 0, //father id
        },
        options: [],
        page: {
          total: 0,
          pageIndex: 1,
          pageInfo: {
            type: '',
            pagenum: 1,
            pagesize: 2
          }
        }
      };
    },
    methods: {
      handleSizeChange(num) {
        this.page.pageInfo.pagesize = num;
        this.refresh();
      },
      handleCurrentChange(num) {
        this.page.pageInfo.pagenum = num;
        this.refresh();
      },
      handleClose() {
        this.dialogVisible = false;
        this.value = []
        this.cateObj.cat_name = ''
      },
      async editCate(row) {
        this.value = []
        this.title = '修改';
        this.isDisable = true
        const { data : res } = await this.$axios.get(`categories`,{params: {type: '2'}})
        this.options = res.data
        this.cateObj.cat_name = row.cat_name //赋值 new name
        this.cateObj.cat_id = row.cat_id // 赋值 id
        if (row.cat_level === 1) {
          const { data : pid } = await this.$axios.get(`categories/${row.cat_id}`)
          this.value.push(pid.data.cat_pid)
        } else if(row.cat_level === 2) {
          const { data : pid } = await this.$axios.get(`categories/${row.cat_pid}`)
          this.value = [pid.data.cat_pid, pid.data.cat_id]
        }
        this.dialogVisible = true;
      },
      delClick(row) {
        this.$confirm('确认删除此分类?','提示',{
          cancelButtonText: '取消',
          confirmButtonText: '确认',
        }).then(() => {
          this.$axios.delete(`categories/${row.cat_id}`).then(res => {
            if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg);
            this.$message.success(res.data.meta.msg);
            this.refresh();
          })
        }).catch(() => {
          this.$message.info('已取消删除')
          return false
        })
      },
      submitCate() {
        if (this.title !== "修改") {
          this.$axios.post('categories',this.cateObj).then(res => {
            if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg);
            this.$message.success(res.data.meta.msg);
          })
        } else {
          this.$axios.put(`categories/${this.cateObj.cat_id}`,{ cat_name: this.cateObj.cat_name }).then(res => {
            if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg);
            this.$message.success(res.data.meta.msg);
          })
        }
        this.refresh();
        this.handleClose();
      },
      //select下拉多选框改变时
      async handleChange(value) {
        let length = value.length
        this.cateObj.cat_level = length
        //判断并取出父Id(value -> array)
        if (length === 1) {
          this.cateObj.cat_pid = value[0]
        } else if(length === 2) {
          this.cateObj.cat_pid = value[length - 1]
        } else {
          this.cateObj.cat_pid = 0
          this.cateObj.cat_level = 0
        }
      },
      async openAdd() {
        this.title = '新增'
        this.dialogVisible = true;
        this.isDisable = false
        this.value = []
        this.cateObj.cat_name = ''
        let { data : res } = await this.$axios.get('categories', {
          params: {
            type: '2'
          }
        })
        this.options = res.data
      },
      refresh() {
        setTimeout(async () => {
          const { data : res } = await this.$axios.get('categories',{ params: this.page.pageInfo })
          if (res.meta.status !== 200) return this.$message.error('系统异常')
          this.data = res.data.result
          this.page.total = res.data.total
        }, 300)
      },
    },
    async created() {
      const { data : res } = await this.$axios.get('categories',{ params: this.page.pageInfo })
      if (res.meta.status !== 200) return this.$message.error('系统异常')
      this.$message.success(res.meta.msg);
      this.data = res.data.result
      this.page.total = res.data.total
    },
    components: {
      Breadcrumb
    }
  }
</script>

<style scoped>
  .card{
    margin-bottom: 30px;
  }
</style>