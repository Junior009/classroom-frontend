import React from 'react'
import {useRef, useState, useEffect} from "react";
import {UploadWidgetValue} from "@/types";
import { UploadCloud } from 'lucide-react';

const UploadWidget = ({value = null, onChange, disabled = false}) => {
    const widgetRef = React.useRef<CloudinaryWidget | null>(null);
    const onChangeRef = useRef(onChange);

    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
    const [deleteToKen, setDeleteToken] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        setPreview(value);
        if(!value) setDeleteToken(null);
    }, [value]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if(typeof window === 'undefined') return;

        const initializeWidget = () => {
            if(!window.cloudinary || widgetRef.current) return false;

            widgetRef.current = window.cloudinary.createUploadWidget(
                {
                    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                    multiple: false,
                    folder: "uploads",
                    maxFileSize: 5 * 1024 * 1024, // 5MB
                    clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                    sources: ["local", "url", "camera"],
                },
                (error, result) => {
                    if (!error && result.event === "success") {
                        const payload: UploadWidgetValue = {
                            url: result.info.secure_url,
                            publicId: result.info.public_id,
                        };
                        setPreview(payload);

                        setDeleteToken(result.info.delete_token ?? null);
                        onChangeRef.current?.(payload);
                    }
        });
        return true;
    }

    if(initializeWidget()) return;

    const intervalId = setInterval(() => {
        if(initializeWidget()) {
            window.clearInterval(intervalId);
        }
    }, 500);

    return () => window.clearInterval(intervalId);
    }, []);

    const openWidget = () => {
        if(!disabled) widgetRef.current?.open();
    }

    const removeFromCludinary = async () => {}
    
  return (
    <div className="space-y-2">
        {preview ? (
            <div className="upload-previw">
                <img src={preview.url} alt="Preview" className="upload-image" />
            </div>
            
        ): <div className="upload-dropzone" role='button' tabIndex={0} onClick={openWidget} onKeyDown={(e) => {
            if(e.key === 'Enter') {
                e.preventDefault();
                openWidget();
            }
        }}
            >
                <div className="upload-prompt">
                    <UploadCloud className="upload-icon" />
                    <div>
                        <p className="upload-text">Click to upload</p>
                        <p className="upload-subtext">PNG, JPG up to 5MB</p>
                
                    </div>
                </div>
            </div>}
    </div>
  )
}

export default UploadWidget