'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from 'lucide-react'

interface UploadFormProps {
  onUpload: (file: File) => void
}

export function UploadForm({ onUpload }: UploadFormProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label htmlFor="icon" className="text-center block">アイコンをアップロード</Label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="icon" className="flex flex-col items-center justify-center w-full h-40 md:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-gray-400" />
                <p className="mb-1 md:mb-2 text-xs md:text-sm text-gray-500"><span className="font-semibold">クリックしてアップロード</span></p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (最大 2MB)</p>
              </div>
              <Input
                id="icon"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
