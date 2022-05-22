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

// let ARROBA = 15.00
// let FETAL_WEIGHTS = {
//     P: 8,
//     M: 16,
//     G: 32
// }
// let FETAL_AGES = {
//     P: 'DE ATÉ 2 MESES',
//     M: 'ENTRE 2 À 5 MESES',
//     G: 'DE ATÉ 9 MESES'
// }
// let DISCOUNTS = [
//     { name: 'Funrural', value: 0.015},
//     { name: 'Senar', value: 0.002 }
// ]

// export async function getArroba() {
//     return getSettings()
//         .then(settings => settings.arroba)
// }

// export async function getDiscounts() {
//     return getSettings()
//         .then(settings => settings.discounts)
// }

// export function getDiscountNames() {
//     return getSettings()
//         .then(settings => settings.discounts.map((d: Discount) => d.name))
// }

// export function getDiscountValue(discount: 'string') {
//     return DISCOUNTS.find(d => d.name === discount)?.value || 1
// }

// export function getFetalWeights() {
//     return FETAL_WEIGHTS
// }

// export function getFetalWeight(size: 'P' | 'M' | 'G') {
//     return FETAL_WEIGHTS[size] || 0
// }

// export function getAvaliableFetalSizes() {
//     return Object.keys(FETAL_WEIGHTS)
// }

// export function getFetalAges() {
//     return FETAL_AGES
// }

// export function getFetalAge(size: 'P' | 'M' | 'G') {
//     return FETAL_AGES[size] || ''
// }

// export function getConfigs() {
//     return {
//         arroba: ARROBA,
//         discounts: DISCOUNTS,
//         fetalWeights: FETAL_WEIGHTS,
//         fetalAges: FETAL_AGES,
//     }
// }

// export function update(data: Settings) {
//     ARROBA = data.arroba
//     DISCOUNTS = data.discounts
//     FETAL_WEIGHTS = data.fetalWeights
//     FETAL_AGES = data.fetalAges
// }