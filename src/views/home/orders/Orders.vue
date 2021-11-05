<template>
  <div class="goods">
    <Breadcrumb :path-obj="{path: 'goods', detail: '订单管理', detailInfo: '订单列表'}"/>
    <!--搜索框-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" @clear="refresh()" v-model="page.pageInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="refresh()"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <!--list-->
    <el-table
      :data="goodsList"
      class="table"
      border
      stripe
      style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="280">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="pay_status"
        label="是否付款"
        width="150px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status === '0'" size="small" type="danger">未付款</el-tag>
          <el-tag v-else-if="scope.row.pay_status === '1'" size="small" type="success">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="180px">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间"
        width="180px">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="editGoods(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="delGoods(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[5 ,10 ,15]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
  import Breadcrumb from "../../../components/Breadcrumb";
  // import { formatDate } from '@/utils/utils.js'
  export default {
    name: "Orders",
    data() {
      return {
        goodsList: [],
        page: { //分页相关参数
          total: 0,
          pageInfo: {
            query: '',
            pagenum: 1,
            pagesize: 5,
          },
          currentPage: 1, //去往哪一页
        },
      }
    },
    methods: {
      openAdd() {
        this.$router.push('/addGoods')
      },
      async refresh() {
        let { data : res } = await this.$axios.get('orders',{params: this.page.pageInfo})
        console.log(res);
        this.goodsList = res.data.goods
        this.page.total = res.data.total
      },
      editGoods(row) {
        this.$router.push(`home/editGoods/${row.goods_id}`)
      },
      delGoods(row) {
        this.$confirm('确认删除该商品吗?','提示',{
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let { data : res } = await this.$axios.delete('goods/' + parseInt(row.goods_id));
          if (res.meta.status !== 200) this.$message.error('删除失败');
          this.$message.success('删除成功')
          this.refresh();
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },
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
  /deep/ .el-table td.el-table__cell div {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .index_center{
    text-align: center;
  }
</style>