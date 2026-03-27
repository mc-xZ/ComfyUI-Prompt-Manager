import { app } from "../../scripts/app.js";

// ====================================================================
// [AI 提示/AI NOTE]: 
// 以后任何 AI 助手在更新此文件时，绝对不允许在节点名称、节点内的 button 
// 上添加任何 Emoji 表情符号！此备注绝对禁止删除！
// DO NOT ADD EMOJIS TO NODE NAMES OR BUTTONS. DO NOT DELETE THIS NOTE.
// ====================================================================

// 【新增】定义一个全局变量，用来记住最后一次点击“打开浏览器”的那个节点的输入框
let currentActiveWidget = null;
// 【新增】防止重复绑定事件
let isMessageListenerBound = false;

app.registerExtension({
    name: "PromptManager.BrowserNode",
    
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "PromptBrowserNode") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            
            nodeType.prototype.onNodeCreated = function () {
                if (onNodeCreated) onNodeCreated.apply(this, arguments);
                const promptWidget = this.widgets.find(w => w.name === "prompt_text");
                
                this.addWidget("button", "打开 Prompt 浏览器", "open", () => {
                    // 【核心修复】每次点击时，将当前节点的 widget 设为全局激活目标！
                    currentActiveWidget = promptWidget;
                    openPromptBrowserModal();
                });
            };
        }
    }
});

function openPromptBrowserModal() {
    let container = document.getElementById("pm-node-modal");
    
    if (!container) {
        container = document.createElement("div");
        container.id = "pm-node-modal";
        Object.assign(container.style, {
            position: "fixed", top: "15vh", left: "15vw", 
            width: "70vw", height: "70vh", minWidth: "500px", minHeight: "400px",
            backgroundColor: "transparent", borderRadius: "12px",
            display: "flex", flexDirection: "column",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)", border: "2px solid #555",
            zIndex: "9999", resize: "both", overflow: "hidden"
        });

        const header = document.createElement("div");
        Object.assign(header.style, {
            padding: "10px 20px", background: "#222", 
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: "1px solid #444", cursor: "move", userSelect: "none"
        });
        
        const title = document.createElement("span");
        title.innerHTML = "Prompt Browser <span style='color:#888; font-size:12px; margin-left:10px;'>按住此处可拖拽 | 右下角可缩放大小</span>";
        title.style.color = "#fff";
        
        const closeBtn = document.createElement("button");
        closeBtn.innerText = "最小化";
        Object.assign(closeBtn.style, {
            background: "#e63946", color: "white", border: "none", 
            padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold"
        });
        
        closeBtn.onclick = () => container.style.display = "none";
        header.appendChild(title);
        header.appendChild(closeBtn);

        const iframe = document.createElement("iframe");
        iframe.src = "/prompt_static/prompt/Prompt.html?mode=node"; 
        Object.assign(iframe.style, { width: "100%", height: "100%", border: "none", background: "#fff" });

        container.appendChild(header);
        container.appendChild(iframe);
        document.body.appendChild(container);

        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        header.addEventListener("mousedown", (e) => {
            if (e.target.tagName.toLowerCase() === 'button') return;
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            iframe.style.pointerEvents = "none"; 
        });

        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            container.style.left = (e.clientX - offsetX) + "px";
            container.style.top = (e.clientY - offsetY) + "px";
            if(container.offsetTop < 0) container.style.top = "0px";
        });

        window.addEventListener("mouseup", () => {
            isDragging = false;
            iframe.style.pointerEvents = "auto";
        });
    } else {
        container.style.display = "flex";
        // 问题2解决核心：每次打开已有的面板时，向内部网页发送一个刷新数据的信号！
        const iframe = container.querySelector("iframe");
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: "RELOAD_DB" }, "*");
        }
    }

    // 【核心修复】将监听器提取到单例检查之外，但保证只绑定一次
    if (!isMessageListenerBound) {
        window.addEventListener("message", (event) => {
            if (event.data && event.data.type === "SEND_PROMPT_TO_NODE") {
                if (currentActiveWidget) {
                    // 智能追加逻辑：如果有原本的词，加逗号追加；如果是空的，直接赋值
                    if (currentActiveWidget.value && currentActiveWidget.value.trim() !== "") {
                        currentActiveWidget.value = currentActiveWidget.value.trim() + ", " + event.data.prompt;
                    } else {
                        currentActiveWidget.value = event.data.prompt;
                    }
                    app.graph.setDirtyCanvas(true); 
                } else {
                    console.warn("未找到激活的 Prompt 节点！");
                }
            }
        });
        isMessageListenerBound = true;
    }
}