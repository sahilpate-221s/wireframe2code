"use client"
import { auth } from '@/configs/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface AuthenticationProps {
    children: React.ReactNode;
    onSuccess?: () => void;
}

function Authentication({ children, onSuccess }: AuthenticationProps) {
    const [isLoading, setIsLoading] = useState(false);
    const provider = new GoogleAuthProvider();

    const onButtonPress = async () => {
        if (!auth) {
            toast.error("Authentication service is not available. Please check your configuration.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            console.log("User signed in:", user);
            toast.success("Successfully signed in!");
            
            if (onSuccess) {
                onSuccess();
            }
            
            // Redirect after successful login
            window.location.href = '/view-code';
            
        } catch (error: any) {
            console.error("Authentication error:", error);
            
            // Handle specific error cases
            if (error.code === 'auth/popup-blocked') {
                toast.error("Popup blocked. Please allow popups for this site.");
            } else if (error.code === 'auth/popup-closed-by-user') {
                toast.info("Sign-in cancelled by user.");
            } else if (error.code === 'auth/unauthorized-domain') {
                toast.error("This domain is not authorized for OAuth operations.");
            } else {
                toast.error(`Sign-in failed: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div 
                onClick={onButtonPress} 
                className={isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                aria-disabled={isLoading}
            >
                {children}
            </div>
        </div>
    )
}

export default Authentication
