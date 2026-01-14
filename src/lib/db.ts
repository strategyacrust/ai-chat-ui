import { UseInfiniteQueryResult, useQuery } from "@tanstack/react-query";
import { generateId, UIMessage } from "ai";
import Dexie, { EntityTable } from "dexie";

export interface ChatSession {
  id: string; // 对话 ID
  name: string; // 对话名字
  messages: UIMessage[]; // 消息数组
  updatedAt: number;
  createdAt: number;
}

export class MyDatabase extends Dexie {
  chats!: EntityTable<ChatSession, "id">;
  constructor() {
    super("ChatHistoryDB");
    // 定义版本和索引，v6 建议为 updatedAt 建立索引以便排序
    this.version(1).stores({
      chats: "id, updatedAt, createAt",
    });
  }
}

export const db = new MyDatabase();

export const defChats = [{ id: generateId(), name: "New Chat", messages: [], updatedAt: Date.now(), createdAt: Date.now() } as ChatSession];
export function useChatsList() {
  return useQuery({
    queryKey: ["queryChats"],
    staleTime: 1000,
    refetchOnMount: "always",
    initialData: defChats,
    initialDataUpdatedAt: 1000,
    queryFn: async () => {
      const data = await db.chats.toArray();
      if (data.length == 0) return defChats;
      return data.sort((a, b) => b.updatedAt - a.updatedAt);
    },
  });
}
