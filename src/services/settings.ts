import { getInstance } from './db'

export interface Fetus {
    id: number
    size: string
    weight: number
}

export interface Settings {
    fetus: Fetus[]
}

export const ARROBA = 15.0

export async function getSettings(): Promise<Settings> {
    const db = await getInstance()
    const fetus = await db.select<Fetus[]>('SELECT * FROM fetus')
    return {
        fetus: fetus.map(fetus => {
            return {
                ...fetus,
                weight: fetus.weight / 100
            }
        })
    }
}

export async function updateSettings(settings: Settings) {
    settings.fetus.map(updateFetus)
}

async function updateFetus(fetus: Fetus) {
    return getInstance()
        .then(instance => instance.execute(
                `UPDATE fetus SET weight = $1, WHERE id = $3`,
                [fetus.weight * 100, fetus.id]
            ))
}