import { Report } from '../report'
import { ARROBA } from '../settings'
import formatNumber from './formatNumber'

export default async function (report: Report) {
    const avg = (report.PC / 100) / ARROBA
    
    let value = report.arroba ? formatNumber(report.arroba) : ''

    return {
        stack: [
            'VALOR DA @ NEGOCIDADA:',
            '\n',
            `R$ ${value}`,
            '\n',
            `MÉDIA LOTE: ${formatNumber(avg)}@`
        ],
        colSpan: 2
    }
}