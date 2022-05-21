export default function (input: any) {
    return {
        table: {
            body: [
                [
                    `UNIDADE ABATEDOURA: ${input.unidadeAbatedoura.toUpperCase()}`, 
                    `Nº DE ANIMAIS: ${input.numeroAnimais}`
                ],
                [
                    `MUNICÍPIO: ${input.municipioUnidadeAbatedoura.toUpperCase()}`,
                    `LOTE: ${input.lote}\tCURRAL: ${input.curral}`
                ],
                [
                    `PROPRIETÁRIO: ${input.proprietario.toUpperCase()}`,
                    `SEQUENCIAL: ${input.sequencial}`
                ],
                [
                    `PROPRIEDADE: ${input.propriedade.toUpperCase()}`,
                    `RAÇA: ${input.raca.toUpperCase()}`
                ],
                [
                    `MUNÍCIPIO: ${input.municipioPropriedade.toUpperCase()}`,
                    `SEXO: ${input.sexo.toUpperCase()}`
                ],
            ]
        },
        colSpan: 2,
        layout: 'noBorders'
    }
}