'use client'

import { MediaPicker } from '@/components/MediaPicker'
import { useMemories } from '@/hooks/useMemories'
import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { ChevronLeft, Camera } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import { toast, ToastContainer } from 'react-toastify'

interface EditMemoryProps {
  params: {
    slug: string
  }
}

interface Memory {
  id: string
  coverUrl: string
  content: string
  createdAt: Date
  isPublic: boolean
}

export default async function EditMemory({ params }: EditMemoryProps) {
  const { editMemory } = useMemories()

  const router = useRouter()

  const token = Cookie.get('token')

  const response = await api.get(`/memories/${params.slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memory: Memory = response.data

  async function handleEditMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    if (!formData.get('content')) {
      toast.error('Preencha todos os campos!')

      return
    }

    const fileToUpload: any = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload.size === 0) {
      coverUrl = memory.coverUrl
    } else {
      try {
        const uploadFormData = new FormData()
        uploadFormData.set('file', fileToUpload)

        const uploadResponse = await api.post('/upload', uploadFormData)

        coverUrl = uploadResponse.data.fileUrl
      } catch {
        toast.error('Erro ao carregar foto!')
      }
    }

    editMemory(
      {
        coverUrl,
        content: String(formData.get('content')),
        isPublic: Boolean(formData.get('isPublic')),
        createdAt: memory.createdAt,
      },
      params.slug,
    ).catch(() => {
      toast.error('Erro ao editar memória!')
    })

    router.push('/')
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-16">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
          voltar à timeline
        </Link>

        <form
          onSubmit={handleEditMemory}
          className="flex flex-1 flex-col gap-2"
        >
          <div className="flex items-center gap-4">
            <label
              htmlFor="media"
              className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
            >
              <Camera className="h-4 w-4" />
              Anexar mídia
            </label>

            <label
              htmlFor="isPublic"
              className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
            >
              <input
                type="checkbox"
                name="isPublic"
                id="isPublic"
                defaultChecked={memory.isPublic}
                className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500 focus:ring-0"
              />
              Tornar memória pública
            </label>
          </div>
          <MediaPicker currentFile={memory.coverUrl} />

          <textarea
            name="content"
            spellCheck={false}
            defaultValue={memory.content}
            className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0 sm:text-base md:text-lg"
            placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          />

          <button
            type="submit"
            className="mt-6 inline-block self-end rounded-full bg-green-500 font-alt uppercase leading-none text-black hover:bg-green-600 sm:px-4 sm:py-2 sm:text-xs md:px-5 md:py-3 md:text-sm"
          >
            Editar
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}
