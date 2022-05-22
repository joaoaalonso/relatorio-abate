import { getSettings } from '../settings'
import formatNumber from './formatNumber'

export default async function (input: any) {
    const settings = await getSettings()
    const mediaLote = input.PC / settings.arroba
    
    let value = input.valorArroba ? formatNumber(input.valorArroba) : ''
    if (input.adicionalPrecoce && value) {
        value += ' + PRECOCE'
    }

    return {
        stack: [
            'VALOR DA @ NEGOCIDADA:',
            '\n',
            `R$ ${value}`,
            '\n',
            `MÉDIA LOTE: ${formatNumber(mediaLote)}@`
        ],
        colSpan: 2
    }
}