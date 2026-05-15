# vue3-flipbook —— 面向 AI 编码助手的项目指南

> 本文件面向首次接触本项目的 AI 编码助手。假定读者对项目背景、业务逻辑一无所知。

---

## 1. 项目概述

`vue3-flipbook` 是一个基于 **Vue 3** 的 3D 翻页组件库，用于将图片数组以书本翻页的形式展示。它支持：

- 双页/单页自适应布局
- 触摸拖拽翻页、点击翻页、滚轮缩放
- 3D 透视翻页动画（基于 CSS 3D 变换）
- 多倍率缩放与高清图切换
- 左右阅读方向切换

项目以 **Monorepo** 形式管理，源码和演示分离：

- 主库包：`packages/Flipbook/` → 发布到 npm（包名 `vue3-flipbook`）
- 演示/测试包：`packages/storybook/` → 基于 Storybook 的本地开发与文档站点

---

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 语言 | TypeScript（`strict: true`） |
| 构建工具 | Vite |
| 样式 | SCSS |
| 3D 矩阵 | [rematrix](https://github.com/jlmakes/rematrix)（通过 `packages/Flipbook/src/matrix.ts` 封装） |
| 包管理器 | pnpm |
| Monorepo 工具 | pnpm workspaces + Lerna（`independent` 版本模式） |
| 文档/演示 | Storybook 8（`@storybook/vue3-vite`） |
| 测试框架 | Vitest + jsdom + `@vue/test-utils` |
| 代码规范 | ESLint + Prettier + Stylelint |
| Git Hooks | Husky + lint-staged |
| CI/CD | GitHub Actions → 构建 Storybook 并部署到 GitHub Pages |

---

## 3. 仓库结构

```
├── package.json              # 根 package.json，定义 workspace 与全局脚本
├── pnpm-workspace.yaml       # pnpm workspace 声明
├── lerna.json                # Lerna 配置（independent 模式）
├── tsconfig.json             # 根 TS 配置，包含 packages/*/src 下所有文件
├── .eslintrc.js              # ESLint 配置（Vue3 + TypeScript + Storybook）
├── prettier.config.js        # Prettier 配置
├── .stylelintrc              # Stylelint 配置（含 Vue 支持）
├── packages/
│   ├── Flipbook/             # 主库包（npm 发布）
│   │   ├── src/
│   │   │   ├── index.ts            # 入口：导出组件 + install 方法
│   │   │   ├── Flipbook.vue        # 核心单文件组件（~870 行）
│   │   │   ├── flipProps.ts        # Props 定义与类型
│   │   │   ├── index-types.ts      # emits 类型声明
│   │   │   ├── utils.ts            # 翻页数学计算（旋转、光照、矩阵等）
│   │   │   ├── useZoom.ts          # 缩放逻辑 composable
│   │   │   ├── useImageLoad.ts     # 图片加载与 URL 管理 composable
│   │   │   ├── matrix.ts           # rematrix 的面向对象封装
│   │   │   ├── spinner.svg         # 默认加载中 SVG
│   │   │   ├── vite-env.d.ts       # Vite 客户端类型
│   │   │   └── shims-vue.d.ts      # *.vue 模块声明
│   │   ├── typings/                # 构建产物类型声明（与 src 对应）
│   │   ├── dist/                   # Vite 构建产物（ES / CJS / UMD + CSS）
│   │   ├── vite.config.ts          # 库构建配置（external: vue）
│   │   ├── package.json            # 库包元数据，peerDependencies: vue >=3.3 <4
│   │   └── publish.js              # 自定义 npm 发布脚本（自动 bump patch）
│   └── storybook/              # 演示与测试包（private，不发布）
│       ├── src/
│       │   ├── main.ts               # 应用入口（Pinia）
│       │   ├── App.vue               # 根组件（挂载 demo.vue）
│       │   ├── views/
│       │   │   ├── demo.vue          # 独立 Vite 应用演示页
│       │   │   └── Ribbon.vue        # 辅助视图
│       │   ├── stories/
│       │   │   ├── Flipbook.stories.ts   # Storybook 主文档与控件
│       │   │   ├── FlipDemo.stories.ts   # 完整交互示例
│       │   │   └── FlipPerf.stories.ts   # 性能统计示例
│       │   ├── test/
│       │   │   └── pageUrl.test.js       # Vitest 单元测试
│       │   └── assets/images/        # 演示图片（6 张普通 + 6 张高清）
│       ├── .storybook/
│       │   ├── main.ts               # Storybook 配置
│       │   └── preview.ts            # Storybook preview 参数
│       ├── vite.config.ts            # 应用构建配置（含 Vitest）
│       └── package.json
└── .github/workflows/deploy.yaml   # CI：build → build-storybook → gh-pages
```

---

## 4. 常用命令

> 所有命令均在仓库根目录执行。根 `package.json` 的 `scripts` 通过 `--prefix` 或 workspace 机制代理到子包。

| 命令 | 作用 |
|------|------|
| `pnpm install` | 安装全仓库依赖 |
| `pnpm dev` | 启动 Storybook 开发服务器（端口 `6006`） |
| `pnpm storybook` | 同上 |
| `pnpm build` | 构建库包（输出到 `packages/Flipbook/dist/`） |
| `pnpm build-storybook` | 构建静态 Storybook（输出到 `packages/storybook/storybook-static/`） |
| `pnpm deploy-storybook` | 将静态 Storybook 部署到 GitHub Pages（通过 `gh-pages`） |
| `pnpm test` | 运行 `packages/storybook` 下的 Vitest 测试 |
| `pnpm lint` | ESLint 自动修复（`packages/*/src/**/*.{js,ts,vue}`） |
| `pnpm format` | Prettier 格式化（`packages/*/src/**/*.{js,ts,json,css,less,scss,vue,html,md}`） |
| `pnpm style` | Stylelint 自动修复（CSS/SCSS/Vue） |
| `pnpm publish` | 执行 `packages/Flipbook/publish.js`：自动 bump patch 版本并发布到 npm |

---

## 5. 代码风格与开发约定

### 5.1 语言与注释
- 源代码中的注释以 **中文** 为主；README、Storybook 描述同时包含中英文。
- 提交信息未强制规范，但代码审查通过 GitHub PR 进行。

### 5.2 TypeScript
- 根 `tsconfig.json` 启用 `strict: true`、`noUnusedLocals: true`、`noUnusedParameters: true`。
- `moduleResolution` 为 `bundler`，允许 `allowImportingTsExtensions`。
- 子包各自拥有 `tsconfig.json` / `tsconfig.node.json`。

### 5.3 ESLint 关键规则
- 使用单引号（`quotes: single`），结尾**不加**分号（`semi: false`）。
- 最大行宽 120（`max-len: 120`），忽略 URL、正则、注释、SVG `d` 属性。
- 对象字面量强制空格（`object-curly-spacing: always`）。
- 文件末尾必须有空行（`eol-last: always`）。
- 不允许多个连续空行（`no-multiple-empty-lines: max 1`）。
- Vue 组件名允许多词（`vue/multi-word-component-names: off`）。
- `no-console` 与 `no-debugger` 均为 `warn` 级别。

### 5.4 Prettier 关键配置
- `printWidth: 100`，`tabWidth: 2`，`useTabs: false`
- `singleQuote: true`，`trailingComma: 'none'`
- `semi: false`
- `arrowParens: 'always'`

### 5.5 Stylelint
- 继承 `stylelint-config-recommended` + `stylelint-config-standard` + `stylelint-config-recommended-vue`
- 缩进使用 `tab`（注意与 Prettier 的 2 空格区分；实际以 Stylelint 修复为准）
- `selector-class-pattern` 已关闭，允许任意类名

### 5.6 Git Hooks
- `pre-commit` 阶段运行 `lint-staged`：
  - `*.{js,ts,vue}` → `eslint --fix`
  - `*.{css,vue}` → `stylelint --fix`

---

## 6. 组件架构与关键模块

### 6.1 `Flipbook.vue`（核心组件）
- 通过 `defineProps(flipProps)` 接收参数，通过 `defineEmits<emitEvents>` 抛出事件。
- 页面渲染逻辑：
  - 正常状态：直接显示 `<img>` 标签（左页 + 右页）。
  - 翻页动画状态：将页面拆分为 `nPolygons` 个水平矩形片段（`.polygon`），每个片段独立应用 3D CSS `transform` 与光照渐变（`.lighting`），模拟弯曲翻页效果。
- 交互事件链路：`touchstart/pointerdown/mousedown` → `swipeStart` → `swipeMove` → `swipeEnd`；支持触控、鼠标、指针三种输入。
- 缩放通过 `useZoom` composable 实现；图片加载与预加载通过 `useImageLoad` composable 实现。

### 6.2 `utils.ts`（数学与图形）
- `calculatePageRotation` / `calculatePageMatrix`：计算翻页过程中的旋转角与变换矩阵。
- `calculateThetaAndRadius` / `calculateXAndZ`：将翻页进度映射为 3D 空间中的圆弧坐标。
- `computeLighting`：根据旋转角度生成环境光与高光渐变，增强 3D 真实感。
- `easeInOut`：翻页与缩放的缓动函数。

### 6.3 `matrix.ts`
- 对 `rematrix` 的轻量面向对象封装，提供 `translate3d`、`rotateY`、`perspective`、`transformX` 等方法，供 `utils.ts` 拼接复杂 3D 变换。

### 6.4 `useZoom.ts`
- 维护 `zoom`（当前倍率）、`zooming`（是否动画中）、`scrollLeft`/`scrollTop`。
- 支持逐级缩放（`zooms` 数组）与点击定点缩放（`zoomAt`）。
- 缩放动画使用 `requestAnimationFrame` + `easeInOut` 插值。

### 6.5 `useImageLoad.ts`
- 管理 `imageWidth` / `imageHeight`（从首张加载成功的图片获取原始尺寸，用于后续比例缩放）。
- `pageUrl(page, hiRes)`：根据当前缩放状态返回普通图或高清图 URL。
- `loadImage(url)`：首次加载时返回 `loadingImage`（默认内置 spinner），加载完成后缓存。

---

## 7. 测试策略

- **测试运行器**：Vitest（配置在 `packages/storybook/vite.config.ts` 中，`environment: 'jsdom'`）。
- **测试位置**：`packages/storybook/src/test/`。
- **当前覆盖范围**：非常有限，仅有 `pageUrl.test.js`，测试 `useImageLoad` 中的 `pageUrl` 方法在不同 zoom/HiRes 条件下的返回值。
- **组件测试工具**：`@vue/test-utils` 已安装，但尚未大规模使用。
- **运行方式**：
  - 交互模式：`pnpm test`
  - 单次运行：`pnpm -C packages/storybook test -- --run`
  - 覆盖率：`pnpm -C packages/storybook coverage`

> **注意**：如果你需要新增测试，请在 `packages/storybook/src/test/` 下创建 `.test.js` 或 `.test.ts` 文件，Vitest 会自动发现。

---

## 8. 构建与发布流程

### 8.1 库包构建
`packages/Flipbook/vite.config.ts` 配置为 library mode：

- `entry`: `src/index.ts`
- `formats`: `['es', 'cjs', 'umd']`
- `external`: `['vue']`（不打包 Vue，作为 `peerDependency`）
- `sourcemap: true`
- 输出产物：
  - `dist/vue3-flipbook.mjs`（ES module）
  - `dist/vue3-flipbook.js`（CJS）
  - `dist/vue3-flipbook.umd.js`（UMD）
  - `dist/vue3-flipbook.css`（组件样式）

### 8.2 npm 发布
通过 `pnpm publish` 触发 `packages/Flipbook/publish.js`：

1. 读取 npm 线上最新版本。
2. 本地执行 `npm version --no-git-tag-version patch` 生成新版本号。
3. 写回 `package.json`。
4. 使用 `NPM_AUTH_TOKEN` 环境变量鉴权并发布。
5. 打 Git tag 并推送。

> 发布需要环境变量 `NPM_AUTH_TOKEN`，否则脚本会抛出错误。

### 8.3 Storybook 站点部署
`.github/workflows/deploy.yaml`：

- 触发条件：`push`、`pull_request`
- Node 版本：`20.x`
- 步骤：`pnpm install` → `pnpm build` → `pnpm build-storybook` → 部署 `./packages/storybook/storybook-static` 到 GitHub Pages
- 使用 `secrets.PERSONAL_SECRET_TOKEN2` 作为部署凭据

---

## 9. 安全与依赖注意事项

- `vue` 是 `peerDependency`（`>=3.3 <4`），库构建产物**不**包含 Vue 运行时。
- 3D 翻页效果依赖 CSS `transform-style: preserve-3d` 与 `perspective`，在旧版浏览器（如 IE）上无法工作；`browserslist` 配置为 `> 0.25%, not dead`。
- 发布脚本 `publish.js` 使用 `child_process.execSync` 执行 shell 命令，并直接拼接环境变量到命令行。虽然仅在 CI/本地发布场景使用，但修改时需注意命令注入风险。

---

## 10. 快速上手（给 Agent 的备忘录）

```bash
# 1. 安装依赖
pnpm install

# 2. 启动 Storybook 进行开发调试
pnpm dev

# 3. 修改库代码后，构建库包
pnpm build

# 4. 运行测试
pnpm test

# 5. 提交前自动检查
pnpm lint && pnpm format && pnpm style
```

- 修改库组件代码 → 文件在 `packages/Flipbook/src/`
- 修改演示/文档 → 文件在 `packages/storybook/src/stories/`
- 新增测试 → 文件在 `packages/storybook/src/test/`
- 样式统一使用 **SCSS**，嵌套在 `.vue` 文件的 `<style lang="scss">` 中
