'use client'

import { models } from '@/lib/model'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MessageCircle, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const nav = useNavigate()
  return (
    <div className="h-dvh pt-10">
      <section className="relative py-20 px-6 text-center overflow-hidden bg-linear-to-br from-orange-300 to-sky-300">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-6 mb-6">
            <img
              src="/logo-full.svg"
              alt="Logo"
              className="w-[clamp(200px,20vw,500px)]"
            />
            <h1 className="text-[clamp(30px,5vw,60px)] px-1 font-bold relative w-fit">
              <span className="">Compute Network</span>
              <span className="absolute top-0 left-full font-light text-xs px-2 py-1 rounded-md bg-yellow-400">
                AlphaTest
              </span>
            </h1>
          </div>
        </div>
      </section>
      <section className="py-10 px-4 max-w-7xl mx-auto">
        <div className='text-lg mb-5'>Chat with AI models form SAC providers</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <div
              key={index}
              onClick={() => nav({ to: '/chat', search: { modelId: model.id } })}
              className="cursor-pointer flex flex-col gap-4 rounded-xl border border-orange-400 p-4 md:p-6 transition-all duration-300 hover:shadow-lg shadow-orange-500/10"
            >
              <div className='flex items-center gap-2'>
                <img className="w-6 h-6 object-contain" src={model.icon} />
                <h3 className="text-xl font-semibold">{model.name}</h3>
                <div className='text-xs px-2 py-1 rounded-md bg-green-300'>TEE</div>
              </div>
              <div className='grid grid-cols-2 gap-4 font-medium text-orange-400'>
                <div className='justify-center gap-2 flex items-center border border-orange-400 rounded-md py-2.5'>
                  <MessageCircle className='text-xl opacity-60' /> Chat
                </div>
                <div className='justify-center gap-2 flex items-center border border-orange-400 rounded-md py-2.5'>
                  <ShieldCheck className='text-xl opacity-60' /> Attestation
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
