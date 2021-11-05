<template>
  <div class="">
    <div style="width:80%;height:400px;" id="main"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import _ from 'lodash'
  export default {
    data() {
      return {
        options: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          }
        }
      }
    },
    async mounted(){
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      const { data : res } = await this.$axios.get('reports/type/1')
      if(res.meta.status !== 200){
        return this.$message.error('获取折现图失败!')
      }
      //merge合并属性
      let result = _.merge(res.data, this.options)
      myChart.setOption(result);
    }
  }
</script>

<style>

</style>