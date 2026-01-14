import { useChat } from "@ai-sdk/react";
import { ChatTransport, DirectChatTransport, ToolLoopAgent, UIMessage } from "ai";
import { useEffect } from "react";
import { db } from "./db";
import { MODEL, useCurrentChat, useCurrentModel } from "./model";

const mapCache: { [k: number]: ChatTransport<UIMessage> } = {};
const cacheTransport = (model: MODEL) => {
  if (!mapCache[model.id]) mapCache[model.id] = new DirectChatTransport({ agent: new ToolLoopAgent({ model: model.model }) }) as any;
  return mapCache[model.id];
};

export const useAChat = () => {
  const model = useCurrentModel();
  const currentChat = useCurrentChat();
  const id = currentChat.id;
  const name = currentChat.name;
  const chatHandler = useChat({
    id,
    transport: cacheTransport(model),
    onFinish: (opt) => {
      console.info("onFinish:", opt);
      if (opt.isAbort || opt.isError || opt.isDisconnect) return;
      async function save() {
        const chat = await db.chats.where({ id }).first();
        const createAt = chat?.createdAt ?? Date.now();
        await db.chats.put({ id, name, messages: opt.messages, updatedAt: Date.now(), createdAt: createAt }, id);
      }
      save().catch(console.error);
    },
  });
  useEffect(() => {
    if (chatHandler.messages.length == 0 && currentChat) {
      chatHandler.setMessages(currentChat.messages);
    } else {
      chatHandler.setMessages([]);
    }
  }, [currentChat]);

  return chatHandler;
};
