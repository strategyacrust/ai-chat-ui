'use client'

import { AChatSection } from '@/components/chat'
import { useAChat } from '@/lib/ai-hook'
import { useCurrentModel } from '@/lib/model'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'
import z from 'zod'

function CurrentModelUI() {
  const model = useCurrentModel()
  return <div className='flex items-center w-full gap-2 px-4 py-2 text-sm border-b border-b-orange-400'>
    <span className='font-medium'>{model.name}</span>
    <div className='text-xs px-2 py-1 rounded-md flex items-center gap-1'><CheckCircle className='text-green-400 text-xl' /> TEE Verified</div>
  </div>
}

function ChatPage() {
  const handler = useAChat()
  return (
    <div className="relative flex flex-col h-dvh bg-white pt-20 overflow-y-auto">
      <CurrentModelUI />
      <AChatSection handler={handler as any} />
    </div>
  )
}

export const Route = createFileRoute('/chat')({
  validateSearch: z.object({
    modelId: z.number().optional()
  }),
  component: ChatPage,
})
