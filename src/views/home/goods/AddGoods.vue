<template>
  <div class="add-goods">
    <Breadcrumb :path-obj="{path: 'goods', detail: '商品管理', detailInfo: '添加商品'}"/>
    <div>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <!--顶部状态条-->
      <el-steps :space="400" :active="parseInt(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="goodsObj"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
        class="demo-ruleForm">
        <!--表单区-->
          <el-tabs
            v-model="activeIndex"
            :before-leave="beforeLeave"
            tab-position="left"
            @tab-click="tabClick">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="goodsObj.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="goodsObj.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="goodsObj.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="goodsObj.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <el-cascader
                  v-model="goodsObj.goods_cat"
                  :options="catList"
                  :props="catProps"></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name" v-for="(item, index) in manyTableData" :key="index">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="cb" v-for="(cb, indez) in item.attr_vals" :key="indez" border/>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="(item, index) in onlyTableData" :key="index">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture"
                :headers="headerObj">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品描述" name="4">
              <el-input type="textarea" v-model="goodsObj.goods_introduce" rows="6"></el-input>
              <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
      </el-form>
    </div>
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleBefore">
      <img :src="previewUrl" style="width: 100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import Breadcrumb from "../../../components/Breadcrumb";
  export default {
    name: "AddGoods",
    data() {
      return {
        isAttrs: false,
        manyTableData: [],
        onlyTableData: [],
        previewUrl: '',
        dialogVisible: false,
        activeIndex: 0,
        catList: [],
        previewPath: '',
        previewVisible:false,
        uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
        headerObj:{ Authorization:localStorage.getItem('token') },
        catProps:{
          label:'cat_name',
          value:'cat_id',
          expandTrigger: 'hover'
        },
        goodsObj: {
          goods_name: '',
          goods_cat: [],
          goods_price: '',
          goods_number: '',
          goods_weight: '',
          goods_introduce: '',
          pics: [],
          attrs: []
        },
        rules: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],

        }
      }
    },
    methods: {
      handleBefore(){
        this.dialogVisible = false
      },
      handlePreview(file) {
        this.previewUrl = file.response.data.url
        this.dialogVisible = true
      },
      handleRemove(file) {
        this.goodsObj.pics.forEach((item, index) => {
          if (item.tmp_path.indexOf(file.response.data.tmp_path) !== -1) {
            this.goodsObj.pics.splice(index, 1)
          }
        })
      },
      handleSuccess(response) {
        if(response.data.tmp_path) {
          this.goodsObj.pics.push({ pic: response.data.tmp_path})
          this.$message.success('上传图片成功')
        }

      },
      async tabClick(val) {
        if (!this.isAttrs) return
        if (val.index === '1') {
          const { data : res } = await this.$axios.get(`categories/${this.goodsObj.goods_cat[2]}/attributes`,{
            params: { sel: 'many'}
          })
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          this.manyTableData = res.data
        } else if (val.index === '2') {
          const { data : res } = await this.$axios.get(`categories/${this.goodsObj.goods_cat[2]}/attributes`,{
            params: { sel: 'only'}
          })
          this.onlyTableData = res.data
        }
      },
      beforeLeave(activeName, oldActiveName) {
        if(oldActiveName === '0' && this.goodsObj.goods_cat.length !== 3){
          this.$message.error('请先选择商品分类')
          this.isAttrs = false;
          return false
        } else {
          this.isAttrs = true;
        }
      },
      addGoods() {
        this.$refs.ruleForm.validate(async valid=>{
          if(!valid){
            return this.$message.error('请填写必要的表单项!')
          }

          this.goodsObj.goods_cat = this.goodsObj.goods_cat.join(',')

          this.manyTableData.forEach(item => {
            this.goodsObj.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            })
          })

          this.onlyTableData.forEach(item => {
            this.goodsObj.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            })
          })

          const { data : res } = await this.$axios.post('goods',this.goodsObj)

          if(res.meta.status !== 201){
            return this.$message.error('添加商品失败!')
          }

          this.$message.success('添加商品成功!')
          this.$router.push('/goods')
        })
      },

    },
    created() {
      this.$axios.get('categories').then(res => {
        this.catList = res.data.data
        // console.log(this.catList)
      })
    },
    components: {
      Breadcrumb
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-alert{
    margin-bottom: 30px;
  }
  /deep/ .el-steps{
    margin-bottom: 40px;
  }
  .btnAdd{
    margin-top: 20px;
  }
  /*.box-card{*/
  /*  display: flex;*/
  /*}*/
</style>