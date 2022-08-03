import formatNumber from './formatNumber'
import renderSection from './renderSection'
import { ObjectTypeValue, Report } from '../report'

const formatRow = (data: ObjectTypeValue[], report: Report, sufix: string = '') => {
    return data.map(d => {
        if (d.value == '0') return null
        const percentil = formatNumber((+d.value / report.numberOfAnimals) * 100, 0)
        return `${d.type}${sufix} - ${percentil}%`
    }).filter(Boolean)
}

const renderDif = (report: Report, margin: number[]) => {
    if (!report.dif?.filter(dif => !!dif.seq).length) return null
    return {
        table: {
            widths: ['*', '*', '*'],
            body: [
                [ 'DIF - SEQUENCIAL', 'MOTIVO', 'DESTINO' ],
                ...report.dif.map(d => [ d.seq, d.type, d.value ])
            ]
        },
        layout: 'noBorders',
        margin
    }
}

const renderBruises = (report: Report) => {
    if (!report.bruises?.filter(bruise => !!bruise.seq).length) return null
    return {
        table: {
            widths: ['*', '*', '*'],
            body: [
                [ 'HEMATOMAS - SEQUENCIAL', 'LOCAL', 'ORIGEM' ],
                ...report.bruises.map(d => [ d.seq, d.type, d.value ])
            ]
        },
        layout: 'noBorders'
    }
}

export default function (report: Report) {
    const margin = [0, 0, 0, 4]

    const maturity = formatRow(report.maturity || [], report, 'D')
    const finishing = formatRow(report.finishing || [], report)
    const rumenScore = formatRow(report.rumenScore || [], report)

    const rows = []
    for(let i = 0; i < 5; i++) {
        const row = []
        if (!maturity[i] && !finishing[i] && !rumenScore[i]) continue
        row.push(maturity[i] || '')
        row.push(finishing[i] || '')
        row.push(rumenScore[i] || '')
        rows.push(row)
    }

    return renderSection('Avaliação de abate', {
        stack: [
            {
                table: {
                    widths: ['*', '*', '*'],
                    body: [
                        [ 'MATURIDADE', 'ACABAMENTO', 'ESCORE RUMINAL' ],
                        ...rows
                    ]
                },
                layout: 'noBorders',
                margin
            },
            { text: `PESO DE VACINA: ${formatNumber(report.vaccineWeight / 100)} KG/CBÇ`, margin },
            renderDif(report, margin),
            renderBruises(report)
        ]
    })
}