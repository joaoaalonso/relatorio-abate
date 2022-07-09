export default function (title: string, body: any) {
    body.margin = [8, 0, 8, 8]

    return {
        stack: [
            {
                table: {
                    widths: ['*'],
                    body: [
                        [{ text: title.toUpperCase(), bold: true, alignment: 'center' }]
                    ]
                }
            },
            body
        ]
    }
}