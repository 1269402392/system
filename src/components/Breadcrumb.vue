<template>
  <div class="control">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a :to="pathObj.path">{{pathObj.detail}}</a></el-breadcrumb-item>
      <el-breadcrumb-item>{{pathObj.detailInfo}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "Breadcrumb",
    props:{
      pathObj: {
        type: Object,
      }
    }
  }
</script>

<style scoped>

</style>