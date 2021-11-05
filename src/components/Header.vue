<template>
  <div class="header">
    <div class="img-txt">
      <img src="~assets/img/heima.png" alt="">
      <h3>电商后台管理系统</h3>
    </div>
    <el-button @click="back" type="info">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Header",
    methods: {
      back() {
        localStorage.removeItem('token')
        this.$router.replace('/login');
      }
    }
  }
</script>

<style lang="less" scoped>
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .img-txt{
      display: flex;
      align-items: center;
      img{
        width: 50px;
        height: 50px;
      }
      h3{
        margin-left: 15px;
      }
    }
    .el-button{
      height: 45px;
      padding: 0 30px;
    }
  }
</style>