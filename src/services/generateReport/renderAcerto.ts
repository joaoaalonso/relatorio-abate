import formatNumber from './formatNumber'
import { getArroba, getDiscountValue } from '../configs'

export default function (input: any) {
    if (!input.valorArroba) return null

    const mediaLote = input.PC / getArroba()
    const valorBruto = input.valorArroba * input.numeroAnimais * mediaLote
    const porcentagemDesconto = getDiscountValue(input.desconto)
    const desconto = valorBruto * porcentagemDesconto

    const textoPorcentagemDesconto = `${formatNumber(porcentagemDesconto * 100, 1)}%`



    let valorPremiacoes = 0
    const premiacoes: any[] = []
    input.premiacoes.forEach((premiacao: any) => {
        if(!!premiacao.type && !!premiacao.value) {
            const value = parseFloat(premiacao.value)
            valorPremiacoes += value
            premiacoes.push(`${premiacao.type.toUpperCase()}: R$ ${formatNumber(value)}`) 
        }
    })
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