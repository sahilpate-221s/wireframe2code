# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com and sign up for a free account
2. Verify your email address

## Step 2: Get Your Cloud Name
1. Log into your Cloudinary dashboard
2. Your cloud name is displayed on the dashboard (e.g., "your-cloud-name")

## Step 3: Create Upload Preset
1. Go to Settings → Upload → Add upload preset
2. Set the following:
   - Name: `wireframe-upload`
   - Signing Mode: Unsigned
   - Folder: `wireframe-to-code`
   - Access Control: Public
3. Save the preset

## Step 4: Update Environment Variables
Create a `.env.local` file in your project root and add:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=wireframe-upload
```

## Step 5: Test the Integration
1. Restart your development server
2. Try uploading an image through the dashboard
3. Check Cloudinary Media Library to confirm upload

## Features
- ✅ Free Cloudinary storage
- ✅ Automatic image optimization
- ✅ CDN delivery for fast loading
- ✅ Secure uploads
- ✅ Folder organization
