export default function (report: any) {
    if (!report.photos || !report.photos.length) return null
    return report.photos.map((photo: any) => { 
        return { image: photo, fit: [550, 760], alignment: 'center' }
    })
}