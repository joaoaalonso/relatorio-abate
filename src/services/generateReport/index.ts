import { save } from '@tauri-apps/api/dialog'
import { writeBinaryFile } from '@tauri-apps/api/fs'

import swal from 'sweetalert'
import pdfMake from 'pdfmake/build/pdfmake'

import vfs from './vfs'
import formatNumber from'./formatNumber'
import renderDados from './renderDados'
import renderFetos from './renderFetos'
import renderAcerto from './renderAcerto'
import renderValorMedia from './renderValorMedia'
import renderAssinatura from './renderAssinatura'
import renderAvaliacaoAbate from './renderAvaliacaoAbate'
import renderPesoRendimento from './renderPesoRendimento'

export default function(input: any) {
    const docDefinitions: any = {
        pageSize: 'A4',
        defaultStyle: {
            fontSize: 9
        },
        content: [
            {
                table: {
                    widths: [70, '*', 70, 70],
                    body: [
                        [
                            { image: 'data:image/jpeg;base64,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', width: 70 },
                            {
                                stack: [
                                    '\n',
                                    '\n',
                                    { text: 'RELATÓRIO', alignment: 'center', bold: true, fontSize: 12 },
                                    { text: 'FINAL', alignment: 'center', bold: true, fontSize: 12 },
                                    '\n',
                                    `DATA: ${input.data}`
                                ],
                                colSpan: 2
                            },
                            {},
                            {
                                stack: [
                                    'Criado:',
                                    input.dataCriacao,
                                    '\n',
                                    `Revisão: ${('00' + input.numeroRevisao).slice(-2)}`,
                                    input.dataRevisao
                                ],
                                alignment: 'center'
                            }
                        ],
                        [
                            renderDados(input), {},
                            renderValorMedia(input), {}
                        ],
                        [
                            { text: 'AVALIAÇÃO DO CURRAL', alignment: 'center', colSpan: 2 }, {},
                            { text: `PESO TOTAL: ${formatNumber(input.PC*input.numeroAnimais)} KG`, alignment: 'center', colSpan: 2 }, {}
                        ],
                        [
                            { text: input.avaliacaoCurral.toUpperCase(), colSpan: 2}, {},
                            renderPesoRendimento(input), {}
                        ],
                        [
                            { text: 'AVALIAÇÃO DO ABATE', alignment: 'center', colSpan: 4 }, {}, {}, {}
                        ],
                        [
                            renderAvaliacaoAbate(input), {}, {}, {}
                        ]
                    ]
                }
            },
            {text: '\n'},
            {
                table: {
                    widths: ['*'],
                    body: [[
                        {
                            stack: [
                                'Observações adicionais:',
                                input.observacoes?.toUpperCase() || '\n'
                            ]
                        }
                    ]]
                }
            },
            {text: '\n'},
            renderFetos(input),
            {text: '\n'},
            {text: '\n'},
            renderAcerto(input),
            {text: '\n'},
            {text: '\n'},
            renderAssinatura(input)
        ]
    }

    pdfMake.vfs = vfs

    save({
        title: 'Onde deseja salvar o relatório?',
        defaultPath: 'Relatório Final.pdf',
        filters: [{name: 'PDF', extensions: ['pdf']}]
    })
    .then(path => {
        pdfMake
            .createPdf(docDefinitions)
            .getBuffer(buffer => {
                writeBinaryFile({ contents: buffer, path })
                .then(() => {
                    swal('', 'Relatório salvo com sucesso!', 'success')
                })
        })
    })
    .catch(e => {
        swal('', 'Ocorreu um erro ao salvar o relatório', 'error')
    })
}