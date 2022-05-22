import path from 'path'
import puppeteer from 'puppeteer'
import fs from 'fs'
import symbolIds from '../data/symbolIds.json'

const outputSize = 104

const outDir = path.resolve(__dirname, '..', 'out')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

main()

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: outputSize,
      height: outputSize,
    },
  })

  for (const id of symbolIds) {
    await paintPng(id)
  }

  await browser.close()

  async function paintPng(id: number) {
    const page = await browser.newPage()
    await page.goto(`https://www.dmi.dk/fileadmin/templates/img/${id}.svg`)

    await page.evaluate(
      (outputSize) => {
        document.querySelectorAll('g[id$="-fill"]').forEach((g) => g.remove())
        document.querySelectorAll('g[id$="-fill-light"]').forEach((g) => g.remove())

        const style = document.querySelector('style')!
        style.innerHTML = `
        #Sun, #Flash {
          fill: red;
        }
      `

        const svg = document.querySelector<SVGElement>('svg')!
        svg.setAttribute('width', String(outputSize))
        svg.setAttribute('height', String(outputSize))
      },
      [outputSize]
    )

    await page.screenshot({
      omitBackground: true,
      type: 'png',
      path: path.resolve(outDir, `${id}.png`),
    })

    await page.close()
  }
}
