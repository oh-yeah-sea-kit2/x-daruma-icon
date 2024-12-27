'use server'

import sharp from 'sharp'
import { join } from 'path'

export async function processImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('ファイルがアップロードされていません。')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const darumaPath = join(process.cwd(), 'public', 'daruma.png')

  try {
    const processedImage = await sharp(buffer)
      .resize(500, 500, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .composite([{ input: darumaPath, gravity: 'southeast' }])
      .png()
      .toBuffer()

    const base64Image = processedImage.toString('base64')
    return { success: true, image: `data:image/png;base64,${base64Image}` }
  } catch (error) {
    console.error('画像処理エラー:', error)
    return { success: false, error: '画像の処理中にエラーが発生しました。' }
  }
}
