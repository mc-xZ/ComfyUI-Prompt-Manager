import os
import server
from aiohttp import web
import json

# 插件根目录
NODE_ROOT = os.path.dirname(os.path.abspath(__file__))
# 静态资源目录
STATIC_DIR = os.path.join(NODE_ROOT, "static")
# 让ComfyUI自动加载web/comfyui下的所有JS
WEB_DIRECTORY = os.path.join(NODE_ROOT, "web", "comfyui")

# 数据存储目录
DATA_DIR = os.path.join(NODE_ROOT, "data")
os.makedirs(DATA_DIR, exist_ok=True)

# ============ API 路由 ============

# 主页面路由
@server.PromptServer.instance.routes.get("/prompt")
async def serve_prompt_page(request):
    return web.FileResponse(os.path.join(STATIC_DIR, "prompt", "Prompt.html"))

# 静态资源路由
@server.PromptServer.instance.routes.get("/prompt_static/{path:.*}")
async def serve_prompt_static(request):
    path = request.match_info["path"]
    file_path = os.path.join(STATIC_DIR, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return web.FileResponse(file_path)
    return web.Response(status=404)

# 数据API - 获取配置
@server.PromptServer.instance.routes.get("/api/prompt-manager/config")
async def get_config(request):
    config_path = os.path.join(DATA_DIR, "config.json")
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            return web.json_response(json.load(f))
    return web.json_response({"success": True, "data": {}})

# 数据API - 保存配置
@server.PromptServer.instance.routes.post("/api/prompt-manager/config")
async def save_config(request):
    try:
        data = await request.json()
        config_path = os.path.join(DATA_DIR, "config.json")
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return web.json_response({"success": True})
    except Exception as e:
        return web.json_response({"success": False, "error": str(e)})

# 数据API - 导出数据
@server.PromptServer.instance.routes.get("/api/prompt-manager/export")
async def export_data(request):
    try:
        # 这里可以导出IndexedDB数据到服务器
        return web.json_response({"success": True, "message": "请使用浏览器导出功能"})
    except Exception as e:
        return web.json_response({"success": False, "error": str(e)})

# 数据API - 导入数据
@server.PromptServer.instance.routes.post("/api/prompt-manager/import")
async def import_data(request):
    try:
        data = await request.json()
        # 这里可以处理从服务器导入的数据
        return web.json_response({"success": True})
    except Exception as e:
        return web.json_response({"success": False, "error": str(e)})

# 版本信息API
@server.PromptServer.instance.routes.get("/api/prompt-manager/version")
async def get_version(request):
    return web.json_response({
        "success": True,
        "version": "1.0.0",
        "name": "Prompt Manager"
    })

# 插件标识
NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

print("[Prompt Manager] 插件加载完成 | 访问地址: http://127.0.0.1:8188/prompt")
