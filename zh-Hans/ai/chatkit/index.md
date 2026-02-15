---
title: 💬 ChatKit SDK
sidebar_position: 40
---

<Tip>使用 ChatKit 构建并自定义可嵌入的聊天。</Tip>

ChatKit 是构建智能代理型聊天体验的最佳方式。无论你是在打造内部知识库助手、HR 入职助手、研究伴侣、购物或日程安排助手、故障排查机器人、财务规划顾问，还是客户支持代理，ChatKit 都提供可自定义的聊天嵌入来处理所有用户体验细节。

使用 ChatKit 的可嵌入 UI 小组件、可定制提示、工具调用支持、文件附件以及链路推理可视化功能，你无需重新发明聊天界面即可构建智能代理。

## 概述

将 ChatKit 嵌入你的前端，自定义外观与体验，并让用户通过 XpertAI Agent Builder 托管和扩展后端。需要一个开发服务器。

## 开始使用 ChatKit

## 将 ChatKit 嵌入到您的前端

从总体上来说，ChatKit 的设置分为三步：先创建一个托管在 XpertAI 服务器上的智能体工作流，然后配置 ChatKit 并添加功能，以构建你的聊天体验。

![ChatKit 架构图](/public/img/ai/chatkit/Developer-ChatKit-Arch.png)

1. 创建智能体工作流程<br/>
使用 [数字专家工作室](https://app.xpertai.cn/xpert/w/) 创建智能体工作流程。Agent 工作室是一个用于设计多步骤多智能体工作流程的可视化画布。你将获得一个工作流程的数字专家 ID。
嵌入到你的前端的聊天将指向你创建的数字专家工作流程作为后端。

2. 在您的产品中设置 ChatKit<br/>
要设置 ChatKit，您需要创建一个 ChatKit 会话并创建一个后端端点，传入您的数字专家 ID，交换客户端密钥，并添加一个脚本将 ChatKit 嵌入到您的网站中。

  2.1. 在您的服务器上生成客户端 API Key。<br/>
    这段代码启动了一个 FastAPI 服务，其唯一任务是通过 XpertAI API 创建一个新的 ChatKit 会话，并将会话的客户端密钥返回给客户端：
```python
@app.post("/api/create-session")
async def create_session(request: Request) -> JSONResponse:
    # Key vars
    api_key = os.getenv("XPERTAI_API_KEY")
    body = await request.json()

    assistant_id = body.get("assistant_id")          # or resolve from your payload
    user_id = body.get("user_id", "anonymous")       # optional
    api_base = os.getenv("XPERTAI_API_URL", "https://api.xpertai.cn")

    if not api_key or not assistant_id:
        return JSONResponse({"error": "Missing XPERTAI_API_KEY or assistant_id"}, status_code=400)

    async with httpx.AsyncClient(base_url=api_base, timeout=10.0) as client:
        r = await client.post(
            "/v1/chatkit/sessions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={"assistant": {"id": assistant_id}, "user": user_id},
        )

    payload = r.json()
    client_secret = payload.get("client_secret")
    expires_after = payload.get("expires_after")

    if not r.is_success or not client_secret:
        return JSONResponse({"error": payload.get("error", "Failed to create session")}, status_code=502)

    return JSONResponse({"client_secret": client_secret, "expires_after": expires_after})
```

2.2. 在项目目录中，安装 ChatKit React 绑定：

`npm install @xpert-ai/chatkit-react`

2.3 在您的 UI 中渲染 ChatKit。此代码从您的服务器获取客户端密钥并挂载一个实时聊天小部件，连接到您的工作流程作为后端。
```jsx
import { ChatKit, useChatKit } from '@xpert-ai/chatkit-react';

export function MyChat() {
  // Initialize ChatKit
  const chatkit = useChatKit({
    frameUrl: CHATKIT_FRAME_URL || undefined,
    api: {
      apiUrl: XPERT_API_URL,
      xpertId: XPERT_ID,
      getClientSecret: async () => {
        const baseUrl = API_BASE_URL || '';
        const url = `${baseUrl}/api/create-session`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ xpertId: XPERT_ID }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data.client_secret) {
          throw new Error('Missing client_secret in response');
        }

        return data.client_secret;
      },
    },
  });

  return (
    <div className="h-full flex flex-col">
      <ChatKit control={chatkit.control} className="flex-1" />
    </div>
  );
```

## 构建和迭代

请参阅自定义主题、小部件和操作文档，了解 ChatKit 的工作原理。或者，您可以浏览以下资源，测试聊天功能、迭代提示信息，并添加小部件和工具。
