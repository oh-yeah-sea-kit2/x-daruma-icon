'use client'

import { useState, useCallback, useRef } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ImageCropperProps {
  imageUrl: string
  onCropComplete: (croppedImageUrl: string) => void
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageCropper({ imageUrl, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }, [])

  const getCroppedImg = useCallback((image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('キャンバスコンテキストを取得できませんでした。')
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return canvas.toDataURL('image/jpeg')
  }, [])

  const handleCropComplete = useCallback(() => {
    if (completedCrop && imgRef.current) {
      const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop)
      onCropComplete(croppedImageUrl)
    }
  }, [completedCrop, getCroppedImg, onCropComplete])

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            className="max-w-full max-h-[50vh] md:max-h-[70vh]"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="トリミング対象"
              onLoad={onImageLoad}
              className="max-w-full max-h-[50vh] md:max-h-[70vh] object-contain"
            />
          </ReactCrop>
          <Button onClick={handleCropComplete} className="mt-4">
            トリミングを確定
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
