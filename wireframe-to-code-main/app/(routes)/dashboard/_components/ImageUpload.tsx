"use client"

// Statically import Cloudinary env variables for client-side use
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'wireframe-upload';
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CloudUpload, Loader2Icon, WandSparkles, X } from 'lucide-react'
import Image from 'next/image'
//@ts-ignore
import uuid4 from "uuid4";
import React, { ChangeEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import Constants from '@/data/Constants'
import { toast } from 'sonner'

function ImageUpload() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile] = useState<any>();
    const [model, setModel] = useState<string>();
    const [description, setDescription] = useState<string>();
    const { user } = useAuthContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const OnImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            console.log(files[0])
            const imageUrl = URL.createObjectURL(files[0]);
            setFile(files[0]);
            setPreviewUrl(imageUrl);
        }
    }

    const uploadToCloudinary = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', 'wireframe-to-code');

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded * 100) / event.total);
                    setUploadProgress(progress);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    console.log("✅ Cloudinary Upload Successful!");
                    console.log("📸 Image URL:", response.secure_url);
                    console.log("📊 Cloudinary Details:", {
                        public_id: response.public_id,
                        format: response.format,
                        width: response.width,
                        height: response.height,
                        size: response.bytes
                    });
                    resolve(response.secure_url);
                } else {
                    console.error("❌ Cloudinary Upload Failed:", xhr.status, xhr.responseText);
                    reject(new Error('Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                console.error("❌ Cloudinary Upload Error: Network error");
                reject(new Error('Upload failed'));
            });

            xhr.open(
                'POST',
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
            );
            xhr.send(formData);
        });
    };

    const OnConverToCodeButtonClick = async () => {
        if (!file || !model || !description) {
            console.log("Select All Field");
            toast('Please select all fields!');
            return;
        }
        setLoading(true);
        
        try {
            // Upload image to Cloudinary
            const imageUrl = await uploadToCloudinary(file);
            console.log("Image uploaded to Cloudinary:", imageUrl);

            const uid = uuid4();
            console.log(uid);
            
            // Save Info To Database
            const result = await axios.post('/api/wireframe-to-code', {
                uid: uid,
                description: description,
                imageUrl: imageUrl,
                model: model,
                email: user?.email
            });
            
            if (result.data?.error) {
                console.log("Not Enough credits");
                toast('Not Enough Credits!');
                setLoading(false);
                return;
            }
            
            setLoading(false);
            router.push('/view-code/' + uid);
            
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            toast('Failed to upload image. Please try again.');
            setLoading(false);
        }
    }

    return (
        <div className='mt-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {!previewUrl ? (
                    <div className='p-7 border border-dashed rounded-md shadow-md flex flex-col items-center justify-center'>
                        <CloudUpload className='h-10 w-10 text-primary' />
                        <h2 className='font-bold text-lg'>Upload Image</h2>
                        <p className='text-gray-400 mt-2'>Click Button Select Wireframe Image</p>
                        <div className='p-5 border border-dashed w-full flex mt-4 justify-center'>
                            <label htmlFor='imageSelect'>
                                <h2 className='p-2 bg-blue-100 font-bold text-primary rounded-md px-5'>Select Image</h2>
                            </label>
                        </div>
                        <input 
                            type="file" 
                            id='imageSelect'
                            className='hidden'
                            multiple={false}
                            onChange={OnImageSelect}
                        />
                    </div>
                ) : (
                    <div className='p-5 border border-dashed'>
                        <Image 
                            src={previewUrl} 
                            alt='preview' 
                            width={500} 
                            height={500}
                            className='w-full h-[250px] object-contain'
                        />
                        <X 
                            className='flex items-center justify-end w-full cursor-pointer'
                            onClick={() => setPreviewUrl(null)}
                        />
                    </div>
                )}
                
                <div className='p-5 border shadow-md rounded-lg'>
                    <h2 className='font-bold text-lg'>Select AI Model</h2>
                    <Select onValueChange={(value) => setModel(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select AI Model" />
                        </SelectTrigger>
                        <SelectContent>
                            {Constants?.AiModelList.map((model, index) => (
                                <SelectItem value={model.name} key={index}>
                                    <div className='flex items-center gap-2'>
                                        <Image src={model.icon} alt={model.name} width={25} height={25} />
                                        <h2>{model.name}</h2>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <h2 className='font-bold text-lg mt-7'>Enter Description about your webpage</h2>
                    <Textarea
                        onChange={(event) => setDescription(event?.target.value)}
                        className='mt-3 h-[150px]'
                        placeholder='Write about your web page' />
                </div>
            </div>

            <div className='mt-8 flex justify-center'>
                <Button 
                    onClick={OnConverToCodeButtonClick}
                    disabled={!file || !model || !description || loading}
                    className='w-full md:w-auto'
                >
                    {loading ? (
                        <>
                            <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                            Processing...
                        </>
                    ) : (
                        <>
                            <WandSparkles className='mr-2 h-4 w-4' />
                            Convert to Code
                        </>
                    )}
                </Button>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className='mt-4'>
                    <div className='w-full bg-gray-200 rounded-full h-2.5'>
                        <div 
                            className='bg-blue-600 h-2.5 rounded-full transition-all duration-300' 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <p className='text-center mt-2 text-sm text-gray-600'>
                        Uploading... {uploadProgress}%
                    </p>
                </div>
            )}
        </div>
    )
}

export default ImageUpload;
