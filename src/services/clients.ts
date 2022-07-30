import { getInstance } from './db'
import { deleteReport, Report } from './report'

export interface Client {
    id: number
    name: string
    document: string
    email: string
    phone: string
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
                (name, document, email, phone, postalCode, streetName, streetNumber, neighborhood, addressComplement, city, state)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                `, [
                    client.name,
                    client.document,
                    client.email,
                    client.phone,
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
                    document = $2,
                    email = $3,
                    phone = $4,
                    postalCode = $5,
                    streetName = $6,
                    streetNumber = $7,
                    neighborhood = $8,
                    addressComplement = $9,
                    city = $10,
                    state = $11
                WHERE id = $12
                `, [
                    client.name,
                    client.document,
                    client.email,
                    client.phone,
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
    const instance = await getInstance()
    const reports = await instance.select<Report[]>('SELECT * FROM reports WHERE discountId = $1', [clientId])
    for(let i = 0; i < reports.length; i++) {
            await deleteReport(reports[i].id || 0)
    }
    return instance.execute('DELETE FROM clients WHERE id = $1', [clientId])
        .then(result => result.rowsAffected > 0)
}