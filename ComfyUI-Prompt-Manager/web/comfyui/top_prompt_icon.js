// Prompt Manager - 顶栏按钮扩展
// 路径：ComfyUI-Lora-Manager/web/comfyui/top_prompt_icon.js

/**
 * 顶部Prompt标识（P）- 一键正常打开HTML + 定制圆润大写P样式
 */
class TopPromptIconManager {
  constructor() {
    this.iconId = "lm-top-prompt-icon";
    // 使用Prompt Manager的HTTP静态路径
    this.htmlUrl = "/prompt_static/prompt/Prompt.html";
    this.isInitialized = false;
    // 定制样式：粉色背景 + 白色实心框 + 圆润大写P
    this.customStyle = {
      bgColor: "#ff69b4",       // 粉色背景
      boxBg: "#ffffff",         // 白色实心方框
      textColor: "#ff69b4",     // 粉色大写P
      hoverBg: "rgba(255, 105, 180, 0.8)", // 悬浮浅粉
      boxSize: "18px",          // 小方框尺寸
      font: "'Microsoft YaHei', '思源黑体', Arial, sans-serif" // 圆润字体
    };
  }

  // 初始化
  initialize() {
    if (this.isInitialized) return;

    // 等待顶栏容器加载
    const checkContainer = setInterval(() => {
      // 参考LoRA Manager的实现：使用app.menu?.settingsGroup
      const settingsGroup = app?.menu?.settingsGroup;
      
      if (settingsGroup?.element?.parentElement) {
        clearInterval(checkContainer);
        this.createPromptIcon(settingsGroup);
        this.bindClickEvent();
        this.isInitialized = true;
        console.log("[Prompt Icon] 标识加载完成，点击一键打开Prompt.html");
        return;
      }
      
      // 兜底：尝试其他选择器
      const topMenu = document.querySelector(".lm-top-menu") ||
                      document.querySelector("[class*='lora-manager-top-menu']") ||
                      document.querySelector(".comfyui-menu") ||
                      document.querySelector("[class*='top-menu']") ||
                      document.querySelector("#comfyui-menu") ||
                      document.querySelector(".p-panelmenu");

      if (topMenu) {
        clearInterval(checkContainer);
        this.createPromptIconFallback(topMenu);
        this.bindClickEvent();
        this.isInitialized = true;
        console.log("[Prompt Icon] 标识加载完成（兜底模式）");
      }
    }, 200);

    // 兜底超时
    setTimeout(() => {
      clearInterval(checkContainer);
      if (!this.isInitialized) {
        this.createFallbackContainer();
        this.createPromptIconFallback(document.getElementById("prompt-fallback-container"));
        this.bindClickEvent();
        this.isInitialized = true;
      }
    }, 3000);
  }

  // 创建定制粉色P标识（参考LoRA Manager的实现，插入到settingsGroup之前）
  createPromptIcon(settingsGroup) {
    if (document.getElementById(this.iconId)) return;

    const promptIcon = document.createElement("button");
    promptIcon.id = this.iconId;
    // 核心样式 - 使用flex布局确保P居中
    promptIcon.style.cssText = `
      width: auto;
      height: auto;
      border-radius: 4px;
      background: ${this.customStyle.bgColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-left: 8px;
      font-size: 18px;
      font-weight: bold;
      transition: background 0.2s ease;
      padding: 6px;
      box-sizing: border-box;
      overflow: visible;
      flex-shrink: 0;
    `;
    // 悬浮效果 - 不使用transform避免布局变化
    promptIcon.onmouseover = () => {
      promptIcon.style.background = this.customStyle.hoverBg;
    };
    promptIcon.onmouseout = () => {
      promptIcon.style.background = this.customStyle.bgColor;
    };
    // 白色实心小方框 + 圆润大写P - 使用flex居中
    promptIcon.innerHTML = `
      <span style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background: ${this.customStyle.boxBg};
        border-radius: 3px;
        font-family: ${this.customStyle.font};
        font-size: 12px;
        font-weight: 700;
        color: ${this.customStyle.textColor};
        text-transform: uppercase;
        line-height: 1;
      ">P</span>
    `;
    promptIcon.title = "Prompt工具箱 (Shift+点击小窗口打开)";
    
    // 参考LoRA Manager的实现：插入到settingsGroup之前
    settingsGroup.element.before(promptIcon);
  }

  // 兜底模式：直接插入到容器
  createPromptIconFallback(container) {
    if (!container || document.getElementById(this.iconId)) return;

    const promptIcon = document.createElement("button");
    promptIcon.id = this.iconId;
    // 核心样式 - 参考LoRA Manager的大小
    promptIcon.style.cssText = `
      width: auto;
      height: auto;
      border-radius: 4px;
      background: ${this.customStyle.bgColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-left: 8px;
      font-size: 18px;
      font-weight: bold;
      transition: background 0.2s ease;
      padding: 6px;
      box-sizing: border-box;
      overflow: visible;
      flex-shrink: 0;
    `;
    // 悬浮效果 - 不使用transform避免布局变化
    promptIcon.onmouseover = () => {
      promptIcon.style.background = this.customStyle.hoverBg;
    };
    promptIcon.onmouseout = () => {
      promptIcon.style.background = this.customStyle.bgColor;
    };
    // 白色实心小方框 + 圆润大写P - 20px大小参考LoRA Manager
    promptIcon.innerHTML = `
      <span style="
        display: flex;
        align-items: center;
        justify-content: center;
    0   width: 20px;
    20  height: 20px;
        background: ${this.customStyle.boxBg};
        border-radius: 3px;
        font-family: ${this.customStyle.font};
        2ont-size: 12px;
        font-weight: 700;
        color: ${this.customStyle.textColor};
        text-transform: uppercase;
        line-height: 1;
      ">P</span>
    `;
    promptIcon.title = "Prompt工具箱 (Shift    +点击小窗口打开)";
    
    container.appendChild(promptIcon);
  }

  // 备用容器
  createFallbackContainer() {
    let container = document.getElementById("prompt-fallback-container");
    if (container) return;
    container = document.createElement("div");
    container.id = "prompt-fallback-container";
    container.style.cssText = `
      position: fixed;
      top: 10px;
      right: 200px;
      z-index: 99999;
      display: flex;
      gap: 8px;
    `;
    document.body.appendChild(container);
  }

  // 点击事件：普通点击新标签页打开，Shift+点击小窗口打开
  bindClickEvent() {
    const icon = document.getElementById(this.iconId);
    if (!icon) return;

    icon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Shift+点击：小窗口打开
      if (e.shiftKey) {
        const features = "width=1200,height=800,resizable=yes,scrollbars=yes,status=yes";
        window.open(this.htmlUrl, "_blank", features);
      } else {
        // 普通点击：新标签页打开
        window.open(this.htmlUrl, "_blank");
      }
    });
  }
}

// 启动初始化
function initPromptIcon() {
  const iconManager = new TopPromptIconManager();
  setTimeout(() => {
    iconManager.initialize();
  }, 1500);
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPromptIcon);
} else {
  initPromptIcon();
}
