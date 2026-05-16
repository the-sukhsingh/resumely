"use client"
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'


const Footer = () => {
  const {user} = useAuth()
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      viewport={{ once: true }}
     className="h-dvh w-full text-center px-6 overflow-hidden bg-background flex flex-col justify-center sticky bottom-0 z-0">
      <div className="absolute inset-0 bg-linear-to-t from-foreground/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Ready to apply?</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">Join the future of job applications and never write a tailored resume from scratch again.</p>
        <Button asChild variant="neo" size="lg" className="h-14 px-10 rounded-full text-base font-semibold tracking-wide w-full sm:w-auto group">
          <Link href={user ? "/resume" : "/auth"}>
            {user ? 'Go to Dashboard' : 'Start building now'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </Button>
      </div>
    </motion.footer>
  )
}

export default Footer