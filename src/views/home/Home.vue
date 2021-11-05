<template>
  <div class="home">
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-container>
        <!--侧边导航栏-->
        <el-aside width="200px">
          <Aside :menuList="menuList"/>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "../../components/Aside";
import Header from "../../components/Header";
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
    }
  },
  components: {
    Aside,
    Header
  },
  methods: {

  },
  created() {
    this.$axios.get('menus').then(res => {
      this.menuList = res.data.data
    })
  }
}
</script>

<style lang="less" scoped>
  .home,.el-container {
    height: 100%;
    .el-header, .el-footer {
      background-color: #B3C0D1;
      color: #333;
      text-align: center;
      line-height: 60px;
    }
    .el-header {

    }
    .el-aside {
      background-color: #D3DCE6;
      color: #333;
      text-align: center;
      line-height: 200px;
    }

    .el-main {

    }
  }



</style>
