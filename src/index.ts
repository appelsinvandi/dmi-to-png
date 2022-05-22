import path from 'path'
import puppeteer from 'puppeteer'
import fs from 'fs'

const outDir = path.resolve(__dirname, '..', 'out')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

const symbolIds = [
  1, 2, 3, 45, 60, 63, 68, 69, 70, 73, 80, 81, 83, 84, 85, 86, 101, 102, 103, 160, 180, 181, 183, 184, 185, 186,
]

main()

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 24,
      height: 24,
    },
  })

  for (const id of symbolIds) {
    await paintPng(id)
  }

  await browser.close()

  async function paintPng(id: number) {
    const page = await browser.newPage()
    await page.goto(`https://www.dmi.dk/fileadmin/templates/img/${id}.svg`)

    await page.evaluate(() => {
      document.querySelectorAll('g[id$="-fill"]').forEach((g) => g.remove())
      document.querySelectorAll('g[id$="-fill-light"]').forEach((g) => g.remove())

      const style = document.querySelector('style')!
      style.innerHTML = `
        #Sun {
          fill: red;
        }
      `

      const svg = document.querySelector<SVGElement>('svg')!
      svg.setAttribute('width', '24')
      svg.setAttribute('height', '24')
    })

    await page.screenshot({
      omitBackground: true,
      path: path.resolve(outDir, `${id}.png`),
    })

    await page.close()
  }
}
