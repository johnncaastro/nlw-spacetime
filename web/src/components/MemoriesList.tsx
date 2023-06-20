'use client'

import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { ArrowRight, Edit, Trash2, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemories } from '@/hooks/useMemories'

import logoImg from '../assets/nlw-spacetime-logo.svg'

dayjs.locale(ptBR)

export function MemoriesList() {
  const { memories, deleteMemories } = useMemories()

  return (
    <div className="flex flex-col gap-10 p-8">
      <header className="items-center justify-between sm:flex lg:hidden">
        <Image
          src={logoImg}
          alt="NLW Spacetime"
          className="sm:w-32 md:w-36 lg:hidden"
        />

        <Link
          href="/memories/new"
          className="h-10 w-10 items-center justify-center rounded-full border-none bg-green-500 p-2 sm:flex lg:hidden"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </header>

      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
            </time>
            <Image
              className="aspect-video w-full rounded-lg object-cover"
              src={memory.coverUrl}
              alt="Imagem da memória"
              width={582}
              height={280}
            />
            <p className="leading-relaxed text-gray-100 sm:text-sm md:text-base lg:text-lg">
              {memory.content.substring(0, 115).concat('...')}
            </p>

            <div className="flex items-center justify-between">
              <Link
                href={`/memories/${memory.id}`}
                className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
              >
                Ler mais
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex items-center gap-4">
                <Link
                  href={`/memories/edit/${memory.id}`}
                  className="flex items-center gap-2 rounded-full bg-blue-500 font-alt uppercase leading-none hover:bg-blue-600 sm:px-4 sm:py-2 sm:text-xs md:px-5 md:py-3 md:text-sm"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Link>

                <button
                  onClick={() => deleteMemories(memory.id)}
                  className="flex items-center gap-2 rounded-full bg-red-500 font-alt uppercase leading-none hover:bg-red-600 sm:px-4 sm:py-2 sm:text-xs md:px-5 md:py-3 md:text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
