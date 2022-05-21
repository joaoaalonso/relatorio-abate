import CONSTANTS from './constants'
import formatNumber from './formatNumber'

export default function(input: any) {
    if (input.sexo != 'F' || Object.keys(input.fetos).length == 0) return null

    let pesoTotalFetos = 0
    const descricaoFetos: any[] = []
    input.fetos.forEach((fetos: any) => {
        const type: 'P' | 'M' | 'G' = fetos.type
        pesoTotalFetos += CONSTANTS.PESO_FETO[type] * fetos.value
        descricaoFetos.push(`${fetos.value} FETOS DE TAMANHO ${type} ${CONSTANTS.IDADE_FETO[type]} COM MÉDIA DE ${CONSTANTS.IDADE_FETO[type]} KG`)
    })
    const pesoMedioFeto = pesoTotalFetos/input.numeroAnimais
    const RCAjustado = (input.PC/(input.PV - pesoMedioFeto))*100
    const PVAjustado = (input.PV - pesoMedioFeto)

    return {
        stack: [
            ...descricaoFetos,
            `*TOTALIZANDO PERDA DE +/- ${formatNumber(pesoTotalFetos)}KG DE FETO NO LOTE`,
            {
                columns: [
                    { text: `CONSIDERANDO ${formatNumber(pesoTotalFetos)}KG DE FETO, SERIA -${formatNumber(pesoMedioFeto)}KG NA MÉDIA DE PV(${formatNumber(PVAjustado)}) COM RC:`, width: 'auto' },
                    { text: ' ', width: 2 },
                    { text: `${formatNumber(RCAjustado, 1)}%`, width: 'auto', color: 'red' }
                ]
            }
        ]
    }
}