import axios from 'axios'
import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'
import symbolIds from '../data/symbolIds.json'

// The width & height of the output image
const outputSize = 40
// The line thickness of the output image. Must be between 1 and 255 (both inclusive.)
const outputThickness = 134

const outDir = path.resolve(__dirname, '..', 'out')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

main()

async function main() {
  for (const id of symbolIds) {
    await paintPng(id)
  }

  async function paintPng(id: number) {
    const svg = await axios(`https://www.dmi.dk/fileadmin/templates/img/${id}.svg`)
    const svgString = String(svg.data)
      .replace(/<style>[\s\S]*?<\/style>/gi, '<style>#Sun, #Flash { fill: red; }</style>')
      .replace(/^  <g id="\w+-(?:fill|fill-light)">[\s\S]*?^  <\/g>/gim, '')

    const img = await loadImage(`data:image/svg+xml,${svgString}`)
    img.width = outputSize
    img.height = outputSize

    const canvas = createCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 250) {
        imageData.data[i] = 255
      } else {
        imageData.data[i] = 0
      }

      imageData.data[i + 1] = 0
      imageData.data[i + 2] = 0

      if (imageData.data[i + 3] >= outputThickness) imageData.data[i + 3] = 255
      else imageData.data[i + 3] = 0
    }
    ctx.putImageData(imageData, 0, 0)

    fs.writeFileSync(path.resolve(outDir, `${id}.png`), canvas.toBuffer())
  }
}
