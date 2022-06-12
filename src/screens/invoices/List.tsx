import { BiPlus } from "react-icons/bi"
import { Link } from "react-router-dom"
import ScreenTemplate from "../../components/ScreenTemplate"

function InvoiceList() {
    return (
        <ScreenTemplate
            title="Relatórios"
            rightComponent={(
                <Link to="/invoices/add">
                    <BiPlus size={25} className='svg-button' />
                </Link>
            )}
        >
            <>
                <div>Invoice list</div>
            </>
        </ScreenTemplate>
    )
}

export default InvoiceList