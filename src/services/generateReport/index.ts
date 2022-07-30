import pdfMake from 'pdfmake/build/pdfmake'
import { writeBinaryFile } from '@tauri-apps/api/fs'

import vfs from './vfs'
import renderInfo from './renderInfo'
import renderFetus from './renderFetus'
import renderHeader from './renderHeader'
import renderPhotos from './renderPhotos'
import renderWeights from './renderWeights'
import renderComments from './renderComments'
import renderSignature from './renderSignature'
import renderCorralEvaluation from './renderCorralEvaluation'
import { 
    getDif, 
    getFetus, 
    getPhotos, 
    getBruises, 
    getMaturity, 
    getFinishing, 
    getReportById, 
    getRumenScore
} from '../report'
import renderPenalties from './renderPenalties'

export default async function(reportId: number, path: string): Promise<boolean> {
    const report = await getReportById(reportId)
    
    report.dif = await getDif(reportId)
    report.fetus = await getFetus(reportId)
    report.photos = await getPhotos(reportId)
    report.bruises = await getBruises(reportId)
    report.maturity = await getMaturity(reportId)
    report.finishing = await getFinishing(reportId)
    report.rumenScore = await getRumenScore(reportId)

    const sections = [
        renderHeader,
        renderInfo,
        renderCorralEvaluation,
        renderWeights,
        renderPenalties,
        renderFetus,
        renderComments,
        renderSignature,
        renderPhotos    
    ]

    async function renderSections() {
        const processedSections = []
        for(let i = 0; i < sections.length; i++) {
            processedSections.push(await sections[i](report))
        }
        return processedSections
    }

    const docDefinitions: any = {
        pageSize: 'A4',
        defaultStyle: {
            fontSize: 9
        },
        content: [
            {
                stack: await renderSections()
            }
        ]
    }

    pdfMake.vfs = vfs
    return new Promise((resolve) => {
        pdfMake
            .createPdf(docDefinitions)
            .getBuffer(buffer => {
                writeBinaryFile({ contents: buffer, path })
                .then(() => {
                    resolve(true)
                })
        })
    })
}