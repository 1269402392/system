<template>
  <div class="params">
    <json-viewer
      :value="cateList"
      :expand-depth=1
      copyable
    ></json-viewer>
  </div>
</template>

<script>

  export default {
    name: "UtilShowJson",
    data() {
      return {
        cateList: [],
        page: {
          total: '',
          pageInfo: {
            query: '',
            pagenum: 1,
            pagesize: 10
          }
        }
      }
    },
    created() {
      this.$axios.get('orders',{params: this.page.pageInfo}).then(res => {
        this.cateList = res.data.data.goods
      })
      // this.$axios.get('categories').then(res => {
      //   console.log(res)
      //   this.cateList = res.data.data
      // })
    }
  }
</script>

<style scoped>

</style>