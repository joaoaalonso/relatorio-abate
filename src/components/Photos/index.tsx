import './index.css'
import React from 'react';

import { BiPlus, BiX } from 'react-icons/bi'

interface PhotosProps {
    photos: string[];
    setPhotos: (photos: string[]) => void;
}

function Photos({ photos, setPhotos }: PhotosProps) {
    async function addPhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const newPhotos = e?.target?.files
        const convertedPhotos: string[] = []
        if (newPhotos && newPhotos.length) {
            for (let i = 0; i < newPhotos.length; i++) {
                await new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(newPhotos[i])
                    reader.onload = () => {
                        if (reader.result) {
                            convertedPhotos.push(reader.result?.toString())
                        }
                        resolve(true)
                    }
                })
            }
            setPhotos([...photos, ...convertedPhotos])
            const inputElem: any = document?.getElementById('add-photo')
            if (inputElem) {
                inputElem.value = ''
            }
        }
    }

    function removePhoto(index: number) {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    }

    return (
        <div className='photos-container'>
            <div className='photos-header'>
                <span>Fotos</span>
                <input 
                    id='add-photo' 
                    type='file' 
                    onChange={addPhoto} 
                    accept='image/*'
                    multiple 
                />
                <label htmlFor='add-photo'><BiPlus /></label>
            </div>
            <div className='photos-body'>
                {photos.map((photo, index) => (
                    <div key={`photo-${index}`} className='photo-wrapper'>
                        <img src={photo} />
                        <a onClick={() => removePhoto(index)}><BiX size={30} /></a>
                    </div>
                ))}
                {!photos.length && <span>Nenhum foto adicionada</span>}
            </div>
        </div>
    )
}

export default Photos