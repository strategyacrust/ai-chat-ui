import { useChat } from "@ai-sdk/react";
import { ChatTransport, DirectChatTransport, generateId, ToolLoopAgent, UIMessage } from "ai";
import { last } from "es-toolkit";
import { useEffect } from "react";
import { db, useChatsList } from "./db";
import { MODEL, useCurrentModel } from "./model";

const mapCache: { [k: number]: ChatTransport<UIMessage> } = {};
const cacheTransport = (model: MODEL) => {
  if (!mapCache[model.id]) mapCache[model.id] = new DirectChatTransport({ agent: new ToolLoopAgent({ model: model.model }) }) as any;
  return mapCache[model.id];
};

export const useAChat = () => {
  const model = useCurrentModel();
  const { data } = useChatsList();
  const lastChat = last(data ?? []);
  const id = lastChat?.id ?? generateId();
  const name = lastChat?.name ?? "Chat Default Name";
  const chatHandler = useChat({
    id,
    transport: cacheTransport(model),
    onFinish: (opt) => {
      console.info("onFinish:", opt);
      if (opt.isAbort || opt.isError || opt.isDisconnect) return;
      async function save() {
        const chat = await db.chats.where({ id }).first();
        const createAt = chat?.createdAt ?? Date.now();
        await db.chats.put({ id, name, messages: opt.messages, updatedAt: Date.now(), createdAt: createAt }, [id]);
      }
      save().catch(console.error);
    },
  });
  useEffect(() => {
    if (chatHandler.messages.length == 0 && lastChat) {
      chatHandler.setMessages(lastChat.messages);
    } else {
      chatHandler.setMessages([]);
    }
  }, [lastChat]);

  return chatHandler;
};
