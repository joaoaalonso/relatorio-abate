import { 
    readDir,
    createDir,
    removeFile,
    BaseDirectory,
    readBinaryFile,
    writeBinaryFile
} from '@tauri-apps/api/fs'
import formatDate from 'date-fns/format'

import { getInstance, DB } from './db'

export interface ObjectTypeValue {
    id?: number
    type: string
    value: string
}

export interface ObjectSeqTypeValue {
    id?: number
    seq: string
    type: string
    value: string
}

export interface Report {
    id?: number
    date: string
    slaughterhouseId: number
    slaughterhouseUnitId: number
    clientId: number
    ranchId: number
    numberOfAnimals: number
    sex: 'F' | 'MI' | 'MC' | 'MI/MC'
    breed: string
    batch: string
    cattleShed: string
    sequential: string
    arroba?: number
    vaccineWeight: number
    PV: number
    PC: number
    corralEvaluation: string
    comments?: string
    penalties?: string
    photos?: string[]
    maturity?: ObjectTypeValue[]
    finishing?: ObjectTypeValue[]
    rumenScore?: ObjectTypeValue[]
    fetus?: ObjectTypeValue[]
    dif?: ObjectSeqTypeValue[]
    bruises?: ObjectSeqTypeValue[]
}

export interface ReportItem {
    id?: number
    date: string
    slaughterhouse: string
    client: string
    ranch: string
    numberOfAnimals: number
    sex: 'F' | 'MI' | 'MC' | 'MI/MC'
}

export const getReports = async (): Promise<ReportItem[]> => {
    return getInstance()
        .then(instance => {
            return instance.select(`
                SELECT
                    reports.id,
                    reports.date,
                    slaughterhouses.name AS slaughterhouse,
                    clients.name AS client,
                    ranches.name AS ranch,
                    reports.numberOfAnimals,
                    reports.sex
                FROM reports
                INNER JOIN clients ON reports.clientId = clients.id
                INNER JOIN ranches ON reports.ranchId = ranches.id
                INNER JOIN slaughterhouses ON reports.slaughterhouseId = slaughterhouses.id
            `)
        })
}

export const getReportById = async (id: number): Promise<Report> => {
    return getInstance()
        .then(instance => {
            return instance.select<Report[]>('SELECT * FROM reports WHERE id = $1', [id])
            .then(res => res[0])
        })
}

export const getReportsBy = async (field: string, id: number): Promise<ReportItem[]> => {
    return getInstance()
        .then(instance => {
            return instance.select(`
                SELECT
                    reports.id,
                    reports.date,
                    slaughterhouses.name AS slaughterhouse,
                    clients.name AS client,
                    ranches.name AS ranch,
                    reports.numberOfAnimals,
                    reports.sex
                FROM reports
                INNER JOIN clients ON reports.clientId = clients.id
                INNER JOIN ranches ON reports.ranchId = ranches.id
                INNER JOIN slaughterhouses ON reports.slaughterhouseId = slaughterhouses.id
                WHERE reports.${field} = $1
            `, [id])
        })
}


export const createReport = async (data: Report): Promise<number> => {
    const instance = await getInstance()

    const result = await instance.execute(`
        INSERT INTO reports
        (clientId, ranchId, slaughterhouseId, slaughterhouseUnitId, PC, PV, arroba, batch, breed, cattleShed, comments, penalties, corralEvaluation, numberOfAnimals, sequential, sex, vaccineWeight, date)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `, [
        data.clientId,
        data.ranchId,
        data.slaughterhouseId,
        data.slaughterhouseUnitId,
        data.PC,
        data.PV,
        data.arroba,
        data.batch,
        data.breed,
        data.cattleShed,
        data.comments,
        data.penalties,
        data.corralEvaluation,
        data.numberOfAnimals,
        data.sequential,
        data.sex,
        data.vaccineWeight,
        data.date

    ])
    
    const reportId = result.lastInsertId
    
    await saveImages(instance, reportId, data.photos)

    await saveObjectTypeValue(instance, 'reportMaturity', reportId, data.maturity)
    await saveObjectTypeValue(instance, 'reportFinishing', reportId, data.finishing)
    await saveObjectTypeValue(instance, 'reportRumenScore', reportId, data.rumenScore)
    await saveObjectTypeValue(instance, 'reportFetus', reportId, data.fetus)
    
    await saveObjectSeqTypeValue(instance, 'reportDif', reportId, data.dif)
    await saveObjectSeqTypeValue(instance, 'reportBruises', reportId, data.bruises)

    return reportId
}

export const updateReport = async (reportId: number, data: Report): Promise<number> => { 
    const instance = await getInstance()

    await instance.execute(`
        UPDATE reports
        SET
        clientId = $1,
        ranchId = $2,
        slaughterhouseId = $3,
        slaughterhouseUnitId = $4,
        PC = $5,
        PV = $6,
        arroba = $7,
        batch = $8,
        breed = $9,
        cattleShed = $10,
        comments = $11,
        penalties = $12,
        corralEvaluation = $13,
        numberOfAnimals = $14,
        sequential = $15,
        sex = $16,
        vaccineWeight = $17,
        date = $18
        WHERE id = $19
    `, [
        data.clientId,
        data.ranchId,
        data.slaughterhouseId,
        data.slaughterhouseUnitId,
        data.PC,
        data.PV,
        data.arroba,
        data.batch,
        data.breed,
        data.cattleShed,
        data.comments,
        data.penalties,
        data.corralEvaluation,
        data.numberOfAnimals,
        data.sequential,
        data.sex,
        data.vaccineWeight,
        data.date,
        reportId
    ])
    
    await removeReportData(instance, reportId)

    await saveImages(instance, reportId, data.photos)

    await saveObjectTypeValue(instance, 'reportMaturity', reportId, data.maturity)
    await saveObjectTypeValue(instance, 'reportFinishing', reportId, data.finishing)
    await saveObjectTypeValue(instance, 'reportRumenScore', reportId, data.rumenScore)
    await saveObjectTypeValue(instance, 'reportFetus', reportId, data.fetus)
    
    await saveObjectSeqTypeValue(instance, 'reportDif', reportId, data.dif)
    await saveObjectSeqTypeValue(instance, 'reportBruises', reportId, data.bruises)

    return reportId
}

export const deleteReport = async (reportId: number): Promise<void> => {
    const instance = await getInstance()

    await removeReportData(instance, reportId)
    await instance.execute('DELETE FROM reports WHERE id = $1', [reportId])
}

const removeReportData = async (instance: DB, reportId: number): Promise<void> => {
    const photos = await instance.select<any[]>('SELECT * FROM reportPhotos WHERE reportId = $1', [reportId])
    for(let i = 0; i < photos.length; i++) {
        const filePath = `images/${photos[i].id}.${photos[i].extension}`
        await removeFile(filePath, { dir: BaseDirectory.App })
    }
    await instance.execute('DELETE FROM reportPhotos WHERE reportId = $1', [reportId])
    await instance.execute('DELETE FROM reportMaturity WHERE reportId = $1', [reportId])
    await instance.execute('DELETE FROM reportFinishing WHERE reportId = $1', [reportId])
    await instance.execute('DELETE FROM reportRumenScore WHERE reportId = $1', [reportId])
    await instance.execute('DELETE FROM reportFetus WHERE reportId = $1', [reportId])
    await instance.execute('DELETE FROM reportDif WHERE reportId = $1', [reportId])
    await instance.execute('DELETE FROM reportBruises WHERE reportId = $1', [reportId])
}

const saveObjectTypeValue = async (instance: DB, tableName: string, reportId: number, data?: ObjectTypeValue[], ) => {
    if (!data) return
    for(let i = 0; i < data?.length; i++) {
        await instance.execute(`INSERT INTO ${tableName} (reportId, type, value) VALUES ($1, $2, $3)`, [reportId, data[i].type, data[i].value])
    }
}

const saveObjectSeqTypeValue = async (instance: DB, tableName: string, reportId: number, data?: ObjectSeqTypeValue[], ) => {
    if (!data) return
    for(let i = 0; i < data?.length; i++) {
        await instance.execute(`INSERT INTO ${tableName} (reportId, seq, type, value) VALUES ($1, $2, $3, $4)`, [reportId, data[i].seq, data[i].type, data[i].value])
    }
}

const saveImages = async (instance: DB, reportId: number, images?: string[]): Promise<void> => {
    if (!images) return
    try {
        await readDir('images', { dir: BaseDirectory.App })
    } catch {
        await createDir('images', { dir: BaseDirectory.App })
    }

    for(let i = 0; i < images.length; i++) {
        const base64Parts = images[i].split(';base64,')
        const ext = base64Parts[0].split('/')[1]
        const image = base64Parts[1]

        const result = await instance.execute(`INSERT INTO reportPhotos (reportId, extension) VALUES ($1, $2)`, [reportId, ext])
        const photoId = result.lastInsertId

        const binaryString = atob(image)
        const bytes = new Uint8Array(binaryString.length)
        for (let j = 0; j < binaryString.length; j++) {
            bytes[j] = binaryString.charCodeAt(j)
        }
        
        const filePath = `images/${photoId}.${ext}`
        await writeBinaryFile({ contents: bytes, path: filePath}, { dir: BaseDirectory.App })
    }
}

export const getFetus = (reportId: number) => getValues<ObjectTypeValue>('reportFetus', reportId)
export const getMaturity = (reportId: number) => getValues<ObjectTypeValue>('reportMaturity', reportId)
export const getFinishing = (reportId: number) => getValues<ObjectTypeValue>('reportFinishing', reportId)
export const getRumenScore = (reportId: number) => getValues<ObjectTypeValue>('reportRumenScore', reportId)

export const getDif = (reportId: number) => getValues<ObjectSeqTypeValue>('reportDif', reportId)
export const getBruises = (reportId: number) => getValues<ObjectSeqTypeValue>('reportBruises', reportId)

function getValues<T>(tableName: string, reportId: number): Promise<T[]> {
    return getInstance()
        .then(instance => {
            return instance.select<T[]>(`SELECT * FROM ${tableName} WHERE reportId = $1`, [reportId])
        })
}

export const getPhotos = async (reportId: number) => {
    const photos = []
    const instance = await getInstance()
    const photosData = await instance.select<any>(`SELECT * FROM reportPhotos WHERE reportId = $1`, [reportId])
    
    for(let i = 0; i < photosData.length; i++) {
        const filePath = `images/${photosData[i].id}.${photosData[i].extension}`
    
        const bytes = await readBinaryFile(filePath, { dir: BaseDirectory.App })
        let binaryString = ''
        for (let j = 0; j < bytes.length; j++) {
            binaryString += String.fromCharCode(bytes[j])
        }
        const base64 = `data:image/${photosData[i].extension};base64,${btoa(binaryString)}`
        photos.push(base64)
    }

    return photos
}

export const deleteOldReports = async (months: number) => {
    const date = new Date()
    date.setMonth(date.getMonth() - months)
    date.setHours(0, 0, 0, 0)
    const formattedDate = formatDate(date, 'yyyy-MM-dd HH:mm:ss')
    const instance = await getInstance()
    const reportIds = await instance.select<any[]>(`SELECT id FROM reports WHERE createdAt < "${formattedDate}"`)
    for(let i = 0; i < reportIds.length; i++) {
        await deleteReport(reportIds[i].id)
    }
}