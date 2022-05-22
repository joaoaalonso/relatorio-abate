export default function (input: any) {
    if (!input.fotos || !input.fotos.length) return null
    return input.fotos.map((foto: any) => { 
        return { image: foto, fit: [550, 760], alignment: 'center' }
    })
}