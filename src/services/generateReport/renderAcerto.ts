import formatNumber from './formatNumber'
import CONSTANTS from './constants'

export default function (input: any) {
    if (!input.valorArroba) return null

    const mediaLote = input.PC / CONSTANTS.ARROBA
    const valorBruto = input.valorArroba * input.numeroAnimais * mediaLote
    const porcentagemDesconto = input.desconto == 'funrural' ? CONSTANTS.DESCONTO_FUNRURAL : CONSTANTS.DESCONTO_SENAR
    const desconto = valorBruto * porcentagemDesconto

    const textoPorcentagemDesconto = `${formatNumber(porcentagemDesconto * 100, 1)}%`



    let valorPremiacoes = 0
    const premiacoes: any[] = []
    // Object.keys(input.premiacoes).forEach(key => {
    //     valorPremiacoes += input.premiacoes[key]
    //     premiacoes.push(`${key.toUpperCase()}: R$ ${formatNumber(input.premiacoes[key])}`)
    // })
    const valorLiquido = valorBruto - desconto + valorPremiacoes

    return {
        stack: [
            { text: 'ACERTO:', bold: true },
            '\n',
            ...premiacoes,
            `VALOR BRUTO: R$ ${formatNumber(valorBruto)}`,
            `DSCONTO ${input.desconto.toUpperCase()} (${textoPorcentagemDesconto}): R$ ${formatNumber(desconto)}`,
            `VALOR LÍQUIDO: R$ ${formatNumber(valorLiquido)}`,
        ]
    }
}