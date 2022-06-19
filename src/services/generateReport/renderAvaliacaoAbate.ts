import { Report } from '../report'
import { ARROBA } from '../settings'
import formatNumber from './formatNumber'

function renderTableWithPercentage (label: string, input: any, inputKey: string) {
    const rows: any[] = []
    input[inputKey].forEach((obj: any) => {
        const percentil = (obj.value / input.numberOfAnimals)*100
        if (percentil > 0) {
            rows.push([
                { text: `${obj.type}`, alignment: 'center' }, 
                { text: `${obj.value} (${formatNumber(percentil, 1)}%)`, alignment: 'center' }, 
            ])
        }
    })
    return {
        width: '*',
        table: {
            widths: [25, '*'],
            body: [
                [ { text: label, alignment: 'center', colSpan: 2 }, {} ],
                ...rows
            ]
        }
    }
}

function renderSeqTable (label: string, input: any, inputKey: string, titles: string[]) {
    if(!input[inputKey].filter((a: any) => !!a.seq).length) return null

    const rows: any[] = []
    input[inputKey].forEach((obj: any) => {
        if (!!obj.seq) {
            rows.push([
                { text: obj.seq, alignment: 'center' }, 
                { text: obj.type.toUpperCase(), alignment: 'center' }, 
                { text: obj.value.toUpperCase(), alignment: 'center' }, 
            ])
        }
    })
    return {
        width: '*',
        table: {
            widths: ['*', '*', '*'],
            body: [
                [ { text: label, alignment: 'center', colSpan: 3 }, {}, {} ],
                [ 
                    { text: 'SEQ', alignment: 'center' }, 
                    { text: titles[0], alignment: 'center' },
                    { text: titles[1], alignment: 'center' }
                ],
                ...rows
            ]
        }
    }
}

async function renderFetoEVacina(report: any) {
    const valorKg = report.arroba ? (report.arroba / 100)/ARROBA : null
    const valorVacina = valorKg ? (report.vaccineWeight / 100) * valorKg : null

    const body = [
        [ { text: 'PESO VACINA', alignment: 'center' } ],
        [
            {
                stack: [
                    `${formatNumber((report.vaccineWeight / 100), 3)} KG/CBÇ`,
                    `(R$ ${valorVacina ? formatNumber(valorVacina) : ''})`,
                ],
                alignment: 'center'
            }
        ]
    ]

    if (report.sex == 'F' && Object.keys(report.fetus).length > 0) {
        let totalFetos = 0
        const arrayFetos: any[] = []
        if (report.sex == 'F') {
            report.fetus.forEach((fetos: any) => {
                if (!!fetos.type && fetos.value > 0) {
                    totalFetos += parseInt(fetos.value)
                    arrayFetos.push(`${fetos.value}${fetos.type}`)
                }
            })
        }
        let totalFetosString = 'NENHUM FETO\n\n'
        if (totalFetos > 0) {
            totalFetosString = `${totalFetos} FETOS: ${arrayFetos.join('/')}\n\n`
        }
        body.unshift([ { text: totalFetosString, alignment: 'center' } ])
        body.unshift([ { text: 'FETOS', alignment: 'center' } ])
    }

    return {
        width: '*',
        table: {
            widths: ['*'],
            body
        }
    }
}

export default async function(report: Report) {
    return {
        stack: [
            {
                columns: [
                    renderTableWithPercentage('MATURIDADE', report, 'maturity'),
                    renderTableWithPercentage('ACABAMENTO', report, 'finishing'),
                    renderTableWithPercentage('ESCORE RUMINAL', report, 'rumenScore'),
                    await renderFetoEVacina(report)
                ],
                columnGap: 10
            },
            {
                columns: [
                    renderSeqTable('DIF', report, 'dif', ['MOTIVO', 'DESTINO']),
                    renderSeqTable('HEMATOMA', report, 'bruises', ['LOCAL', 'ORIGEM']),
                ],
                columnGap: 10
            }
        ],
        colSpan: 4,
    }
}