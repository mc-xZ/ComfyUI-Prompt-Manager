# ComfyUI Prompt Manager

一个独立于 LoRA Manager 的 ComfyUI 插件，用于管理 Prompt 提示词。

## 功能特性

- 🎨 **独立运行**：不依赖 LoRA Manager，可单独使用
- 🔝 **顶栏集成**：在 ComfyUI 顶栏添加快速访问按钮
- 📦 **Prompt 管理**：完整的 Prompt 浏览器和管理界面
- 💾 **本地存储**：使用浏览器 IndexedDB 存储数据
- 🌙 **主题支持**：支持日间/夜间模式切换
- 📱 **响应式设计**：适配不同屏幕尺寸

## 安装方法

1. 将本插件文件夹复制到 ComfyUI 的 `custom_nodes` 目录：
   ```
   ComfyUI/custom_nodes/ComfyUI-Prompt-Manager/
   ```

2. 重启 ComfyUI

3. 访问地址：`http://127.0.0.1:8188/prompt`

## 使用方法

### 通过顶栏按钮打开
- 在 ComfyUI 界面的顶栏会看到一个绿色的 "P" 按钮
- 点击即可打开 Prompt Manager
- Shift+点击可在新窗口打开

### 直接访问
- 浏览器访问：`http://127.0.0.1:8188/prompt`

## 文件结构

```
ComfyUI-Prompt-Manager/
├── __init__.py              # 插件入口，注册路由和API
├── pyproject.toml           # 插件配置
├── README.md                # 说明文档
├── static/                  # 静态资源
│   └── prompt/
│       └── Prompt.html      # Prompt管理器前端页面
├── web/                     # ComfyUI前端扩展
│   └── comfyui/
│       ├── style.css        # 顶栏按钮样式
│       └── top_prompt_icon.js  # 顶栏按钮逻辑
└── data/                    # 数据存储目录
```

## API 接口

- `GET /prompt` - Prompt Manager 主页面
- `GET /prompt_static/{path}` - 静态资源
- `GET /api/prompt-manager/version` - 获取版本信息
- `GET /api/prompt-manager/config` - 获取配置
- `POST /api/prompt-manager/config` - 保存配置

## 注意事项

1. 数据存储在浏览器 IndexedDB 中，清除浏览器数据会丢失
2. 建议定期导出备份重要数据
3. 与 LoRA Manager 完全独立，数据不互通

## 许可证

与 LoRA Manager 相同
