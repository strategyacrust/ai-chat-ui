import { db, useChatsList } from '@/lib/db';
import { useCurrentChat } from '@/lib/model';
import { fmtDate } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { generateId } from 'ai';
import React, { useState } from 'react';

interface Chat {
  id: string;
  name: string;
  messages: any[];
}


const ChatList: React.FC = () => {
  const nav = useNavigate()
  const { data: chats, refetch } = useChatsList()
  const currentChatId = useCurrentChat().id
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartEdit = (chat: Chat) => {
    setEditingId(chat.id);
    setEditingName(chat.name);
  };

  const handleSaveEdit = (chatId: string) => {
    const chat = chats.find(c => c.id == chatId)
    if (!chat) return
    if (editingName.trim()) {
      db.chats.get(chatId).then(old => {
        if (old) {
          db.chats.update(chatId, { name: editingName.trim() }).catch(console.error).finally(refetch)
        } else {
          db.chats.add({ ...chat, name: editingName.trim() }).catch(console.error).finally(refetch)
        }
      })
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handlerCreateChat = () => {
    const nId = generateId()
    db.chats.add({ id: nId, name: 'New Chat', messages: [], createdAt: Date.now(), updatedAt: Date.now() })
      .then(() => {
        nav({ to: '/chat', search: (prev) => ({ ...prev, chatId: nId }) })
      }).catch(console.error).finally(refetch)
  }

  const handleDelete = async (id: string) => {
    db.chats.count().then(count => {
      if (count > 1)
        db.chats.delete(id).then(() => {
          nav({ to: '/chat', search: (prev) => ({ ...prev, chatId: chats.find(item => item.id !== id)?.id }) })
        }).catch(console.error).finally(refetch)
    })
  }

  return (
    <div className="w-full flex flex-col">
      <button
        onClick={handlerCreateChat}
        className="mb-4 cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        + New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              if (currentChatId !== chat.id)
                nav({ to: '/chat', search: (prev) => ({ ...prev, chatId: chat.id }) })
            }}
            className={`mb-2 p-3 bg-white rounded-md cursor-pointer transition-all ${currentChatId === chat.id ? 'bg-blue-50 border border-blue-500' : 'hover:shadow-md'
              }`}
          >
            <div className='text-xs opacity-60'>{fmtDate(chat.updatedAt)}</div>
            {editingId === chat.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(chat.id);
                    }
                    if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                    e.stopPropagation()
                  }}
                  autoFocus
                  className="flex-1 w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSaveEdit(chat.id)
                    }}
                    className="cursor-pointer px-2 py-1 text-xs border border-gray-300 rounded hover:text-blue-500 hover:border-blue-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancelEdit()
                    }}
                    className="cursor-pointer px-2 py-1 text-xs border border-gray-300 rounded hover:text-blue-500 hover:border-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <span className="flex-1 truncate">{chat.name}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartEdit(chat)
                    }}
                    className="cursor-pointer px-2 py-1 text-xs border border-gray-300 rounded hover:text-blue-500 hover:border-blue-500"
                  >
                    Rename
                  </button>
                  {chats.length > 1 && <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(chat.id)
                    }}
                    className="cursor-pointer px-2 py-1 text-xs border border-gray-300 rounded hover:text-red-500 hover:border-red-500"
                  >
                    Delete
                  </button>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
