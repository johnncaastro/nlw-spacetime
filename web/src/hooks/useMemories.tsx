'use client'

import { api } from '@/lib/api'
import Cookies from 'js-cookie'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

interface MemoriesProviderProps {
  children: ReactNode
}

interface Memory {
  id: string
  coverUrl: string
  content: string
  isPublic: boolean
  createdAt: Date
}

type MemoryInput = Omit<Memory, 'id'>

interface MemoriesContextData {
  memories: Memory[]
  deleteMemories(id: string): Promise<void>
  createMemory(memory: MemoryInput): Promise<void>
  editMemory(memory: MemoryInput, id: string): Promise<void>
}

const MemoriesContext = createContext<MemoriesContextData>(
  {} as MemoriesContextData,
)

export function MemoriesProvider({ children }: MemoriesProviderProps) {
  const [memories, setMemories] = useState<Memory[]>([])

  const token = Cookies.get('token')

  useEffect(() => {
    async function getMemories() {
      if (!token) {
        return
      }

      const response = await api.get('/memories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    }

    getMemories().then((data) => {
      setMemories(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function createMemory(memory: MemoryInput) {
    const response = await api.post('/memories', memory, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const newMemory = response.data
    setMemories([...memories, newMemory])
  }

  async function editMemory(memoryInput: MemoryInput, id: string) {
    await api.put(`/memories/${id}`, memoryInput, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const newMemories = memories.map((memory) =>
      memory.id === id
        ? {
            ...memory,
            coverUrl: memoryInput.coverUrl,
            content: memoryInput.content,
            isPublic: memoryInput.isPublic,
          }
        : memory,
    )

    setMemories(newMemories)
  }

  async function deleteMemories(id: string) {
    await api.delete(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const filteredMemories = memories.filter((memory) => id !== memory.id)
    setMemories(filteredMemories)
  }

  return (
    <MemoriesContext.Provider
      value={{ memories, deleteMemories, createMemory, editMemory }}
    >
      {children}
    </MemoriesContext.Provider>
  )
}

export function useMemories() {
  const context = useContext(MemoriesContext)
  return context
}
