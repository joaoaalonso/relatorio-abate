import './index.css'

interface TableProps {
    title?: string;
    children: JSX.Element;
    righComponent?: JSX.Element;
}


function Table({ title, righComponent, children }: TableProps) {
    return (
        <div className='custom-table-wrapper'>
            <div className='custom-table-title'>
                {!!title && <p>{title}</p>}
                {righComponent}
            </div>
            <table className='custom-table'>
                {children}
            </table>
        </div>
    )
}

export default Table