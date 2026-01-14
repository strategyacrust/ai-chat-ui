import { LanguageModelV3 } from "@ai-sdk/provider";
import { useSearch } from "@tanstack/react-router";
import { createOllama } from "ollama-ai-provider-v2";
import deepseekIcon from "/deepseek.svg?url";
import { useChatsList } from "./db";

const ollamaProvider = createOllama({ baseURL: "https://sac-ds-api.crustnetwork.io/api" });
// const deepseekProvider = createDeepSeek({ baseURL: "https://sac-ds-api.crustnetwork.io" });
// const openaiProvider = createOpenAI({ baseURL: "https://sac-ds-api.crustnetwork.io/v2", apiKey: "-" });
export type MODEL = { id: number; name: string; icon: string; desc?: string; model: LanguageModelV3 };

export const models: MODEL[] = [
  {
    id: 100001,
    name: "DeepSeek-R1",
    icon: deepseekIcon,
    model: ollamaProvider("deepseek-r1:8b"),
  },
];

export function useCurrentModel() {
  const sq = useSearch({ strict: false });
  const model = models.find((m) => m.id === sq.modelId) ?? models[0];
  return model;
}

export function useCurrentChatId() {
  const sq = useSearch({ strict: false });
  return sq.chatId;
}

export function useCurrentChat() {
  const chatId = useCurrentChatId();
  const { data: chats } = useChatsList();
  const currentChat = chats.find((c) => c.id == chatId) ?? chats[0];
  return currentChat!;
}
