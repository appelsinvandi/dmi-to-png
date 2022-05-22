import axios from 'axios'
import path from 'path'
import fs from 'fs'

const outDir = path.resolve(__dirname, '..', 'data')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

main()

async function main() {
  let symbolIds: number[] = []

  for (let i = 0; i <= 200; i++) {
    if (await checkSymbolExists(i)) symbolIds.push(i)
  }

  fs.writeFileSync(path.resolve(outDir, 'symbolIds.json'), JSON.stringify(symbolIds))
}

async function checkSymbolExists(id: number) {
  const res = await axios.get(`https://www.dmi.dk/fileadmin/templates/img/${id}.svg`, { validateStatus: () => true })

  return String(res.status).startsWith('2')
}
