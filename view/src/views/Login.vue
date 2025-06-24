<template>
  <div class="login-container">
    <a-card :title="t('login.title')" class="login-box">
      <a-form :model="formState" @finish="handleSubmit" layout="vertical">
        <a-form-item :label="t('login.username')" name="username" :rules="[{ required: true, message: t('register.usernameRequired') }]">
          <a-input v-model:value="formState.username" :placeholder="t('login.username')">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item :label="t('login.password')" name="password" :rules="[{ required: true, message: t('register.passwordRequired') }]">
          <a-input-password v-model:value="formState.password" :placeholder="t('login.password')">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        <!-- 验证码 -->
        <a-form-item :label="t('login.verificationCode')" required name="captcha" v-if="captchaShow">
          <Captcha v-model:value="formState.captcha" v-model:captchaId="formState.captchaId" />
        </a-form-item>
        <a-form-item class="sin">
          <a-button
            type="primary"
            html-type="submit"
            :block="!userStore.config?.site?.register"
            :disabled="isSubmitDisabled"
          >
            {{ t('login.loginButton') }}
          </a-button>          <a-button @click="router.push('/register')" v-if="userStore.config?.site?.register">{{ t('common.register') }}</a-button>
          <a-button @click="router.push('/reset-password')">{{ t('login.forgotPassword') }}</a-button>
        </a-form-item>
        <template v-if="userStore?.config?.oauth?.enabled">
          <a-divider
            v-if="
              userStore?.config?.oauth?.github?.enabled ||
              userStore?.config?.oauth?.google?.enabled ||
              userStore?.config?.oauth?.linuxdo?.enabled
            "
          >
            {{ t('common.or') }}
          </a-divider>
          <a-button @click="handleBind('github')" v-if="userStore?.config?.oauth?.github?.enabled">
            <GithubOutlined />
            GitHub
          </a-button>
          <a-button @click="handleBind('google')" v-if="userStore?.config?.oauth?.google?.enabled">
            <GoogleOutlined />
            Google
          </a-button>
          <a-button @click="handleBind('linuxdo')" v-if="userStore?.config?.oauth?.linuxdo?.enabled">
            <span class="anticon">
              <img class="linuxdo" :src="LinuxdoOutlined" />
            </span>
            Linux Do
          </a-button>
        </template>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>  import { reactive, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { message } from 'ant-design-vue'
  import Captcha from '@/components/Captcha.vue'
  import axios from '@/stores/axios'
  import { UserOutlined, LockOutlined, GithubOutlined, GoogleOutlined } from '@ant-design/icons-vue'
  import LinuxdoOutlined from '@/assets/linuxdo.svg'
  import { t } from '@/locales'

  const router = useRouter()
  const userStore = useUserStore()
  const captchaShow = computed(() => userStore?.config?.site?.captcha)
  const formState = reactive({
    username: '',
    password: '',
    captcha: false,
    captchaId: ''
  })

  // 计算属性判断是否禁用提交按钮
  const isSubmitDisabled = computed(() => {
    let disabled = !formState.username || !formState.password
    if (captchaShow.value) {
      disabled = disabled || !formState.captcha || !formState.captchaId
    }
    return disabled
  })

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post('/api/auth/login', {
        username: formState.username,
        password: formState.password,
        captchaId: formState.captchaId
      })
      userStore.token = data.token
      userStore.user = data.user
      router.push('/')
      message.success('登录成功')
    } catch ({ response }) {
      message.error(response?.data?.error || '登录失败')
    }
  }

  const handleBind = type => {
    const { oauth, site } = userStore?.config
    if (!oauth.enabled) {
      message.error('社会化登录功能未启用')
      return
    }
    if (!oauth[type]?.enabled) {
      message.error(`${type}登录功能未启用`)
      return
    }
    location.href = `${site.url}/oauth/${type}?redirectUrl=${encodeURIComponent(location.href)}`
  }
</script>

<style scoped>
  .login-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f2f5;
  }

  .login-box {
    width: 100%;
    max-width: 400px;
  }

  .sin {
    display: flex;
    justify-content: flex-end;
  }

  .ant-btn {
    margin-left: 10px;
  }

  .linuxdo {
    width: 14px;
  }

  @media screen and (max-width: 768px) {
    .login-box {
      width: 370px;
    }

    .ant-btn {
      margin-left: 5px;
    }
  }
</style>
