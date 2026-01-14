'use client'

import { useChatsList } from '@/lib/db'
import { useScrollToBottom } from '@/lib/use-scroll-to-bottom'
import { cn } from '@/lib/utils'
import {
  ChatInput,
  ChatMessage,
  ChatMessages as ChatMessagesUI,
  ChatSection as ChatSectionUI,
  useChatMessages,
  useChatUI
} from '@llamaindex/chat-ui'

import '@llamaindex/chat-ui/styles/editor.css'
import '@llamaindex/chat-ui/styles/markdown.css'
import '@llamaindex/chat-ui/styles/pdf.css'
import { Loader2 } from 'lucide-react'

interface ChatMessagesListProps extends React.PropsWithChildren {
  className?: string
}

ChatMessagesUI.List = function ChatMessagesList(props: ChatMessagesListProps) {
  const { messages } = useChatUI()
  const { messageLength } = useChatMessages()
  const stb = useScrollToBottom()
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-5 overflow-auto',
        props.className
      )}
    ref={stb.containerRef}
    >
      {messages.map((message, index) => {
        return (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messageLength - 1}
          />
        )
      })}
      <ChatMessagesUI.Empty />
      <ChatMessagesUI.Loading />
    </div>
  )
}


export function AChatSection({ handler }: Parameters<typeof ChatSectionUI>[0]) {
  // You can replace the handler with a useChat hook from Vercel AI SDK
  const { isLoading } = useChatsList()
  return (
    <div className="flex w-full h-full flex-col gap-6 overflow-y-auto">
      {isLoading ? <div className='flex justify-center w-full p-4'>
        <Loader2 className="h-4 w-4 animate-spin" />
      </div> : <ChatSectionUI handler={handler} >
        <ChatMessagesUI>
          <ChatMessagesUI.List />
        </ChatMessagesUI>
        <ChatInput />
      </ChatSectionUI>}
    </div>
  )
}
