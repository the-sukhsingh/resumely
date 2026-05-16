"use client"
import React from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { signIn } from 'next-auth/react'

const HeroSection = () => {
    const { user } = useAuth()
    return (
        <section className="mx-auto max-w-5xl px-6 pt-[25vh] pb-32 flex flex-col items-center justify-center text-center gap-6 relative z-10 h-dvh">
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-[4.5rem] font-bold tracking-tighter text-foreground leading-[1.05] max-w-3xl"
            >
                Optimize once. <br className="hidden sm:block" />
                Apply <span className="text-muted-foreground/50 font-medium italic">everywhere.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xs md:text-base text-muted-foreground max-w-xl leading-relaxed mt-2"
            >
                Stop tailoring resumes manually. Keep one master record of your experience, and let our engine align it perfectly to any job description.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-28 w-full sm:w-auto"
            >
                {user ? <Button asChild variant="neo" size="lg" className="h-12 px-8 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group">
                    <Link href={user ? "/resume" : "/auth"}>
                        {user ? 'Go to Dashboard' : 'Start building'}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button> : <Button onClick={() => signIn("google")} variant="neo" size="lg" className="h-12 px-8 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group">
                    Start building
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>}

                <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-full text-sm font-medium tracking-wide w-full sm:w-auto bg-transparent hover:bg-muted/10">
                    <Link href="#how-it-works" className='backdrop-blur-xs'>
                        <Play className="w-4 h-4 mr-2" />
                        How it works
                    </Link>
                </Button>
            </motion.div>
        </section>
    )
}

export default HeroSection