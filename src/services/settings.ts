import { appDir, join } from '@tauri-apps/api/path'
import { createDir, readDir, readTextFile, writeFile } from '@tauri-apps/api/fs'

interface Discount {
    name: string
    value: number
}

interface FetalWeights {
    [key: string]: number
    P: number
    M: number
    G: number
}

interface FetalAges {
    [key: string]: string
    P: string
    M: string
    G: string
}

export interface SettingsInterface {
    arroba: number
    discounts: Discount[],
    fetalWeights: FetalWeights,
    fetalAges: FetalAges
}

const DEFAULT_SETTINGS: SettingsInterface = {
    arroba: 15.00,
    fetalWeights: {
        P: 8,
        M: 16,
        G: 32
    },
    fetalAges: {
        P: 'DE ATÉ 2 MESES',
        M: 'ENTRE 2 À 5 MESES',
        G: 'DE ATÉ 9 MESES'
    },
    discounts: [
        { name: 'Funrural', value: 0.015},
        { name: 'Senar', value: 0.002 }
    ]
}

let loaded = false
let settings: any = {}
const FILE_NAME = 'settings.json'

export async function getSettings(): Promise<SettingsInterface> {
    if (loaded) return settings
    const dir = await appDir()
    const filePath = await join(dir, FILE_NAME)
    try {
        await readDir(await appDir())
    } catch(e) {
        await createDir(await appDir())
    }

    try {
        const content = await readTextFile(filePath)
        settings = JSON.parse(content)
    } catch (e) {
        settings = DEFAULT_SETTINGS
        await writeFile({
            contents: JSON.stringify(DEFAULT_SETTINGS),
            path: filePath
        })
    }
    loaded = true
    return settings
}

export async function updateSettings(data: SettingsInterface) {
    const dir = await appDir()
    const filePath = await join(dir, FILE_NAME)
    await writeFile({
        contents: JSON.stringify(data),
        path: filePath
    })
    settings = data
}
