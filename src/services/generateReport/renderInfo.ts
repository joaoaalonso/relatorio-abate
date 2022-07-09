import formatDate from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'

import { Report } from '../report'
import { getRanchById } from '../ranches'
import { getClientById } from '../clients'
import renderSection from './renderSection' 
import { getSlaughterhouseById, getSlaughterhouseUnitById } from '../slaughterhouse'

export default async function (report: Report) {
    const [client, ranch, slaughterhouse, slaughterhouseUnit] = await Promise.all([
        getClientById(report.clientId),
        getRanchById(report.ranchId),
        getSlaughterhouseById(report.slaughterhouseId),
        getSlaughterhouseUnitById(report.slaughterhouseUnitId)
    ])

    return renderSection('Informações', {
        table: {
            widths: ['*', '*'],
            body: [
                [
                    `DATA DE ABATE: ${formatDate(new Date(report.date), 'dd/MM/yyyy', { locale: ptBr })}`,
                    `Nº DE ANIMAIS: ${report.numberOfAnimals}`
                ],
                [
                    `UNIDADE ABATEDOURA: ${slaughterhouse.name.toUpperCase()}`, 
                    `LOTE: ${report.batch}`
                ],
                [
                    `MUNICÍPIO: ${slaughterhouseUnit.city.toUpperCase()}`,
                    `CURRAL: ${report.cattleShed}`
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
    })
}