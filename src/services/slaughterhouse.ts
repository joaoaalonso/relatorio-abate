import { getInstance } from './db'

export interface Slaughterhouse {
    id: number
    name: string
}

export interface SlaughterhouseUnit {
    id: number
    slaughterhouseId: number
    city: string
    state: string
}

export const getSlaughterhouses = async (): Promise<Slaughterhouse[]> => {
    return getInstance()
        .then(instance => {
            return instance.select('SELECT * FROM slaughterhouses')
        })
}

export const getSlaughterhouseById = async (id: number): Promise<Slaughterhouse> => {
    return getInstance()
        .then(instance => {
            return instance.select<Slaughterhouse[]>('SELECT * FROM slaughterhouses WHERE id = $1', [id])
                .then(res => res[0])
        })
}

export const createSlaughterhouse = async (slaughterhouse: Omit<Slaughterhouse, 'id'>): Promise<number> => {
    return getInstance()
        .then(instance => {
            return instance.execute(`INSERT INTO slaughterhouses (name) values ($1)`, [slaughterhouse.name])
                .then(({ lastInsertId }) => lastInsertId)
    })
}

export const editSlaughterhouse = async (slaughterhouse: Slaughterhouse): Promise<number> => {
    return getInstance()
        .then(instance => {
            return instance.execute(`UPDATE slaughterhouses SET name = $1 WHERE id = $2`, [slaughterhouse.name, slaughterhouse.id])
                .then(() => slaughterhouse.id)
    })
}

export const deleteSlaughterhouse = async (slaughterhouseId: number): Promise<boolean> => {
    return getInstance()
        .then(instance => {
            return instance.execute('DELETE FROM slaughterhouses WHERE id = $1', [slaughterhouseId])
        })
        .then(result => result.rowsAffected > 0)
}

export const getSlaughterhouseUnits = async (slaughterhouseId: number): Promise<SlaughterhouseUnit[]> => {
    return getInstance()
        .then(instance => {
            return instance.select(
                'SELECT * FROM slaughterhouseUnits WHERE slaughterhouseId = $1', [slaughterhouseId]
            )
        })
}

export const getSlaughterhouseUnitById = async (id: number): Promise<SlaughterhouseUnit> => {
    return getInstance()
        .then(instance => {
            return instance.select<SlaughterhouseUnit[]>('SELECT * FROM slaughterhouseUnits WHERE id = $1', [id])
                .then(res => res[0])
        })
}

export const createSlaughterhouseUnit = async (slaughterhouseUnit: Omit<SlaughterhouseUnit, 'id'>): Promise<number> => {
    return getInstance()
        .then(instance => {
            return instance.execute(`
                INSERT INTO slaughterhouseUnits 
                (slaughterhouseId, city, state)
                values
                ($1, $2, $3)`, 
                [
                    slaughterhouseUnit.slaughterhouseId,
                    slaughterhouseUnit.city,
                    slaughterhouseUnit.state
                ])
                .then(({ lastInsertId }) => lastInsertId)
    })
}

export const editSlaughterhouseUnit = async (slaughterhouseUnit: SlaughterhouseUnit): Promise<number> => {
    return getInstance()
        .then(instance => {
            return instance.execute(`
                UPDATE slaughterhouseUnits
                SET
                slaughterhouseId = $1,
                city = $2,
                state = $3
                WHERE id = $4`,
                [
                    slaughterhouseUnit.slaughterhouseId,
                    slaughterhouseUnit.city,
                    slaughterhouseUnit.state,
                    slaughterhouseUnit.id
                ]
                )
                .then(() => slaughterhouseUnit.id)
    })
}

export const deleteSlaughterhouseUnit = async (slaughterhouseUnitId: number): Promise<boolean> => {
    return getInstance()
        .then(instance => {
            return instance.execute('DELETE FROM slaughterhouseUnits WHERE id = $1', [slaughterhouseUnitId])
        })
        .then(result => result.rowsAffected > 0)
}