"use client"
import React from 'react'
import { ThemeProvider } from './theme/ThemeProvider'
import { TooltipProvider } from './ui/tooltip'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SessionProvider } from "next-auth/react";

import { AuthProvider } from '@/context/AuthContext';
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <TooltipProvider>
                <ConvexProvider client={convex}>
                    <SessionProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </SessionProvider>
                </ConvexProvider>
            </TooltipProvider>
        </ThemeProvider>
    )
}

export default Providers