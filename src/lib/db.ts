import Dexie, { type Table } from "dexie";
import { UIMessage } from "ai";
import { useQuery } from "@tanstack/react-query";

export interface ChatSession {
  id: string; // 对话 ID
  name: string; // 对话名字
  messages: UIMessage[]; // 消息数组
  updatedAt: number;
  createdAt?: number;
}

export class MyDatabase extends Dexie {
  chats!: Table<ChatSession>;
  constructor() {
    super("ChatHistoryDB");
    // 定义版本和索引，v6 建议为 updatedAt 建立索引以便排序
    this.version(1).stores({
      chats: "id, updatedAt, createAt",
    });
  }
}

export const db = new MyDatabase();

export function useChatsList() {
  return useQuery({
    queryKey: ["queryChats"],
    staleTime: 1000,
    refetchOnMount: "always",
    queryFn: async () => db.chats.toArray(),
  });
}
