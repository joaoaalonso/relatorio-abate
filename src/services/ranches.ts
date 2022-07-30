import { getInstance } from './db'
import { deleteReport, Report } from './report'

export interface Ranch {
    id: number
    clientId: number
    name: string
    postalCode: string
    city: string
    state: string
    address: string
    ie: string
    comments: string
}

export const getRanches = async (clientId: number): Promise<Ranch[]> => {
    return getInstance()
        .then(instance => {
            return instance.select(
                'SELECT * FROM ranches WHERE clientId = $1', [clientId]
            )
        })
}

export const getRanchById = async (id: number): Promise<Ranch> => {
    return getInstance()
        .then(instance => {
            return instance.select<Ranch[]>('SELECT * FROM ranches WHERE id = $1', [id])
                .then(res => res[0])
        })
}

export const createRanch = async (ranch: Omit<Ranch, 'id'>): Promise<number> => {
    return getInstance()
        .then(instance => {
            return instance.execute(`
                INSERT INTO ranches
                (clientId, name, postalCode, city, state, address, ie, comments)
                values
                ($1, $2, $3, $4, $5, $6, $7, $8)`, 
                [
                    ranch.clientId,
                    ranch.name,
                    ranch.postalCode,
                    ranch.city,
                    ranch.state,
                    ranch.address,
                    ranch.ie,
                    ranch.comments
                ])
                .then(({ lastInsertId }) => lastInsertId)
    })
}

export const editRanch = async (ranch: Ranch): Promise<number> => {
    return getInstance()
        .then(instance => {
            return instance.execute(`
                UPDATE ranches
                SET
                clientId = $1,
                name = $2,
                postalCode = $3,
                city = $4,
                state = $5,
                address = $6,
                ie = $7,
                comments = $8
                WHERE id = $9`,
                [
                    ranch.clientId,
                    ranch.name,
                    ranch.postalCode,
                    ranch.city,
                    ranch.state,
                    ranch.address,
                    ranch.ie,
                    ranch.comments,
                    ranch.id
                ]
                )
                .then(() => ranch.id)
    })
}

export const deleteRanch = async (ranchId: number): Promise<boolean> => {
    const instance = await getInstance()
    const reports = await instance.select<Report[]>('SELECT * FROM reports WHERE ranchId = $1', [ranchId])
    for(let i = 0; i < reports.length; i++) {
            await deleteReport(reports[i].id || 0)
    }
    return instance.execute('DELETE FROM ranches WHERE id = $1', [ranchId])
        .then(result => result.rowsAffected > 0)
}