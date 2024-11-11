// components/auth-layout.tsx
'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  showAdminButton?: boolean;
}

export default function AuthLayout({ children, showAdminButton = true }: AuthLayoutProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        )}
        <Image
            onLoadingComplete={() => setIsLoading(false)}
            src="/riceuni_wallpaper.jpeg"
            alt="Rice University Logo"
            fill
            priority
            className="object-cover"
            quality={100}
            onError={() => setImageError(true)}
            style={{ display: imageError ? 'none' : 'block' }}
        />



      {/* Dark overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
      />
      
      {/* Admin Login Button */}
      {showAdminButton && (
        <div className="absolute top-4 right-4 z-20">
          <Link href="/admin/sign-in">
            <Button className="bg-neutral-950 hover:bg-blue-900 text-white">
              Admin Login
            </Button>
          </Link>
        </div>
      )}

        {!showAdminButton && (
        <div className="absolute top-4 left-4 z-20">
            <Link href="/sign-in">
            <Button variant="outline" className="bg-white/80 hover:bg-white/90">
                ← Not an Admin?
            </Button>
            </Link>
        </div>
        )}

      {/* Content */}
      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Rice University</h1>
          <p className="text-gray-200">A* Search Learning Activity</p>
        </div>
        
        {/* Card with glass effect */}
        <div className="backdrop-blur-sm bg-white rounded-lg shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}