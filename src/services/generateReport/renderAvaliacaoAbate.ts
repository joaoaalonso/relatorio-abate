import CONSTANTS from './constants'
import formatNumber from './formatNumber'

function renderTable (label: string, input: any, inputKey: string) {
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

function renderFetoEVacina(input: any) {
    const valorKg = input.valorArroba ? input.valorArroba/CONSTANTS.ARROBA : null
    const valorVacina = valorKg ? input.pesoVacina * valorKg : null

    const body = [
        [ { text: 'PESO VACINA', alignment: 'center' } ],
        [
            {
                stack: [
                    `${formatNumber(input.pesoVacina, 3)} KG/CBÇ`,
                    `(R$ ${formatNumber(valorVacina)})`,
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
                totalFetos += fetos.value
                arrayFetos.push(`${fetos.value}${fetos.type}`)
            })
        }
        body.unshift([ { text: `${totalFetos} FETOS: ${arrayFetos.join('/')}\n\n`, alignment: 'center' } ])
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
        columns: [
            renderTable('MATURIDADE', input, 'maturidade'),
            renderTable('ACABAMENTO', input, 'acabamento'),
            renderTable('ESCORE RUMINAL', input, 'escoreRuminal'),
            renderFetoEVacina(input)
        ],
        colSpan: 4,
        columnGap: 10
    }
}