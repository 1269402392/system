<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/img/logo.png" alt="">
      </div>
      <!--登陆表单-->
      <el-form :model="loginForm" :rules="rules" ref="ruleForm" label-width="100px" class="login-form">
        <el-form-item label="账号" prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="loginClick('ruleForm')">登陆</el-button>
          <el-button type="info" @click="resetLoginForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
   </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: '',
          password:  ''
        },
        rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],

        }
      };
    },
    methods: {
       loginClick(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let  {data : res} = await this.$axios.post('login',this.loginForm)
            if (res.meta.status !== 200) return this.$message.error('登陆失败')

            localStorage.token = res.data.token

            this.$message.success('登陆成功')
            this.$router.push('/users')
          }
        });
      },
      resetLoginForm(formName) {
        this.$refs[formName].resetFields();
      }
    },

  }
</script>

<style lang="less" scoped>
  .login-container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar-box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>