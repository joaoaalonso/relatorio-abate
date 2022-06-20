import './styles.css'

import formatDate from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'
import { BiChevronRight } from 'react-icons/bi'

import { ReportItem } from '../../services/report'
import { getSexLabel } from '../../services/sex'

interface ReportCardProps {
    report: ReportItem
}

function ReportCard({ report }: ReportCardProps) {
    return (
        <div className='report-card'>
            <span>{report.client}</span>
            <span>{report.slaughterhouse}</span>
            <span>{report.ranch}</span>
            <span>{getSexLabel(report.sex)}</span>
            <span>{formatDate(new Date(report.date), 'dd/MM/yyyy', { locale: ptBr })}</span>
            <BiChevronRight />
        </div>
    )
}

export default ReportCard