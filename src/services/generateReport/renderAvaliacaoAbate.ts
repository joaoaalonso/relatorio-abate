import { getArroba } from '../configs'
import formatNumber from './formatNumber'

function renderTableWithPercentage (label: string, input: any, inputKey: string) {
    const rows: any[] = []
    input[inputKey].forEach((obj: any) => {
        const percentil = (obj.value / input.numeroAnimais)*100
        rows.push([
            { text: `${obj.type}`, alignment: 'center' }, 
            { text: `${obj.value} (${formatNumber(percentil, 1)}%)`, alignment: 'center' }, 
        ])
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

function renderFetoEVacina(input: any) {
    const valorKg = input.valorArroba ? input.valorArroba/getArroba() : null
    const valorVacina = valorKg ? input.pesoVacina * valorKg : null

    const body = [
        [ { text: 'PESO VACINA', alignment: 'center' } ],
        [
            {
                stack: [
                    `${formatNumber(input.pesoVacina, 3)} KG/CBÇ`,
                    `(R$ ${valorVacina ? formatNumber(valorVacina) : ''})`,
                ],
                alignment: 'center'
            }
        ]
    ]

    if (input.sexo == 'F' && Object.keys(input.fetos).length > 0) {
        let totalFetos = 0
        const arrayFetos: any[] = []
        if (input.sexo == 'F') {
            input.fetos.forEach((fetos: any) => {
                if (!!fetos.type && !!fetos.value) {
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

export default function(input: any) {
    return {
        stack: [
            {
                columns: [
                    renderTableWithPercentage('MATURIDADE', input, 'maturidade'),
                    renderTableWithPercentage('ACABAMENTO', input, 'acabamento'),
                    renderTableWithPercentage('ESCORE RUMINAL', input, 'escoreRuminal'),
                    renderFetoEVacina(input)
                ],
                columnGap: 10
            },
            {
                columns: [
                    renderSeqTable('DIF', input, 'dif', ['MOTIVO', 'DESTINO']),
                    renderSeqTable('HEMATOMA', input, 'hematomas', ['LOCAL', 'ORIGEM']),
                ],
                columnGap: 10
            }
        ],
        colSpan: 4,
    }
}