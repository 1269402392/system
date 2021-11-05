<template>
  <div class="rights">
    <el-table
      :data="roleList"
      class="table"
      border
      stripe
      style="width: 100%">
      <el-table-column type="index"/>
      <el-table-column
        prop="id"
        label="id">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限说明">
      </el-table-column>
      <el-table-column
        prop="path"
        label="访问路径">
      </el-table-column>
      <el-table-column
        prop="pid"
        label="权限父ID">
      </el-table-column>
      <el-table-column
        prop="level"
        label="权限层级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level == 0">层级一</el-tag>
          <el-tag type="success" v-else-if="scope.row.level == 1 ">层级二</el-tag>
          <el-tag type="warning" v-else>层级三</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "Rights",
    data() {
      return {
        roleList: []
      }
    },
    async created() {
      const { data : res } = await this.$axios.get(`rights/list`)
      this.roleList = res.data
      console.log(this.roleList)
    }
  }
</script>

<style lang="less" scoped>
  /ddep/ td div{
    text-align: center;
  }
</style>