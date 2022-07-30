export default function (title: string, body: any) {
    body.margin = [8, 0, 8, 8]

    return {
        stack: [
            {
                table: {
                    widths: ['*'],
                    body: [
                        [{ 
                            text: title.toUpperCase(), 
                            bold: true, 
                            margin: [8, 0], 
                            color: '#e3e3cd',
                        }]
                    ]
                },
                fillColor: '#45454e',
                layout: 'noBorders'
            },
            body
        ]
    }
}