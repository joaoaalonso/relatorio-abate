import { Report } from '../report'
import renderSection from './renderSection'

export default function (report: Report) {
    if (!report.corralEvaluation) return null

    return renderSection('Avaliação do curral', { text: report.corralEvaluation.toUpperCase() })
}