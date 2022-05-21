import CONSTANTS from './constants'
import formatNumber from './formatNumber'

export default function (input: any) {
    const mediaLote = input.PC / CONSTANTS.ARROBA
    
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