import { getInstance } from './db'

export interface Client {
    id: number
    name: string
    postalCode: string
    streetName: string
    streetNumber: string
    neighborhood: string
    addressComplement: string
    city: string
    state: string
}

export const getClients = async (): Promise<Client[]> => {
    return getInstance()
        .then(instance => {
            return instance.select('SELECT * FROM clients')
        })
}

export const getClientById = async (id: number): Promise<Client> => {
    return getInstance()
        .then(instance => {
            return instance.select<Client[]>('SELECT * FROM clients WHERE id = $1', [id])
                .then(res => res[0])
        })
}

export const createClient = async (client: Omit<Client, 'id'>): Promise<number> => {
    return getInstance()
        .then(instance => {
            return instance.execute(`
                INSERT INTO clients
                (name, postalCode, streetName, streetNumber, neighborhood, addressComplement, city, state)
                values ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [
                    client.name,
                    client.postalCode,
                    client.streetName,
                    client.streetNumber,
                    client.neighborhood,
                    client.addressComplement,
                    client.city,
                    client.state
                ]
            ).then(({ lastInsertId }) => lastInsertId)
    })
}

export const editClient = async (client: Client): Promise<number> => {
    return getInstance()
        .then(instance => {
            return instance.execute(`
                UPDATE clients
                SET
                    name = $1,
                    postalCode = $2,
                    streetName = $3,
                    streetNumber = $4,
                    neighborhood = $5,
                    addressComplement = $6,
                    city = $7,
                    state = $8
                WHERE id = $9
                `, [
                    client.name,
                    client.postalCode,
                    client.streetName,
                    client.streetNumber,
                    client.neighborhood,
                    client.addressComplement,
                    client.city,
                    client.state,
                    client.id
                ]
            ).then(() => client.id)
    })
}

export const deleteClient = async (clientId: number): Promise<boolean> => {
    return getInstance()
        .then(instance => {
            return instance.execute('DELETE FROM clients WHERE id = $1', [clientId])
        })
        .then(result => result.rowsAffected > 0)
}