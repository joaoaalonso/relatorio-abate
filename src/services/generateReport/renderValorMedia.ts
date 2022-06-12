import { ARROBA } from '../settings'
import formatNumber from './formatNumber'

export default async function (input: any) {
    const mediaLote = input.PC / ARROBA
    
    let value = input.valorArroba ? formatNumber(input.valorArroba) : ''

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