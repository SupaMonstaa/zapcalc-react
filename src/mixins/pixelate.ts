// eslint-disable-next-line
export default function pixelate(src: any, dst: any, opt: any) {

  const xBinSize = opt.pixelWidth || 8
  const yBinSize = opt.pixelHeight || 8
  const thresholdMin = 'thresholdMin' in opt ? opt.thresholdMin : false
  const thresholdMax = 'thresholdMax' in opt ? opt.thresholdMax : false
  const grid = 'grid' in opt ? opt.grid : false
  const xSize = src.width
  const ySize = src.height
  const srcPixels = src.data
  const dstPixels = dst.data
  const nBinsX = Math.ceil(xSize / xBinSize)
  const nBinsY = Math.ceil(ySize / yBinSize)

  for (let xBin = 0; xBin < nBinsX; xBin += 1) {
    for (let yBin = 0; yBin < nBinsY; yBin += 1) {
      // Initialize the color accumlators to 0
      let red = 0
      let green = 0
      let blue = 0
      let alpha = 0
      // Determine which pixels are included in this bin
      const xBinStart = xBin * xBinSize
      const xBinEnd = xBinStart + xBinSize
      const yBinStart = yBin * yBinSize
      const yBinEnd = yBinStart + yBinSize
      // Add all of the pixels to this bin!
      let pixelsInBin = 0
      for (let x = xBinStart; x < xBinEnd; x += 1) {
        if (x < xSize) {
          for (let y = yBinStart; y < yBinEnd; y += 1) {
            if (y < ySize) {
              if (!grid || (x !== xBinStart && y !== yBinStart)) {
                const i = (xSize * y + x) * 4
                red += srcPixels[i + 0]
                green += srcPixels[i + 1]
                blue += srcPixels[i + 2]
                alpha += srcPixels[i + 3]
                pixelsInBin += 1
              }
            }
          }
        }
      }
      // Make sure the channels are between 0-255
      red /= pixelsInBin
      green /= pixelsInBin
      blue /= pixelsInBin
      alpha /= pixelsInBin
      if (thresholdMin) {
        alpha = alpha <= thresholdMin ? 0 : alpha
        red = red <= thresholdMin ? 0 : red
        green = green <= thresholdMin ? 0 : green
        blue = blue <= thresholdMin ? 0 : blue
      }
      if (thresholdMax) {
        alpha = alpha >= thresholdMax ? 255 : alpha
        red = red >= thresholdMax ? 255 : red
        green = green >= thresholdMax ? 255 : green
        blue = blue >= thresholdMax ? 255 : blue
      }
      // Draw this bin
      for (let x = xBinStart; x < xBinEnd; x += 1) {
        if (x < xSize) {
          for (let y = yBinStart; y < yBinEnd; y += 1) {
            if (y < ySize) {
              const i = (xSize * y + x) * 4
              if (!grid || (x !== xBinStart && y !== yBinStart)) {
                dstPixels[i + 0] = red
                dstPixels[i + 1] = green
                dstPixels[i + 2] = blue
                dstPixels[i + 3] = alpha
              } else {
                dstPixels[i + 0] = red
                dstPixels[i + 1] = green
                dstPixels[i + 2] = blue
                dstPixels[i + 3] = Math.round(0.6 * alpha)
              }
            }
          }
        }
      }
    }
  }
}
