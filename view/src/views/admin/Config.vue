<template>
  <div class="config-container">
    <a-spin :spinning="loading">
      <a-form :model="formState" layout="vertical" @finish="handleSubmit">
        <a-collapse v-model:activeKey="activeKey" accordion :bordered="false" style="background: #f0f2f5">
          <a-collapse-panel key="1" header="站点设置">
            <a-form-item required label="网站标题">
              <a-input v-model:value="formState.site.title" />
            </a-form-item>
            <a-form-item required label="网站URL">
              <a-input v-model:value="formState.site.url" />
            </a-form-item>
            <a-form-item label="备案号">
              <a-input v-model:value="formState.site.beian" />
            </a-form-item>
            <a-form-item label="HTML代码">
              <a-textarea
                v-model:value="formState.site.html"
                placeholder="支持HTML标签, 支持<style>标签, 支持<script>标签"
                :auto-size="{ minRows: 5 }"
              />
            </a-form-item>
            <a-form-item label="是否开启验证码">
              <a-switch v-model:checked="formState.site.captcha" checked-children="启用" un-checked-children="禁用" />
            </a-form-item>
            <a-form-item label="是否开启API接口文档页面">
              <a-switch v-model:checked="formState.site.api" checked-children="启用" un-checked-children="禁用" />
            </a-form-item>
            <a-form-item label="是否开启图片广场页面">
              <a-switch v-model:checked="formState.site.gallery" checked-children="启用" un-checked-children="禁用" />
            </a-form-item>
            <a-form-item label="是否开启游客上传">
              <a-switch
                v-model:checked="formState.site.anonymousUpload"
                checked-children="启用"
                un-checked-children="禁用"
              />
            </a-form-item>
            <a-form-item label="是否开启注册">
              <a-switch v-model:checked="formState.site.register" checked-children="启用" un-checked-children="禁用" />
            </a-form-item>
            <a-form-item label="是否开启邀请码注册" v-if="formState.site.register">
              <a-switch
                v-model:checked="formState.site.inviteCodeRequired"
                checked-children="启用"
                un-checked-children="禁用"
              />
            </a-form-item>
            <a-form-item label="导航栏顺序">
              <a-select
                v-model:value="formState.site.navigationOrder"
                mode="multiple"
                placeholder="选择导航项"
                style="width: 100%"
              >
                <a-select-option v-for="item in availableNavigationItems" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
              <p>注意: 修改该设置后访问网站根目录时会自动重定向到该设置的第一项</p>
            </a-form-item>
            <a-form-item label="是否开启随机图片">
              <a-switch v-model:checked="formState.site.random" checked-children="启用" un-checked-children="禁用" />
            </a-form-item>
            <template v-if="formState.site.random">
              <a-form-item required label="用作展示随机图片的相册ID">
                <a-input v-model:value="formState.site.randId" />
              </a-form-item>
              <a-form-item label="随机图片API">
                <a-input disabled :value="`${formState.site.url}/api/randImage`" />
              </a-form-item>
            </template>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="SMTP设置">
            <template v-if="formState.site.register">
              <a-form-item label="是否开启邮箱验证">
                <a-switch v-model:checked="formState.smtp.enabled" checked-children="启用" un-checked-children="禁用" />
              </a-form-item>
              <template v-if="formState.smtp.enabled">
                <a-form-item required label="发件人邮箱地址">
                  <a-input v-model:value="formState.smtp.from" placeholder="输入发件人邮箱地址" />
                </a-form-item>
                <a-form-item required label="发件人名称">
                  <a-input v-model:value="formState.smtp.fromName" placeholder="输入发件人名称" />
                </a-form-item>
                <a-form-item required label="SMTP 服务器地址">
                  <a-input
                    v-model:value="formState.smtp.host"
                    placeholder="输入 SMTP 服务器地址，例如：smtp.qiye.aliyun.com"
                  />
                </a-form-item>
                <a-form-item required label="SMTP 服务器端口">
                  <a-input v-model:value="formState.smtp.port" placeholder="输入 SMTP 服务器端口，例如：465" />
                </a-form-item>
                <a-form-item required label="SMTP 加密方式">
                  <a-select v-model:value="formState.smtp.secure">
                    <a-select-option value="none">无</a-select-option>
                    <a-select-option value="ssl">SSL</a-select-option>
                    <a-select-option value="tls">TLS</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item required label="SMTP 用户名">
                  <a-input v-model:value="formState.smtp.username" placeholder="输入 SMTP 用户名" />
                </a-form-item>
                <a-form-item required label="SMTP 密码">
                  <a-input-password v-model:value="formState.smtp.password" placeholder="输入 SMTP 密码" />
                </a-form-item>
              </template>
            </template>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="存储设置">
            <a-form-item label="存储类型">
              <a-select v-model:value="formState.storage.type">
                <a-select-option v-for="(item, index) in imageStoreArray" :value="item.value" :key="index">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <template v-if="formState.storage.type === 'local'">
              <a-form-item required label="储存目录">
                <a-input v-model:value="formState.storage.local.path" placeholder="输入储存目录" />
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
            </template>
            <template v-if="formState.storage.type === 'oss'">
              <a-form-item required label="AccessKey ID">
                <a-input v-model:value="formState.storage.oss.accessKeyId" placeholder="输入 AccessKeyId" />
              </a-form-item>
              <a-form-item required label="AccessKey Secret">
                <a-input-password
                  v-model:value="formState.storage.oss.accessKeySecret"
                  placeholder="输入 AccessKeySecret"
                />
              </a-form-item>
              <a-form-item required label="OSS Bucket">
                <a-input v-model:value="formState.storage.oss.bucket" />
              </a-form-item>
              <a-form-item label="储存目录">
                <a-input v-model:value="formState.storage.oss.path" placeholder="输入储存目录" />
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
              <a-form-item label="OSS Region">
                <a-input v-model:value="formState.storage.oss.region" placeholder="输入 Region，例如：cn-shanghai" />
              </a-form-item>
              <a-form-item required label="外网 Endpoint">
                <a-input
                  v-model:value="formState.storage.oss.endpoint"
                  placeholder="输入 Endpoint，例如：oss-cn-shanghai.aliyuncs.com"
                />
              </a-form-item>
              <a-form-item label="内网 Endpoint">
                <a-input
                  v-model:value="formState.storage.oss.internal"
                  placeholder="输入内网 Endpoint，内网上传地址，填写即启用，例如：oss-cn-shanghai-internal.aliyuncs.com"
                />
              </a-form-item>
              <a-form-item label="Is Cname">
                <a-switch
                  v-model:checked="formState.storage.oss.isCname"
                  checked-children="是"
                  un-checked-children="否"
                />
                <p>若 Endpoint 为自定义域名，请打开此项。</p>
              </a-form-item>
            </template>
            <template v-if="formState.storage.type === 'cos'">
              <a-form-item required label="Secret Id">
                <a-input v-model:value="formState.storage.cos.secretId" placeholder="输入 Secret Id" />
              </a-form-item>
              <a-form-item required label="Secret Key">
                <a-input-password v-model:value="formState.storage.cos.secretKey" placeholder="输入 Secret Key" />
              </a-form-item>
              <a-form-item required label="Bucket">
                <a-input v-model:value="formState.storage.cos.bucket" placeholder="输入 Bucket" />
              </a-form-item>
              <a-form-item required label="Region">
                <a-input v-model:value="formState.storage.cos.region" placeholder="输入 Region，例如：ap-guangzhou" />
              </a-form-item>
              <a-form-item required label="储存目录">
                <a-input v-model:value="formState.storage.cos.filePath" placeholder="输入储存目录" />
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
            </template>
            <template v-if="formState.storage.type === 's3'">
              <a-form-item required label="Endpoint">
                <a-input
                  v-model:value="formState.storage.s3.endpoint"
                  placeholder="输入 Endpoint，例如：https://s3.amazonaws.com"
                />
              </a-form-item>
              <a-form-item required label="AccessKeyId">
                <a-input v-model:value="formState.storage.s3.accessKeyId" placeholder="输入 AccessKeyId" />
              </a-form-item>
              <a-form-item required label="SecretAccessKey">
                <a-input-password
                  v-model:value="formState.storage.s3.secretAccessKey"
                  placeholder="输入 SecretAccessKey"
                />
              </a-form-item>
              <a-form-item label="Region">
                <a-input
                  v-model:value="formState.storage.s3.region"
                  placeholder="输入 Region，例如：us-east-1 或者 auto"
                />
              </a-form-item>
              <a-form-item label="Bucket">
                <a-input v-model:value="formState.storage.s3.bucket" placeholder="输入 Bucket" />
              </a-form-item>
              <a-form-item required label="存储目录">
                <a-input v-model:value="formState.storage.s3.directory" placeholder="输入储存目录" />
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
            </template>
            <template v-if="formState.storage.type === 'qiniu'">
              <a-form-item required label="Access Key">
                <a-input v-model:value="formState.storage.qiniu.accessKey" placeholder="输入 Access Key" />
              </a-form-item>
              <a-form-item required label="Secret Key">
                <a-input-password v-model:value="formState.storage.qiniu.secretKey" placeholder="输入 Secret Key" />
              </a-form-item>
              <a-form-item required label="Bucket">
                <a-input v-model:value="formState.storage.qiniu.bucket" placeholder="输入 Bucket" />
              </a-form-item>
              <a-form-item required label="Bucket 域名">
                <a-input v-model:value="formState.storage.qiniu.domain" placeholder="输入 Bucket 域名" />
              </a-form-item>
              <a-form-item required label="存储目录">
                <a-input v-model:value="formState.storage.qiniu.directory" placeholder="输入储存目录" />
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
            </template>
            <template v-if="formState.storage.type === 'upyun'">
              <a-form-item required label="又拍云服务名">
                <a-input v-model:value="formState.storage.upyun.service" placeholder="输入服务名" />
              </a-form-item>
              <a-form-item required label="又拍云操作员">
                <a-input v-model:value="formState.storage.upyun.operator" placeholder="输入操作员" />
              </a-form-item>
              <a-form-item required label="又拍云密码">
                <a-input-password v-model:value="formState.storage.upyun.password" placeholder="输入密码" />
              </a-form-item>
              <a-form-item required label="存储目录">
                <a-input v-model:value="formState.storage.upyun.directory" placeholder="输入储存目录" />
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
              <a-form-item required label="访问域名">
                <a-input
                  v-model:value="formState.storage.upyun.domain"
                  placeholder="输入访问域名, 例如: https://domain.com"
                />
              </a-form-item>
            </template>
            <template v-if="formState.storage.type === 'sftp'">
              <a-form-item required label="主机地址" placeholder="输入主机地址">
                <a-input v-model:value="formState.storage.sftp.host" />
              </a-form-item>
              <a-form-item required label="端口">
                <a-input v-model:value="formState.storage.sftp.port" placeholder="输入端口，默认为 22" />
              </a-form-item>
              <a-form-item required label="用户名">
                <a-input v-model:value="formState.storage.sftp.username" placeholder="输入用户名" />
              </a-form-item>
              <a-form-item required label="密码">
                <a-input-password v-model:value="formState.storage.sftp.password" placeholder="输入密码" />
              </a-form-item>
              <a-form-item required label="储存目录">
                <a-input v-model:value="formState.storage.sftp.directory" placeholder="输入储存目录" />
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
              <a-form-item required label="连接超时时间">
                <a-input
                  v-model:value="formState.storage.sftp.connectTimeout"
                  placeholder="输入连接超时时间，默认为 10 秒"
                />
              </a-form-item>
              <a-form-item required label="连接最大尝试次数">
                <a-input
                  v-model:value="formState.storage.sftp.retries"
                  placeholder="输入连接最大尝试次数，默认为 4 次"
                />
              </a-form-item>
              <a-form-item required label="访问域名">
                <a-input
                  v-model:value="formState.storage.sftp.domain"
                  placeholder="输入访问域名, 例如: https://domain.com"
                />
              </a-form-item>
              <a-form-item label="主机指纹">
                <a-input-password v-model:value="formState.storage.sftp.hostFingerprint" placeholder="输入主机指纹" />
              </a-form-item>
              <a-form-item label="使用 SSH 代理">
                <a-switch v-model:checked="formState.storage.sftp.useSSH" />
              </a-form-item>
              <template v-if="formState.storage.sftp.useSSH">
                <a-form-item label="私钥">
                  <a-textarea
                    v-model:value="formState.storage.sftp.privateKey"
                    placeholder="使用私钥连接请输入私钥"
                    :auto-size="{ minRows: 2, maxRows: 5 }"
                  />
                </a-form-item>
                <a-form-item label="私钥口令">
                  <a-input-password
                    v-model:value="formState.storage.sftp.passphrase"
                    placeholder="使用私钥连接请输入私钥口令"
                  />
                </a-form-item>
              </template>
            </template>
            <template v-if="formState.storage.type === 'ftp'">
              <a-form-item required label="储存目录">
                <a-input v-model:value="formState.storage.ftp.directory" placeholder="输入储存目录" />
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
              <a-form-item required label="主机地址">
                <a-input v-model:value="formState.storage.ftp.host" placeholder="输入主机地址" />
              </a-form-item>
              <a-form-item required label="用户名">
                <a-input v-model:value="formState.storage.ftp.username" placeholder="输入用户名" />
              </a-form-item>
              <a-form-item required label="密码">
                <a-input-password v-model:value="formState.storage.ftp.password" placeholder="输入密码" />
              </a-form-item>
              <a-form-item required label="端口">
                <a-input v-model:value="formState.storage.ftp.port" placeholder="输入端口，默认为 21" />
              </a-form-item>
              <a-form-item required label="传输模式">
                <a-select v-model:value="formState.storage.ftp.transferMode">
                  <a-select-option value="binary">FTP_BINARY</a-select-option>
                  <a-select-option value="ascii">FTP_ASCII</a-select-option>
                </a-select>
                <p>请选择传输模式，默认为 FTP_BINARY</p>
              </a-form-item>
              <a-form-item required label="连接超时时间">
                <a-input
                  v-model:value="formState.storage.ftp.connectTimeout"
                  placeholder="输入连接超时时间，默认为 90 秒"
                />
              </a-form-item>
              <a-form-item required label="访问域名">
                <a-input
                  v-model:value="formState.storage.ftp.domain"
                  placeholder="输入访问域名, 例如: https://domain.com"
                />
              </a-form-item>
              <a-form-item label="是否使用被动模式">
                <a-switch v-model:checked="formState.storage.ftp.passive" />
              </a-form-item>
              <a-form-item label="是否使用 SSL 连接">
                <a-switch v-model:checked="formState.storage.ftp.secure" />
              </a-form-item>
              <a-form-item label="是否忽略被动模式下的远程 IP 地址">
                <a-switch v-model:checked="formState.storage.ftp.ignorePassiveIP" />
              </a-form-item>
              <a-form-item label="是否启用 Unix 时间戳">
                <a-switch v-model:checked="formState.storage.ftp.useUnixTimestamp" />
              </a-form-item>
              <a-form-item label="是否启用 UTF-8 编码">
                <a-switch v-model:checked="formState.storage.ftp.useUTF8" />
              </a-form-item>
              <a-form-item label="是否手动递归">
                <a-switch v-model:checked="formState.storage.ftp.recursive" />
              </a-form-item>
            </template>
            <template v-if="formState.storage.type === 'webdav'">
              <a-form-item label="储存目录">
                <a-input v-model:value="formState.storage.webdav.directory" />
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
              <a-form-item required label="连接地址">
                <a-input v-model:value="formState.storage.webdav.url" placeholder="输入连接地址" />
              </a-form-item>
              <a-form-item required label="认证方式">
                <a-select v-model:value="formState.storage.webdav.authType">
                  <a-select-option value="auto">Auto</a-select-option>
                  <a-select-option value="basic">Basic</a-select-option>
                  <a-select-option value="digest">Digest</a-select-option>
                  <a-select-option value="ntlm">Ntlm</a-select-option>
                </a-select>
                <p>请选择认证方式，默认 Auto</p>
              </a-form-item>
              <a-form-item required label="用户名">
                <a-input v-model:value="formState.storage.webdav.username" placeholder="输入用户名" />
              </a-form-item>
              <a-form-item required label="密码">
                <a-input-password v-model:value="formState.storage.webdav.password" placeholder="输入密码" />
              </a-form-item>
              <a-form-item required label="访问域名">
                <a-input
                  v-model:value="formState.storage.webdav.domain"
                  placeholder="输入访问域名, 例如: https://domain.com"
                />
              </a-form-item>
            </template>
            <template v-if="formState.storage.type === 'telegram'">
              <a-form-item required label="BotToken">
                <a-input-password v-model:value="formState.storage.telegram.botToken" placeholder="输入 BotToken" />
              </a-form-item>
              <a-form-item required label="聊天ID">
                <a-input v-model:value="formState.storage.telegram.chatId" placeholder="输入聊天ID" />
              </a-form-item>
              <a-form-item required label="频道ID">
                <a-input v-model:value="formState.storage.telegram.channelId" placeholder="输入频道ID" />
              </a-form-item>
              <a-form-item label="禁用轮询">
                <a-switch v-model:checked="formState.storage.telegram.polling" />
              </a-form-item>
              <a-form-item label="连接超时时间">
                <a-input
                  v-model:value="formState.storage.telegram.timeout"
                  placeholder="输入连接超时时间，默认为 30 秒"
                />
              </a-form-item>
              <a-form-item label="代理地址">
                <a-input v-model:value="formState.storage.telegram.proxy" placeholder="输入代理地址" />
              </a-form-item>
            </template>
            <template v-if="formState.storage.type === 'github'">
              <a-form-item required label="GitHub 个人访问令牌">
                <a-input-password
                  v-model:value="formState.storage.github.token"
                  placeholder="输入 GitHub 个人访问令牌"
                />
              </a-form-item>
              <a-form-item required label="仓库所有者">
                <a-input v-model:value="formState.storage.github.owner" placeholder="输入仓库所有者" />
              </a-form-item>
              <a-form-item required label="仓库名称">
                <a-input v-model:value="formState.storage.github.repo" placeholder="输入仓库名称" />
              </a-form-item>
              <a-form-item required label="分支名称">
                <a-input v-model:value="formState.storage.github.branch" placeholder="输入分支名称" />
              </a-form-item>
              <a-form-item required label="存储目录">
                <a-input v-model:value="formState.storage.github.directory" placeholder="输入存储目录" />
                <p>Github不允许文件路径以斜杠"/"开头</p>
                <p>不能以"/"或"\"结尾</p>
              </a-form-item>
              <a-form-item required label="连接超时时间">
                <a-input
                  v-model:value="formState.storage.github.timeout"
                  placeholder="输入连接超时时间，默认为 30 秒"
                />
              </a-form-item>
              <a-form-item required label="重试次数">
                <a-input v-model:value="formState.storage.github.retries" placeholder="输入重试次数，默认为 3 次" />
              </a-form-item>
              <a-form-item required label="重试间隔时间">
                <a-input v-model:value="formState.storage.github.retryAfter" placeholder="输入重试次数，默认为 5 秒" />
              </a-form-item>
              <a-form-item label="开启自定义域名">
                <a-switch v-model:checked="formState.storage.github.customDomain" />
                <p>开启自定义域名后, 图片可访问状态以Github Pages build状态为准</p>
              </a-form-item>
              <a-form-item label="是否Github Pages" v-if="formState.storage.github.customDomain">
                <a-switch v-model:checked="formState.storage.github.isGithubPages" />
              </a-form-item>
              <a-form-item
                required
                label="自定义域名"
                v-if="formState.storage.github.customDomain && !formState.storage.github.isGithubPages"
              >
                <a-input
                  v-model:value="formState.storage.github.domain"
                  placeholder="输入自定义域名, 例如: https://domain.com"
                />
              </a-form-item>
              <a-form-item
                required
                label="Github Pages"
                v-if="formState.storage.github.customDomain && formState.storage.github.isGithubPages"
              >
                <a-input
                  v-model:value="formState.storage.github.githubPages"
                  placeholder="输入Github Pages, 例如: https://user.github.io"
                />
              </a-form-item>
            </template>
          </a-collapse-panel>
          <a-collapse-panel key="4" header="鉴黄设置">
            <a-form-item label="鉴黄开关">
              <a-switch v-model:checked="formState.ai.enabled" checked-children="启用" un-checked-children="禁用" />
              <p>设置上传是否需要应用第三方审查，违规的图片会被标记为不健康的图片，或直接被删除。</p>
            </a-form-item>
            <a-form-item label="自动拉黑">
              <a-switch v-model:checked="formState.ai.autoBlack" checked-children="启用" un-checked-children="禁用" />
              <p>该功能需要同步弃用IP设置里的黑名单开关。设置之后用户如果上传违规图片，会被自动列入IP黑名单</p>
            </a-form-item>
            <template v-if="formState.ai.enabled">
              <a-form-item label="图片处理">
                <a-radio-group v-model:value="formState.ai.action">
                  <a-radio value="reject">标记为不健康</a-radio>
                  <a-radio value="mark">直接删除</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="图片审核">
                <a-select v-model:value="formState.ai.type">
                  <a-select-option value="tencent">腾讯云</a-select-option>
                  <a-select-option value="aliyun">阿里云</a-select-option>
                  <a-select-option value="nsfwjs">NsfwJs</a-select-option>
                </a-select>
              </a-form-item>
              <template v-if="formState.ai.type === 'tencent'">
                <a-form-item required label="Endpoint">
                  <a-input v-model:value="formState.ai.tencent.endpoint" placeholder="请输入 Endpoint" />
                </a-form-item>
                <a-form-item required label="SecretId">
                  <a-input v-model:value="formState.ai.tencent.secretId" placeholder="请输入 SecretId" />
                </a-form-item>
                <a-form-item required label="SecretKey">
                  <a-input-password v-model:value="formState.ai.tencent.secretKey" placeholder="请输入 SecretKey" />
                </a-form-item>
                <a-form-item required label="地域">
                  <a-input v-model:value="formState.ai.tencent.region" placeholder="请输入地域节点，例如：ap-beijing" />
                </a-form-item>
                <a-form-item label="场景名称(Biztype名称)">
                  <a-input v-model:value="formState.ai.tencent.bizType" placeholder="业务场景名称，可为空" />
                </a-form-item>
              </template>
              <template v-if="formState.ai.type === 'aliyun'">
                <a-form-item required label="AccessKeyId">
                  <a-input v-model:value="formState.ai.aliyun.accessKeyId" placeholder="请输入 AccessKeyId" />
                </a-form-item>
                <a-form-item required label="AccessKeySecret">
                  <a-input-password
                    v-model:value="formState.ai.aliyun.accessKeySecret"
                    placeholder="请输入 AccessKeySecret"
                  />
                </a-form-item>
                <a-form-item required label="地域节点">
                  <a-input v-model:value="formState.ai.aliyun.region" placeholder="请输入地域节点，例如：cn-shanghai" />
                </a-form-item>
                <a-form-item required label="检测 Service">
                  <a-input
                    v-model:value="formState.ai.aliyun.service"
                    placeholder="检测服务规则配置，示例：baselineCheck"
                  />
                </a-form-item>
                <a-form-item required label="阈值">
                  <a-input-number
                    v-model:value="formState.ai.aliyun.threshold"
                    :min="1"
                    :max="100"
                    placeholder="取值 1-100"
                  />
                  <p>阈值是指图片违规程度上限，取值 1-100 之间，数值越低审核越严格</p>
                </a-form-item>
              </template>
              <template v-if="formState.ai.type === 'nsfwjs'">
                <a-form-item required label="接口地址">
                  <a-input
                    v-model:value="formState.ai.nsfwjs.apiUrl"
                    placeholder="请输入接口地址，http(s)://domain.com/classify"
                  />
                </a-form-item>
                <a-form-item required label="阈值">
                  <a-input-number
                    v-model:value="formState.ai.nsfwjs.threshold"
                    :min="1"
                    :max="100"
                    placeholder="取值 1-100"
                  />
                  <p>阈值是指图片违规程度上限，取值 1-100 之间，数值越低审核越严格</p>
                </a-form-item>
              </template>
            </template>
          </a-collapse-panel>
          <a-collapse-panel key="5" header="IP设置">
            <a-form-item label="黑名单开关">
              <a-switch v-model:checked="formState.ip.enabled" checked-children="启用" un-checked-children="禁用" />
            </a-form-item>
            <a-form-item label="IP黑名单">
              <a-textarea
                v-model:value="ipBlacklistText"
                :rows="4"
                placeholder="每行一个IP地址"
                @change="handleIpBlacklistChange"
              />
            </a-form-item>
          </a-collapse-panel>
          <a-collapse-panel key="6" header="社会化登录">
            <a-form-item label="启用社会化登录">
              <a-switch v-model:checked="formState.oauth.enabled" checked-children="启用" un-checked-children="禁用" />
            </a-form-item>
            <template v-if="formState.oauth.enabled">
              <a-form-item label="GitHub登录开关">
                <a-switch
                  v-model:checked="formState.oauth.github.enabled"
                  checked-children="启用"
                  un-checked-children="禁用"
                />
              </a-form-item>
              <template v-if="formState.oauth.github.enabled">
                <a-form-item required label="Client ID">
                  <a-input v-model:value="formState.oauth.github.clientId" placeholder="输入 GitHub Client ID" />
                </a-form-item>
                <a-form-item required label="Client Secret">
                  <a-input-password
                    v-model:value="formState.oauth.github.clientSecret"
                    placeholder="输入 GitHub Client Secret"
                  />
                </a-form-item>
                <a-form-item label="回调地址">
                  <a-input
                    :value="`${formState.site.url}${formState.oauth.github.callbackUrl}`"
                    disabled
                    placeholder="输入回调地址"
                  />
                </a-form-item>
              </template>
              <a-form-item label="Google登录开关">
                <a-switch
                  v-model:checked="formState.oauth.google.enabled"
                  checked-children="启用"
                  un-checked-children="禁用"
                />
              </a-form-item>
              <template v-if="formState.oauth.google.enabled">
                <a-form-item required label="Client ID">
                  <a-input v-model:value="formState.oauth.google.clientId" placeholder="输入 Google Client ID" />
                </a-form-item>
                <a-form-item required label="Client Secret">
                  <a-input-password
                    v-model:value="formState.oauth.google.clientSecret"
                    placeholder="输入 Google Client Secret"
                  />
                </a-form-item>
                <a-form-item label="回调地址">
                  <a-input
                    :value="`${formState.site.url}${formState.oauth.google.callbackUrl}`"
                    disabled
                    placeholder="输入回调地址"
                  />
                </a-form-item>
              </template>
              <a-form-item label="Linux DO登录开关">
                <a-switch
                  v-model:checked="formState.oauth.linuxdo.enabled"
                  checked-children="启用"
                  un-checked-children="禁用"
                />
              </a-form-item>
              <template v-if="formState.oauth.linuxdo.enabled">
                <a-form-item required label="Client ID">
                  <a-input v-model:value="formState.oauth.linuxdo.clientId" placeholder="输入 Linux DO Client ID" />
                </a-form-item>
                <a-form-item required label="Client Secret">
                  <a-input-password
                    v-model:value="formState.oauth.linuxdo.clientSecret"
                    placeholder="输入 Linux DO Client Secret"
                  />
                </a-form-item>
                <a-form-item label="回调地址">
                  <a-input
                    :value="`${formState.site.url}${formState.oauth.linuxdo.callbackUrl}`"
                    disabled
                    placeholder="输入回调地址"
                  />
                </a-form-item>
              </template>
            </template>
          </a-collapse-panel>
        </a-collapse>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="submitting">保存设置</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { message } from 'ant-design-vue'
  import axios from '@/stores/axios'
  import { useUserStore } from '@/stores/user'
  import { imageStoreType } from '@/stores/formatDate'
  import { CopyOutlined } from '@ant-design/icons-vue'

  const userStore = useUserStore()
  const loading = ref(false)
  const submitting = ref(false)
  const ipBlacklistText = ref('')
  const activeKey = ref('1')
  const imageStoreArray = Object.entries(imageStoreType)
    .filter(([key]) => key !== 'get')
    .map(([value, label]) => ({ value, label }))

  const availableNavigationItems = [
    { value: 'home', label: '图床首页' },
    { value: 'my', label: '我的图片' },
    { value: 'gallery', label: '图片广场' },
    { value: 'docs', label: '接口文档' }
  ]

  const formState = ref({
    site: {},
    storage: {},
    watermark: {},
    ip: {},
    ai: {},
    oauth: {}
  })

  // 获取配置
  const fetchConfig = async () => {
    loading.value = true
    try {
      const { data } = await axios.post('/api/admin/config')
      const { ip } = data
      formState.value = data
      ipBlacklistText.value = ip.blacklist.join('\n')
    } catch ({ response }) {
      message.error(response?.data?.error)
    } finally {
      loading.value = false
    }
  }

  // 处理IP黑名单变化
  const handleIpBlacklistChange = e => {
    const { ip } = formState.value
    ip.blacklist = e.target.value
      .split('\n')
      .map(ip => ip.trim())
      .filter(ip => ip)
  }

  // 提交表单
  const handleSubmit = async () => {
    submitting.value = true
    try {
      const { data } = await axios.put('/api/admin/config', formState.value)
      const { site, ai, oauth } = formState.value
      userStore.config = JSON.parse(
        JSON.stringify({
          site,
          ai: {
            enabled: ai.enabled
          },
          oauth: {
            enabled: oauth.enabled,
            github: {
              enabled: oauth.github.enabled
            },
            google: {
              enabled: oauth.google.enabled
            },
            linuxdo: {
              enabled: oauth.linuxdo.enabled
            }
          }
        })
      )
      message.success(data.message)
    } catch ({ response }) {
      message.error(response?.data?.error)
    } finally {
      submitting.value = false
    }
  }
  watch(
    () => activeKey.value,
    newValue => {
      userStore.activeKey = newValue || '1'
    }
  )

  onMounted(() => {
    activeKey.value = userStore.activeKey || '1'
    fetchConfig()
  })
</script>

<style scoped>
  .config-container {
    padding: 24px;
  }

  p {
    margin-top: 8px;
  }

  .mb-4 {
    margin-bottom: 24px;
  }

  .namingRule-collapse {
    margin-top: 10px;
  }

  .ant-collapse-item {
    background: #f0f2f5;
    border-radius: 4px;
    margin-bottom: 24px;
    border: 0px;
    overflow: hidden;
  }

  :deep(.ant-collapse-header),
  :deep(.ant-collapse-content-box) {
    background: rgb(255, 255, 255);
  }
</style>
