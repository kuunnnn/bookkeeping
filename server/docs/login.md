# 登录注册流程

**流程关键部分**

- 使用**https** 防止中间人
- 一次性的随机字符串或时间戳, 需要防止重放攻击
- 使用 bcrypt 给暴力破解增加巨量时间
- 加 salt 防止彩虹表之类的
- 使用时间恒定的比较算法比较密码

### 秘钥交换(rsa dh, ecdh,...)

- client 和 server 都创建一个 dh 对象使用相同的参数
- client 将自己的 dh 公钥发送并请求 server 的 dh 公钥
- server 计算出一个 secret 作为 aes 的 secret 加密 bcrypt salt(登录式从数据库中拉取)
- client 计算出一个 secret 作为 aes 的 secret 解密 bcrypt salt
- client 使用 hmac_sha256 对用户的密码进行 hash **将密码长度统一**
- client 使用 salt 对密码进行 bcrypt hash 将结果使用 aes 加密 提交
- server 使用 aes 解密然后与数据库中密码对比 使用时间恒定的比较算法

**注册和登录步骤差别**

- client 请求时都需要带有 id 标识身份
- salt 在注册时随机生成一个并保存在 redis 中 登录直接从数据库中获取
