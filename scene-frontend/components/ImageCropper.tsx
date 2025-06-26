import Cropper from 'react-easy-crop';
import React, { useState, useCallback, useEffect } from 'react';
import type { Area } from 'react-easy-crop';

const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous'; // To avoid CORS issues
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get canvas context');
  
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        // Convert to Blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject('Canvas is empty');
            return;
          }
          resolve(blob);
        }, 'image/jpeg');
      };
  
      image.onerror = (e) => reject('Image load error');
    });
  };

  export default function ImageCropper({ previewUrl, handleCrop, uploadStatus }: { previewUrl: string , handleCrop:any, uploadStatus: number}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isCropped, setIsCropped] = useState(false)
    // Auto zoom to simulate object-cover
    // useEffect(() => {
    //   const img = new Image();
    //   img.src = previewUrl;
    //   img.onload = () => {
    //     const minZoom = Math.max(
    //       window.innerWidth / img.width,
    //       250 / img.height
    //     );
    //     setZoom(minZoom);
    //   };
    // }, [previewUrl]);
    
    const onCropComplete = useCallback(
      (_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
      },
      []
    );
  
    const getCroppedImage = async () => {
      if (!croppedAreaPixels) return;
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
      handleCrop(croppedBlob);
      setIsCropped(true)
      // upload to server here
    };
  
    return (
        <div>
      {(!isCropped || uploadStatus === 6) ? 
      <div>
      <div className="relative w-full h-[250px] bg-black rounded-xl overflow-hidden">
        <Cropper
          image={previewUrl}
          crop={crop}
          zoom={zoom}
          aspect={window.innerWidth / 250}
          cropSize={{ width: window.innerWidth, height: 250 }}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={false}
          restrictPosition={false}
        />
        <button
          className="absolute bottom-2 right-2 bg-white px-4 py-1 rounded text-sm"
          onClick={getCroppedImage}
        >
          Save
        </button>
      </div>
      <div className='text-center mt-1 text-sm'>crop your image for this frame</div>
      </div>
    :
    <div>
    <div className="relative w-full h-[250px] bg-black rounded-xl overflow-hidden">
        <img src={previewUrl} className='object-cover h-full w-full' />
    </div>
    <div className='text-center mt-1 text-sm'>image preview</div>
    </div>
    }
      </div>
    );
  }