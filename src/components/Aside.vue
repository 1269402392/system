<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    background-color="#373d41"
    text-color="#fff"
    :unique-opened="true"
    router
    active-text-color="#409EFF">
    <el-submenu v-for="(item, index) in menuList" :key="index" :index="index + ''">
      <template slot="title">
        <i :class="iconObj[item.id]"></i>
        <span>{{item.authName}}</span>
      </template>
      <el-menu-item-group v-for="(option, indez) in item.children" :key="indez">
        <el-menu-item :index="option.path + ''">{{option.authName}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: "Aside",
    props: ['menuList'],
    data() {
      return {
        iconObj: {
          '125': 'el-icon-user',
          '103': 'el-icon-setting',
          '101': 'el-icon-goods',
          '102': 'el-icon-help',
          '145': 'el-icon-search',
        }
      }
    }
  }
</script>

<style scoped>

</style>