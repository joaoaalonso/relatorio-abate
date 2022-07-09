import { Report } from '../report'
import renderSection from './renderSection'

export default function (report: Report) {
    if (!report.comments) return null

    return renderSection('Observações adicionais', { text: report.comments.toUpperCase() })
}