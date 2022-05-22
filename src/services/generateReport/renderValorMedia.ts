import { getArroba } from '../configs'
import formatNumber from './formatNumber'

export default function (input: any) {
    const mediaLote = input.PC / getArroba()
    
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