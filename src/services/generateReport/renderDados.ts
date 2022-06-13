import { getRanchById } from '../ranches'
import { getClientById } from '../clients'
import { getSlaughterhouseById, getSlaughterhouseUnitById } from '../slaughterhouse'
import swal from 'sweetalert'

export default async function (input: any) {
    const [client, ranch, slaughterhouse, slaughterhouseUnit] = await Promise.all([
        getClientById(parseInt(input.proprietario)),
        getRanchById(parseInt(input.propriedade)),
        getSlaughterhouseById(parseInt(input.unidadeAbatedoura)),
        getSlaughterhouseUnitById(parseInt(input.municipioUnidadeAbatedoura))
    ])

    return {
        table: {
            body: [
                [
                    `UNIDADE ABATEDOURA: ${slaughterhouse.name.toUpperCase()}`, 
                    `Nº DE ANIMAIS: ${input.numeroAnimais}`
                ],
                [
                    `MUNICÍPIO: ${slaughterhouseUnit.city.toUpperCase()}`,
                    `LOTE: ${input.lote}\tCURRAL: ${input.curral}`
                ],
                [
                    `PROPRIETÁRIO: ${client.name.toUpperCase()}`,
                    `SEQUENCIAL: ${input.sequencial}`
                ],
                [
                    `PROPRIEDADE: ${ranch.name.toUpperCase()}`,
                    `RAÇA: ${input.raca.toUpperCase()}`
                ],
                [
                    `MUNÍCIPIO: ${ranch.city.toUpperCase()}`,
                    `SEXO: ${input.sexo.toUpperCase()}`
                ],
            ]
        },
        colSpan: 2,
        layout: 'noBorders'
    }
}