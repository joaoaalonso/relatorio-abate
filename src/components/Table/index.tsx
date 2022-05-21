import './index.css'

interface TableProps {
    title?: string;
    children: JSX.Element;
}


function Table({ title, children }: TableProps) {
    return (
        <div className='custom-table-wrapper'>
            {!!title && <p className='custom-table-title'>{title}</p>}
            <table className='custom-table'>
                {children}
            </table>
        </div>
    )
}

export default Table