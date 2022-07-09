import { Report } from '../report'
import { ARROBA } from '../settings'
import formatNumber from './formatNumber'
import renderSection from './renderSection'

export default function (report: Report) {
    const PC = report.PC / 100
    const PV = report.PV / 100
    const RC = (PC/PV)*100

    const totalWeight = PC * report.numberOfAnimals
    const avg = formatNumber((report.PC / 100) / ARROBA)
    const value = report.arroba ? formatNumber(report.arroba / 100) : ''
    
    function renderProperty(name: string, value: string) {
        return {
            columns: [
                { text: `${name.toUpperCase()}: `, width: 'auto' },
                { text: ' ', width: 2 },
                { text: value.toUpperCase(), bold: true, width: 'auto'  }
            ]
        }
    }

    return renderSection('Pesos', {
        table: {
            widths: ['*', '*'],
            body: [
                [
                    renderProperty('Valor da @ negociada', `R$${value}`),
                    renderProperty('Peso total', `${formatNumber(totalWeight)}KG`)
                ],
                [
                    renderProperty('Peso total@', `${formatNumber(totalWeight/ARROBA)}`),
                    renderProperty('Média do lote@', `${avg}`)
                ],
                [
                    renderProperty('Peso vivo', `${formatNumber(PV)}KG`),
                    renderProperty('Peso de carcaça', `${formatNumber(PC)}KG`)
                ],
                [
                    renderProperty('Premiações', ''),
                    renderProperty('Rendimento de carcaça', `${formatNumber(RC, 1)}%`)
                ]
            ]
        },
        colSpan: 2,
        layout: 'noBorders'
        // stack: [
        //     `PV: ${formatNumber(PV)} KG`,
        //     '\n',
        //     `PC: ${formatNumber(PC)} KG`,
        //     '\n',
        //     `RC: ${formatNumber(RC, 1)} %`
        // ],
        // colSpan: 2
    })
}