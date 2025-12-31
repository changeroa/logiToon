
/**
 * Crops a Base64 image containing a 2x2 grid comic into 4 separate images.
 * Uses a fixed percentage crop with a safety margin to remove potential grid lines.
 * 
 * Order: Top-Left, Top-Right, Bottom-Left, Bottom-Right.
 * 
 * @param base64Image The raw base64 string of the source image (without data: prefix)
 * @param mimeType The mime type (e.g., 'image/png')
 * @returns Promise resolving to an array of 4 base64 data URLs
 */
export const cropComicGrid = async (base64Image: string, mimeType: string = 'image/png'): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const halfW = width / 2;
      const halfH = height / 2;

      // Safety Margin: Trim 0.5% from the center lines and edges to avoid grid borders/gutters
      // Reduced from 2% to 0.5% to preserve more image content while still trimming potential grid lines.
      const marginX = width * 0.005;
      const marginY = height * 0.005;

      // Calculate crops: [x, y, w, h]
      // We purposefully crop INWARDS to skip the gutters.
      const cropDefs = [
        // TL
        { x: marginX, y: marginY, w: halfW - (marginX * 1.5), h: halfH - (marginY * 1.5) },
        // TR
        { x: halfW + (marginX * 0.5), y: marginY, w: halfW - (marginX * 1.5), h: halfH - (marginY * 1.5) },
        // BL
        { x: marginX, y: halfH + (marginY * 0.5), w: halfW - (marginX * 1.5), h: halfH - (marginY * 1.5) },
        // BR
        { x: halfW + (marginX * 0.5), y: halfH + (marginY * 0.5), w: halfW - (marginX * 1.5), h: halfH - (marginY * 1.5) }
      ];

      const processedImages: string[] = [];

      try {
        cropDefs.forEach(crop => {
          // Force square aspect ratio by using the smaller dimension
          const targetSize = Math.min(crop.w, crop.h);

          // Center crop to maintain square
          const offsetX = (crop.w - targetSize) / 2;
          const offsetY = (crop.h - targetSize) / 2;

          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          if (!ctx) return;

          // Draw with center-crop offset to ensure perfect 1:1 ratio
          ctx.drawImage(
            img,
            crop.x + offsetX, crop.y + offsetY, targetSize, targetSize,
            0, 0, targetSize, targetSize
          );

          processedImages.push(canvas.toDataURL(mimeType));
        });

        resolve(processedImages);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = (err) => reject(err);
    img.src = `data:${mimeType};base64,${base64Image}`;
  });
};
