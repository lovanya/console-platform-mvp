# 生产部署指南：OSS + Nginx 接入配置

> 适用场景：把 4 个包（shell / common / ecs / billing）的 dist 通过阿里云 OSS + Nginx 部署到公网。
> 适用于阿里云控制台这类多 bundle 微前端架构。

---

## 1. 整体架构

```
用户浏览器
    │
    ↓ HTTPS
┌───────────────────────────────────────┐
│  Nginx（统一入口）                     │
│  - SSL/TLS 终止                        │
│  - Gzip / Brotli 压缩                 │
│  - SPA 路由 fallback                   │
│  - 安全头                              │
│  - 静态资源代理到 OSS                  │
└───────────────┬───────────────────────┘
                │
        ┌───────┼────────┬────────────┐
        ↓       ↓        ↓            ↓
        OSS    OSS     OSS          OSS
        /shell /common /ecs         /billing
```

**核心原则**：
- Nginx 只做"路由 + 缓存层 + 安全"，不存原始文件
- OSS 是源（CDN 的 origin）
- 静态文件直接 CDN 回源到 OSS，Nginx 不参与（除非需要鉴权/路由）

---

## 2. OSS 配置

### 2.1 Bucket 规划

**两种方案**：

#### 方案 A：单 Bucket + 路径隔离（推荐）

```
oss://console-prod/
├── shell/
│   ├── index.html
│   ├── main.[hash].js
│   ├── main.[hash].js.map
│   └── assets/...
├── common/
│   ├── remoteEntry.js
│   ├── __federation_expose_RegionSelect.js
│   └── assets/...
├── ecs/
│   ├── remoteEntry.js
│   ├── main.js
│   └── __federation_expose_routes.js
└── billing/
    ├── remoteEntry.var.js
    ├── remoteEntry.js
    └── assets/...
```

#### 方案 B：多 Bucket（隔离性更强）

```
oss://console-shell-prod/
oss://console-common-prod/
oss://console-ecs-prod/
oss://console-billing-prod/
```

**推荐方案 A**：CDN 配置更简单，统一域名。

### 2.2 Bucket 基础配置

| 配置项 | 值 |
|--------|---|
| Bucket 名称 | `console-prod` |
| 地域 | 与你的用户群体最近的地域（如 `oss-cn-hangzhou`） |
| 存储类型 | 标准存储（Standard）|
| 读写权限 | **公共读**（Static Website Hosting 会自动设置）|
| 静态页面 | 开启（默认首页：`index.html`，默认 404：`404.html`）|
| 镜像回源 | 可选：开启回源到 GitHub Actions artifacts，用于自动部署 |

### 2.3 CORS 设置

控制台要跨 origin 加载 remote（Shell 从 `shell.console.com` 加载 `common.console.com` 等），OSS 必须开 CORS。

**OSS 控制台 → Bucket 设置 → 跨域设置（CORS）**：

```
来源（Allowed Origins）：
  - https://console.example.com
  - https://*.console.example.com
允许 Methods：GET, HEAD
允许 Headers：*
暴露 Headers：ETag, Content-Length, x-oss-request-id
缓存时间（Max-Age）：3600
```

> 注意：**CORS 头由 OSS 设置**（不是 Nginx）。Nginx 加 CORS 会重复。

### 2.4 文件上传策略

```
package.json:
  build → 生成 dist/
  deploy → 上传 dist/* 到 oss://console-prod/<package-name>/
```

**上传命令（aliyun CLI）**：
```bash
# 设置环境变量
export OSS_BUCKET=oss://console-prod
export OSS_ACCESS_KEY_ID=<your-key-id>
export OSS_ACCESS_KEY_SECRET=<your-secret>

# 同步上传（带缓存头）
for pkg in shell common ecs billing; do
  ossutil cp \
    --recursive \
    --update \
    --meta "Cache-Control:public,max-age=31536000" \
    dist/ \
    $OSS_BUCKET/$pkg/
done

# index.html 单独设置短缓存
for pkg in shell; do
  ossutil cp \
    --update \
    --meta "Cache-Control:no-cache,must-revalidate" \
    dist/index.html \
    $OSS_BUCKET/$pkg/index.html
done
```

---

## 3. CDN 配置

**阿里云 CDN 域名**（推荐）：
```
shell.example.com     → OSS /shell/
common.example.com   → OSS /common/
ecs.example.com       → OSS /ecs/
billing.example.com   → OSS /billing/
```

或者统一域名：
```
console.example.com
├── / → 回源 OSS /shell/index.html
├── /shell/* → 回源 OSS /shell/
├── /common/* → 回源 OSS /common/
├── /ecs/* → 回源 OSS /ecs/
└── /billing/* → 回源 OSS /billing/
```

**CDN 配置**：
| 配置 | 值 |
|------|---|
| 源站类型 | OSS Bucket |
| 加速类型 | Web 加速 |
| 缓存策略 | 见下文 §5 |
| HTTPS | 开启（证书自动管理）|

---

## 4. Nginx 配置（统一入口）

### 4.1 角色定位

Nginx 在此架构中扮演三个角色：
1. **统一入口**（HTTPS 终止、SPA fallback、安全头）
2. **API 网关**（如果有 BFF 路由）
3. **CDN 回源**（如果 CDN 没直连 OSS）

> **如果用 CDN + OSS 直连**，Nginx 流量很少，只承接：
> - 主入口 HTML 首次访问（之后被 CDN 缓存）
> - `/api/*` 反向代理到 BFF
> - 健康检查

### 4.2 完整配置

```nginx
# /etc/nginx/conf.d/console.conf

# ======================================================
#  Upstream: BFF (示例，如果不需要可以删除)
# ======================================================
upstream console_bff {
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    keepalive 32;
}

# ======================================================
#  Upstream: OSS 直连（绕过 CDN 的 fallback）
#  通常不需要，因为 CDN 会直连 OSS
# ======================================================

# ======================================================
#  HTTP → HTTPS 重定向
# ======================================================
server {
    listen 80;
    server_name console.example.com;
    return 301 https://$host$request_uri;
}

# ======================================================
#  主 HTTPS server
# ======================================================
server {
    listen 443 ssl http2;
    server_name console.example.com;

    # SSL/TLS 证书（Let's Encrypt 或阿里云免费证书）
    ssl_certificate     /etc/nginx/ssl/console.example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/console.example.com.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;

    # 通用安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    # CSP：允许 connect 到 OSS domain
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.example.com wss:; frame-ancestors 'self';" always;

    # 日志
    access_log /var/log/nginx/console.access.log;
    error_log  /var/log/nginx/console.error.log warn;

    # 客户端上传大小
    client_max_body_size 50m;

    # 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        application/json
        application/javascript
        application/xml
        application/xml+rss
        application/atom+xml
        application/vnd.ms-fontobject
        application/x-font-ttf
        font/opentype
        image/svg+xml
        image/x-icon;

    # 隐藏版本
    server_tokens off;

    # ==================================================
    #  健康检查
    # ==================================================
    location = /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }

    # ==================================================
    #  API 路由（如果有 BFF）
    # ==================================================
    location /api/ {
        proxy_pass http://console_bff;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # BFF 响应缓冲
        proxy_buffering on;
        proxy_buffer_size 8k;
        proxy_buffers 16 16k;

        # WebSocket 支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 超时
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # ==================================================
    #  Shell 入口（最关键的 SPA 路由）
    # ==================================================
    location / {
        # 重要：把 SPA 路由 fallback 到 index.html
        try_files $uri $uri/ /index.html;

        # 转发到 OSS 或 CDN
        # 这里假设 CDN 已经接管大部分流量，Nginx 只作为兜底
        proxy_pass http://oss-shell-internal;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 子路由 fallback 到 index.html（防 CDN 不可达）
        proxy_intercept_errors on;
        error_page 404 = @shell_spa;
    }

    location @shell_spa {
        root /opt/console-static/shell;
        try_files /index.html =404;
    }

    # ==================================================
    #  Remote 模块（common / ecs / billing）
    #  这些是 JS 文件，不需要 SPA fallback
    # ==================================================
    location ~* ^/(common|ecs|billing)/(.*\.(js|css|map))$ {
        # 直接代理到 OSS（或 CDN）
        proxy_pass https://cdn.example.com/$uri$is_args$args;

        # 缓存
        proxy_cache_valid 200 1d;
        proxy_cache_valid 404 1m;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # ==================================================
    #  静态资源（带 hash 名的 JS/CSS）
    # ==================================================
    location ~* \.(js|css|woff2?|ttf|otf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable, max-age=31536000";
        access_log off;
    }

    # ==================================================
    #  HTML（永不缓存，强制每次校验）
    # ==================================================
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }

    # ==================================================
    #  favicon
    # ==================================================
    location = /favicon.ico {
        access_log off;
        log_not_found off;
        expires 1y;
    }
}
```

### 4.3 关键决策说明

**为什么 `try_files $uri $uri/ /index.html` 是关键**：
- 用户访问 `/products/ecs/instances`（SPA 深路径）
- Nginx 先查文件（404），然后 fallback 到 `/index.html`
- Shell 的 React Router 在客户端接管路由

**为什么 HTML 不缓存**：
- HTML 是 SPA 入口，包含远程模块的 URL 引用
- 一旦缓存，Shell 加载的 remoteEntry.js URL 就固定了
- 部署新版 shell.html 但客户端继续用旧版 → 404

**为什么 JS 缓存 1 年**：
- Webpack/Rspack/Vite 输出文件名带 hash（`main.a3f8b2.js`）
- 内容变 hash 变，URL 变，缓存自动失效
- 安全地长期缓存

---

## 5. 缓存策略

### 5.1 OSS + CDN 缓存头矩阵

| 文件类型 | OSS Cache-Control | 原因 |
|----------|------------------|------|
| `index.html` | `no-cache, must-revalidate` | 入口必须最新，避免版本不一致 |
| `main.[hash].js` | `public, max-age=31536000, immutable` | 带 hash，永不过期 |
| `remoteEntry.js` | `public, max-age=300` | MF 远程入口，频繁校验（5 分钟） |
| `assets/*.js.map` | `no-cache` 或 1d | source map 偶尔改 |
| `__federation_expose_*.js` | `public, max-age=3600` | 远程暴露的组件 |
| `index-*.js` (chunk) | `public, max-age=31536000, immutable` | 带 hash |
| `mf-manifest.json` | `no-cache` | MF 远程清单，必须最新 |

### 5.2 自动化脚本

```bash
#!/bin/bash
# deploy.sh - 部署到 OSS

OSS_BUCKET="oss://console-prod"
PKG=$1

if [ -z "$PKG" ]; then
  echo "Usage: $0 <shell|common|ecs|billing>"
  exit 1
fi

cd packages/$PKG
pnpm build

# 1. 上传带 hash 的 JS/CSS（永久缓存）
ossutil cp --recursive --update \
  --exclude "*.html" --exclude "mf-manifest.json" --exclude "*.map" \
  --meta "Cache-Control:public,max-age=31536000,immutable" \
  dist/ \
  $OSS_BUCKET/$PKG/

# 2. 上传 source map（短缓存）
ossutil cp --recursive --update \
  --include "*.map" \
  --meta "Cache-Control:public,max-age=86400" \
  dist/ \
  $OSS_BUCKET/$PKG/

# 3. 上传 remoteEntry.js（5 分钟缓存）
ossutil cp --update \
  --meta "Cache-Control:public,max-age=300" \
  dist/remoteEntry.js \
  $OSS_BUCKET/$PKG/remoteEntry.js

# 4. 上传 manifest（不缓存）
ossutil cp --update \
  --meta "Cache-Control:no-cache" \
  dist/mf-manifest.json \
  $OSS_BUCKET/$PKG/mf-manifest.json

# 5. 上传 index.html（Shell 才有）
if [ -f "dist/index.html" ]; then
  ossutil cp --update \
    --meta "Cache-Control:no-cache,must-revalidate" \
    dist/index.html \
    $OSS_BUCKET/$PKG/index.html
fi

# 6. 触发 CDN 刷新（针对非 hash 文件）
aliyun cdn RefreshObjectCaches --ObjectPath "$CDN_DOMAIN/$PKG/*"

echo "✅ Deployed $PKG to $OSS_BUCKET/$PKG/"
```

---

## 6. 跨域（CORS）

MF 远程加载有特殊要求：

**Shell 从 `console.example.com/shell/` 加载**：
- `import 'common/RegionSelect'` → `https://common.example.com/remoteEntry.js`
- 跨域请求

**OSS 端设置 CORS**（必须在 OSS 控制台，不在 Nginx）：

```
Access-Control-Allow-Origin: https://console.example.com
Access-Control-Allow-Methods: GET, HEAD
Access-Control-Allow-Headers: *
Access-Control-Expose-Headers: ETag, Content-Length
Access-Control-Max-Age: 3600
```

**为什么 OSS 而不是 Nginx 设 CORS**：
- CORS 是浏览器检查的，浏览器看的是**最终响应头**
- OSS 直接响应就有头（不需要 Nginx 加）
- Nginx 加 CORS 是给 CDN 用，CDN 回源到 Nginx 时会传过去

---

## 7. 蓝绿发布 / 回滚

```
OSS://console-prod/
├── shell/         ← 当前版本（v2）
├── shell-v1/      ← 历史版本
├── common/
├── common-v1/
└── ...
```

发布流程：
1. 上传新版本到 `shell-v2/`
2. 烟雾测试 `https://console-v2.example.com`
3. 切换 CDN 源到 `shell-v2/`
4. 老用户无感知，新用户访问新版
5. 回滚：改回 `shell-v1/`

---

## 8. 监控和告警

### 8.1 Nginx access log 分析

```nginx
log_format console_json escape=json
    '{"time":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"method":"$request_method",'
    '"uri":"$request_uri",'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"upstream_response_time":"$upstream_response_time",'
    '"upstream_addr":"$upstream_addr",'
    '"host":"$host",'
    '"user_agent":"$http_user_agent",'
    '"referer":"$http_referer"}';
```

### 8.2 关键指标

- Shell `/main.js` P99 < 500ms
- remoteEntry.js 4xx 比例 < 0.1%
- SPA fallback (`/index.html`) 触发比例 < 5%
- HTML 304 命中率 < 30%（说明用户拿到了更新）

### 8.3 告警规则

```
- 5xx 错误率 > 1% 持续 5min → PagerDuty
- main.js P99 > 2s  → Slack
- remoteEntry.js 4xx > 5%  → 可能是 CDN 配置错误
- index.html 5xx > 0.5%  → OSS Bucket 权限/网络问题
```

---

## 9. 完整流程图

```
┌────────────────────────────────────────────────────────────────┐
│                          CDN (阿里云)                          │
│   console.example.com / common.example.com / ecs.example.com │
└──────────────────┬─────────────────────────────────────────────┘
                   │
                   ↓ (缓存未命中)
┌────────────────────────────────────────────────────────────────┐
│                       Nginx (统一入口)                        │
│                                                                │
│   GET /                                                        │
│   ├─ try_files index.html ✓  (SPA fallback)                    │
│   ├─ location / → OSS shell/                                  │
│   └─ location /common/* → OSS common/                         │
└──────────────────┬─────────────────────────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────────────────────────┐
│               OSS Bucket: oss://console-prod                  │
│   ├── /shell/                                                  │
│   ├── /common/                                                 │
│   ├── /ecs/                                                    │
│   └── /billing/                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 10. 环境隔离

| 环境 | Bucket | CDN 域名 | Nginx 配置 |
|------|--------|---------|------------|
| dev | `oss://console-dev` | `dev.console.example.com` | `dev.conf` |
| staging | `oss://console-staging` | `stg.console.example.com` | `staging.conf` |
| prod | `oss://console-prod` | `console.example.com` | `prod.conf` |

每个环境独立 bucket + 独立 CDN 域名 + 独立 nginx config（用 include 区分）。

---

## 11. 安全检查清单

部署前必查：

- [ ] OSS Bucket 公共读 + 私有写
- [ ] OSS CORS 配置正确
- [ ] SSL 证书有效（A+ 评级）
- [ ] HSTS 头已设置
- [ ] CSP 头允许当前域名
- [ ] X-Frame-Options 防 clickjacking
- [ ] HTML 不缓存，JS 长缓存
- [ ] `.env` 文件未上传到 OSS
- [ ] MF remoteEntry.js 跨域可访问
- [ ] SPA fallback 已测试（直接访问 `/products/ecs` 应返回 index.html）
- [ ] 健康检查 `/health` 正常

---

## 附录：监控 Shell 远程加载 MF 的网络面板

期望网络请求顺序：

```
1. GET https://console.example.com/index.html
2. GET https://console.example.com/main.[hash].js
3. GET https://common.example.com/remoteEntry.js          ← MF init
4. GET https://ecs.example.com/remoteEntry.js             ← 进入 /products/ecs
5. GET https://common.example.com/__federation_expose_RegionSelect.js
6. GET https://common.example.com/__federation_expose_Card.js
7. GET https://common.example.com/__federation_expose_Table.js
8. GET https://common.example.com/assets/...
```

如果第 3 步后 4xx：
- 检查 CORS（OSS 控制台）
- 检查 OSS CORS 设置是否包含 `console.example.com`

如果某步卡住：
- 检查 `remoteEntryUrl` 是否正确
- 检查 Nginx 路由规则