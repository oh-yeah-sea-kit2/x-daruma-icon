'use client'

import { useState } from 'react'
import { UploadForm } from './components/upload-form'
import { ImageCropper } from './components/ImageCropper'
import { ImageEditor } from './components/ImageEditor'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setUploadedImage(e.target.result)
        setCroppedImage(null)
        setProcessedImage(null)
        setError(null)
      }
    }
    reader.onerror = () => {
      setError('画像の読み込み中にエラーが発生しました。')
    }
    reader.readAsDataURL(file)
    setProgress(33)
  }

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl)
    setProgress(66)
  }

  const handleGenerate = (dataUrl: string) => {
    setProcessedImage(dataUrl)
    setProgress(100)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setCroppedImage(null)
    setProcessedImage(null)
    setError(null)
    setProgress(0)
  }

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = 'daruma-icon.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <main className="container mx-auto p-4 max-w-md md:max-w-2xl">
      <Card className="mb-8 w-full">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-4 text-center">だるまアイコンジェネレーター</h1>
          <Progress value={progress} className="mb-4 max-w-xs mx-auto" />
          {!uploadedImage && <UploadForm onUpload={handleUpload} />}
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {uploadedImage && !croppedImage && (
            <div>
              <h2 className="text-xl font-semibold mb-2">画像をトリミング</h2>
              <ImageCropper imageUrl={uploadedImage} onCropComplete={handleCropComplete} />
            </div>
          )}
          {croppedImage && !processedImage && (
            <div>
              <h2 className="text-xl font-semibold mb-2">だるまを配置</h2>
              <ImageEditor imageUrl={croppedImage} onGenerate={handleGenerate} />
            </div>
          )}
          {processedImage && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">生成されたアイコン：</h2>
              <div className="relative w-full max-w-[500px] aspect-square mx-auto">
                <Image src={processedImage} alt="生成されただるまアイコン" layout="fill" objectFit="contain" />
              </div>
              <div className="flex justify-center mt-4">
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  ダウンロード
                </Button>
              </div>
            </div>
          )}
          {(uploadedImage || croppedImage || processedImage) && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleReset} variant="outline">
                最初からやり直す
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
