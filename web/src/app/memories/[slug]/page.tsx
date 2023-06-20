'use client'

import { useMemories } from '@/hooks/useMemories'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

dayjs.locale(ptBR)

interface MemoryProps {
  params: {
    slug: string
  }
}

export default function Memory({ params }: MemoryProps) {
  const { memories } = useMemories()

  const memoryFiltered = memories.filter((memory) => memory.id === params.slug)

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      {memoryFiltered.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <strong>
                {memory.isPublic ? 'Memória pública' : 'Memória privada'}
              </strong>
              <time>
                {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
              </time>
            </div>

            <Image
              className="aspect-video w-full rounded-lg object-cover"
              src={memory.coverUrl}
              alt="Imagem da memória"
              width={582}
              height={280}
            />
            <p className="leading-relaxed text-gray-100 sm:text-sm md:text-base lg:text-lg">
              {memory.content}
            </p>
          </div>
        )
      })}
    </div>
  )
}
