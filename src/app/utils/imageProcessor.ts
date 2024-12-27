export async function addDarumaToImage(originalImage: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('キャンバスコンテキストを取得できませんでした。'));
        return;
      }

      // キャンバスサイズを設定
      canvas.width = 500;
      canvas.height = 500;

      // 元の画像を描画
      const scale = Math.min(500 / img.width, 500 / img.height);
      const x = (500 - img.width * scale) / 2;
      const y = (500 - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // だるまを描画
      const daruma = new Image();
      daruma.onload = () => {
        const darumaSize = 150;
        ctx.drawImage(daruma, 500 - darumaSize, 500 - darumaSize, darumaSize, darumaSize);
        resolve(canvas.toDataURL('image/png'));
      };
      daruma.onerror = () => {
        reject(new Error('だるま画像の読み込みに失敗しました。'));
      };
      daruma.src = '/daruma.png';
    };
    img.onerror = () => {
      reject(new Error('画像の読み込みに失敗しました。'));
    };
    img.src = URL.createObjectURL(originalImage);
  });
}
