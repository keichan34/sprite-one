import fs from 'fs'
import os from 'os'
import path from 'path'
import child_process from 'child_process'
import util from 'util'
const execSync = util.promisify(child_process.exec)

import { SpriteImage } from '../../src/lib/interfaces'

const baseCommand = `${path.join(
  __dirname,
  '../../node_modules/.bin/ts-node'
)} ${path.join(__dirname, '../../src/bin/index.ts')}`

describe('test bin/index.ts', (): void => {
  let tmpDir = ''
  let iconsDir = path.join(__dirname, '../icons')

  beforeAll(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spriteone-'))
  })

  afterAll(function () {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  test('sprite (json and png) must exist after generating', async () => {
    const output_file_name = path.join(tmpDir, './test1')
    const pixelRatio = 1

    const cmd = `${baseCommand} ${output_file_name} ${iconsDir} -r ${pixelRatio}`
    const { stdout, stderr } = await execSync(cmd, {
      encoding: 'utf8',
    })
    expect(stdout).toEqual('')
    expect(stderr).toEqual('')
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    const spriteJSON: {
      [key: string]: SpriteImage
    } = await require(`${output_file_name}.json`)
    Object.keys(spriteJSON).forEach((key) => {
      const json = spriteJSON[key]
      expect(json.pixelRatio).toBe(pixelRatio)
    })
  })

  test('sprite must exist with pixelRatio = 2', async () => {
    const output_file_name = path.join(tmpDir, './test2')
    const pixelRatio = 2
    const cmd = `${baseCommand} ${output_file_name} ${iconsDir} -r ${pixelRatio}`
    const { stdout, stderr } = await execSync(cmd, {
      encoding: 'utf8',
    })
    expect(stdout).toEqual('')
    expect(stderr).toEqual('')
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    const spriteJSON: {
      [key: string]: SpriteImage
    } = await require(`${output_file_name}.json`)
    Object.keys(spriteJSON).forEach((key) => {
      const json = spriteJSON[key]
      expect(json.pixelRatio).toBe(pixelRatio)
    })
  })
})
