'use client'

import { useState, useRef, useEffect } from 'react'
import { DraggableDaruma } from './DraggableDaruma'
import { Button } from "@/components/ui/button"
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface ImageEditorProps {
  imageUrl: string
  onGenerate: (dataUrl: string) => void
}

export function ImageEditor({ imageUrl, onGenerate }: ImageEditorProps) {
  const [containerSize, setContainerSize] = useState(500)
  const containerRef = useRef<HTMLDivElement>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const size = Math.min(500, window.innerWidth - 40, window.innerHeight - 200)
      setContainerSize(size)
    }
    img.src = imageUrl
  }, [imageUrl])

  const handleGenerate = async () => {
    if (!containerRef.current) return

    try {
      const canvas = await html2canvas(containerRef.current)
      const dataUrl = canvas.toDataURL('image/png')
      setGeneratedImage(dataUrl)
      onGenerate(dataUrl)
      toast({
        title: "画像生成完了",
        description: "だるまアイコンが正常に生成されました。",
      })
    } catch (error) {
      console.error('画像生成中にエラーが発生しました:', error)
      toast({
        title: "エラー",
        description: "画像生成中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = 'daruma-icon.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mt-4 flex flex-col items-center">
          <div 
            ref={containerRef}
            style={{ 
              width: `${containerSize}px`, 
              height: `${containerSize}px`, 
              position: 'relative',
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className="border-2 border-dashed border-gray-300 rounded-lg"
          >
            <DraggableDaruma containerSize={containerSize} containerRef={containerRef} />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button onClick={handleGenerate} className="w-full sm:w-auto">
              画像を生成
            </Button>
            {generatedImage && (
              <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                ダウンロード
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
