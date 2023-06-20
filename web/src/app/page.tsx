'use client'

import { EmptyMemories } from '@/components/EmptyMemories'
import Cookie from 'js-cookie'
import { MemoriesList } from '@/components/MemoriesList'
import { useMemories } from '@/hooks/useMemories'

export default function Home() {
  const { memories } = useMemories()

  const isAuthenticated = Cookie.get('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return <MemoriesList />
}
