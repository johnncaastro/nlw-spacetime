'use client'

import { ChangeEvent, useState } from 'react'

interface MediaPickerProps {
  currentFile?: string
}

export function MediaPicker({ currentFile }: MediaPickerProps) {
  const [preview, setPreview] = useState<string | null>(currentFile ?? null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
  }

  return (
    <>
      <input
        type="file"
        id="media"
        name="coverUrl"
        accept="image/*"
        onChange={onFileSelected}
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}
