import { getInstance } from './db'

export interface Discount {
    id: number
    name: string
    value: number
}

export interface Fetus {
    id: number
    size: string
    age: string
    weight: number
}

export interface Settings {
    fetus: Fetus[]
    discounts: Discount[]
}

export const ARROBA = 15.0

export async function getSettings(): Promise<Settings> {
    const db = await getInstance()
    const discounts = await db.select<Discount[]>('SELECT * FROM discounts')
    const fetus = await db.select<Fetus[]>('SELECT * FROM fetus')
    return {
        discounts: discounts.map(discount => {
            return {
                ...discount,
                value: discount.value / (100 * 100)
            }
        }),
        fetus: fetus.map(fetus => {
            return {
                ...fetus,
                weight: fetus.weight / 100
            }
        })
    }
}

export async function updateSettings(settings: Settings, idsToDelete: number[]) {
    settings.discounts.map(discount => {
        if (discount.id) {
            updateDiscount(discount)
        } else {
            createDiscount(discount)
        }
    })
    settings.fetus.map(updateFetus)
    deleteDiscounts(idsToDelete)
}

async function updateDiscount(discount: Discount) {
    return getInstance()
        .then(instance => instance.execute(
                `UPDATE discounts SET name = $1, value = $2 WHERE id = $3`,
                [discount.name, discount.value * 100, discount.id]
            ))
}

async function createDiscount(discount: Omit<Discount, 'id'>) {
    return getInstance()
        .then(instance => instance.execute('INSERT INTO discounts (name, value) VALUES ($1, $2)', [discount.name, discount.value * 100]))
}

async function deleteDiscounts(ids: number[]) {
    return getInstance()
        .then(instance => instance.execute(
                `DELETE FROM discounts WHERE id IN (${ids.join(',')})`
            ))
}

async function updateFetus(fetus: Fetus) {
    return getInstance()
        .then(instance => instance.execute(
                `UPDATE fetus SET weight = $1, age = $2 WHERE id = $3`,
                [fetus.weight * 100, fetus.age, fetus.id]
            ))
}