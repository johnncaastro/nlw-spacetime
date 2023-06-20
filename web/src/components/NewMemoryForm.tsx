'use client'

import { Camera } from 'lucide-react'
import { MediaPicker } from './MediaPicker'
import { FormEvent } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import { useMemories } from '@/hooks/useMemories'

export function NewMemoryForm() {
  const { createMemory } = useMemories()
  const router = useRouter()

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    if (!formData.get('content') || !formData.get('creationDate')) {
      toast.error('Preencha todos os campos!')

      return
    }

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload) {
      try {
        const uploadFormData = new FormData()
        uploadFormData.set('file', fileToUpload)

        const uploadResponse = await api.post('/upload', uploadFormData)

        coverUrl = uploadResponse.data.fileUrl
      } catch {
        toast.error('Erro ao carregar foto!')

        return
      }
    }

    const arrayDate = String(formData.get('creationDate')).split('-')
    const formattedDate = new Date(
      arrayDate[1] + '-' + arrayDate[2] + '-' + arrayDate[0],
    )

    await createMemory({
      coverUrl,
      content: String(formData.get('content')),
      isPublic: Boolean(formData.get('content')),
      createdAt: formattedDate,
    })

    router.push('/')
  }

  return (
    <>
      <form
        onSubmit={handleCreateMemory}
        className="flex flex-1 flex-col gap-2"
      >
        <div className="flex gap-4 sm:flex-col sm:items-start md:flex-row md:items-center">
          <label
            htmlFor="media"
            className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <Camera className="h-4 w-4" />
            Anexar foto
          </label>

          <label
            htmlFor="isPublic"
            className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500 focus:ring-0"
            />
            Tornar memória pública
          </label>

          <label
            htmlFor="creationDate"
            className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          >
            <input
              type="date"
              name="creationDate"
              id="creationDate"
              className="h-8 w-36 rounded border-gray-400 bg-gray-700 px-1 text-purple-500 focus:ring-0"
            />
            Data
          </label>
        </div>
        <MediaPicker />

        <textarea
          name="content"
          spellCheck={false}
          className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0 sm:text-base md:text-lg"
          placeholder="Fique livre para adicionar fotos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <button
          type="submit"
          className="inline-block self-end rounded-full bg-green-500 font-alt uppercase leading-none text-black hover:bg-green-600 sm:px-4 sm:py-2 sm:text-xs md:px-5 md:py-3 md:text-sm"
        >
          Salvar
        </button>
      </form>

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
