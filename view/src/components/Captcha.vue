<template>
  <div class="drag-verify">
    <div class="range" :class="verifyResult ? 'success' : ''">
      <div class="block" @mousedown="onStart" @touchstart.passive="onStart">
        <span>
          <CheckCircleOutlined v-if="verifyResult" />
          <DoubleRightOutlined v-else />
        </span>
      </div>
      <span class="text" v-if="verifyResult">
        <UnlockOutlined />
        {{ successText }}
      </span>
      <span class="text" v-else>
        <LockOutlined />
        {{ startText }}
      </span>
    </div>
  </div>
</template>

<script setup>  import { ref, onMounted } from 'vue'
  import { CheckCircleOutlined, DoubleRightOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons-vue'
  import axios from '@/stores/axios'
  import { message } from 'ant-design-vue'
  import { t } from '@/locales'

  defineOptions({
    name: 'Captcha'
  })

  const emit = defineEmits(['update:value', 'verify-success', 'update:captchaId'])

  const props = defineProps({
    value: {
      type: Boolean,
      default: false
    },    // 成功文字
    successText: {
      type: String,
      default: () => t('captcha.success')
    },
    // 开始的文字
    startText: {
      type: String,
      default: () => t('captcha.slide')
    }
  })

  const verifyResult = ref(false) // 验证结果
  const captchaId = ref(null)
  const isTouch = 'ontouchstart' in document.documentElement
  const moveEvent = isTouch ? 'touchmove' : 'mousemove'
  const upEvent = isTouch ? 'touchend' : 'mouseup'

  // 生成验证
  const generateCaptcha = async () => {
    try {
      const { data } = await axios.post('/api/auth/captcha/generate')
      captchaId.value = data.captchaId
      emit('update:captchaId', data.captchaId)
    } catch ({ response }) {
      message.error(response?.data?.error)
    }
  }

  // 验证结果
  const verifyCaptcha = async () => {
    if (!captchaId.value) {
      // 如果没有 captchaId,先生成一个
      await generateCaptcha()
    }
    try {
      const { data } = await axios.post('/api/auth/captcha/verify', {
        captchaId: captchaId.value,
        verifyResult: true
      })
      if (data.isValid) {
        verifyResult.value = true
        emit('update:value', true)
        emit('verify-success')
      } else {
        message.error('验证失败')
        resetCaptcha()
      }
    } catch ({ response }) {
      message.error(response?.data?.error)
      resetCaptcha()
    }
  }

  // 重置验证
  const resetCaptcha = () => {
    verifyResult.value = false
    emit('update:value', false)
    captchaId.value = null
    emit('update:captchaId', null)
  }

  // 滑块触摸开始
  const onStart = ev => {
    let disX = 0 // 滑块移动距离
    const iconWidth = 40 // 滑动图标宽度
    const ele = document.querySelector('.drag-verify .block')
    const startX = ev.clientX || ev.touches[0].pageX
    const parentWidth = ele.offsetWidth
    const MaxX = parentWidth - iconWidth
    if (verifyResult.value) return false
    // 滑块触摸移动
    const onMove = e => {
      const endX = e.clientX || e.touches[0].pageX
      disX = endX - startX
      if (disX <= 0) disX = 0
      if (disX >= MaxX - iconWidth) disX = MaxX
      ele.style.transition = '.1s all'
      ele.style.transform = `translate3d(${disX}px, 0, 0)`
    }
    // 滑块触摸结束
    const onEnd = () => {
      if (disX !== MaxX) {
        ele.style.transition = '.5s all'
        ele.style.transform = 'translate3d(0, 0, 0)'
      } else {
        verifyCaptcha()
      }
      document.removeEventListener(moveEvent, onMove)
      document.removeEventListener(upEvent, onEnd)
    }
    // 添加 passive 选项
    document.addEventListener(moveEvent, onMove)
    document.addEventListener(upEvent, onEnd)
  }
</script>

<style scoped>
  .drag-verify {
    width: 100%;
  }

  .drag-verify .range {
    background-color: #ececee;
    position: relative;
    border-radius: 4px;
    transition: 1s all;
    user-select: none;
    color: #666;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    border: #d9d9d9 solid 1px;
  }

  .drag-verify .range.success {
    background-color: rgb(118, 198, 29);
    color: #fff;
  }

  .drag-verify .range.success .text {
    position: relative;
    z-index: 1;
  }

  .drag-verify .range.success .block span {
    color: rgb(118, 198, 29);
  }

  .drag-verify .range .block {
    display: block;
    position: absolute;
    left: calc(-100% + 40px);
    width: 100%;
    height: 100%;
    background: rgb(118, 198, 29);
    overflow: hidden;
    border-radius: 0 4px 4px 0;
  }

  .drag-verify .range .block span {
    position: absolute;
    right: 0;
    width: 40px;
    height: 100%;
    font-size: 20px;
    color: #c8c9cc;
    background-color: #fff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 4px 4px 0;
  }
</style>
