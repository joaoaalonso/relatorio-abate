import { getInstance } from './db'

export interface Ranch {
    id: number
    clientId: number
    name: string
    postalCode: string
    city: string
    state: string
    address: string
    description: string
}

export const getRanches = async (clientId: number): Promise<Ranch[]> => {
    return getInstance()
        .then(instance => {
            return instance.select(
                'SELECT * FROM ranches WHERE clientId = $1', [clientId]
            )
        })
}

export const createRanch = async (ranch: Omit<Ranch, 'id'>): Promise<number> => {
    return getInstance()
        .then(instance => {
            return instance.execute(`
                INSERT INTO ranches
                (clientId, name, postalCode, city, state, address, description)
                values
                ($1, $2, $3, $4, $5, $6, $7)`, 
                [
                    ranch.clientId,
                    ranch.name,
                    ranch.postalCode,
                    ranch.city,
                    ranch.state,
                    ranch.address,
                    ranch.description
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
                description = $7
                WHERE id = $8`,
                [
                    ranch.clientId,
                    ranch.name,
                    ranch.postalCode,
                    ranch.city,
                    ranch.state,
                    ranch.address,
                    ranch.description,
                    ranch.id
                ]
                )
                .then(() => ranch.id)
    })
}

export const deleteRanch = async (ranchId: number): Promise<boolean> => {
    return getInstance()
        .then(instance => {
            return instance.execute('DELETE FROM ranches WHERE id = $1', [ranchId])
        })
        .then(result => result.rowsAffected > 0)
}