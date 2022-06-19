import { Report } from '../report'
import { getRanchById } from '../ranches'
import { getClientById } from '../clients'
import { getSlaughterhouseById, getSlaughterhouseUnitById } from '../slaughterhouse'

export default async function (report: Report) {
    const [client, ranch, slaughterhouse, slaughterhouseUnit] = await Promise.all([
        getClientById(report.clientId),
        getRanchById(report.ranchId),
        getSlaughterhouseById(report.slaughterhouseId),
        getSlaughterhouseUnitById(report.slaughterhouseUnitId)
    ])

    return {
        table: {
            body: [
                [
                    `UNIDADE ABATEDOURA: ${slaughterhouse.name.toUpperCase()}`, 
                    `Nº DE ANIMAIS: ${report.numberOfAnimals}`
                ],
                [
                    `MUNICÍPIO: ${slaughterhouseUnit.city.toUpperCase()}`,
                    `LOTE: ${report.batch}\tCURRAL: ${report.cattleShed}`
                ],
                [
                    `PROPRIETÁRIO: ${client.name.toUpperCase()}`,
                    `SEQUENCIAL: ${report.sequential}`
                ],
                [
                    `PROPRIEDADE: ${ranch.name.toUpperCase()}`,
                    `RAÇA: ${report.breed.toUpperCase()}`
                ],
                [
                    `MUNÍCIPIO: ${ranch.city.toUpperCase()}`,
                    `SEXO: ${report.sex.toUpperCase()}`
                ],
            ]
        },
        colSpan: 2,
        layout: 'noBorders'
    }
}