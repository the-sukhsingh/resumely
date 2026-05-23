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
     className="h-dvh w-full text-center overflow-hidden bg-background flex flex-col justify-center sticky bottom-0 z-0">
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
      <div className='w-full h-14 absolute bottom-24 flex justify-around'>
        <Link href="https://x.com/thesukhjitbajwa" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" className='fill-primary size-7' viewBox="0 0 256 256"><path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z"></path></svg></Link>
        <Link href="https://www.sukhjitsingh.me" target="_blank" rel="noopener noreferrer">
           <span className='inline-flex size-7 rounded-full bg-red-500'></span>
        </Link>
        
        <Link href="mailto:sukhaji65@gmail.com" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" className='size-7 fill-foreground' viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path></svg>
        </Link>
      </div>
    </motion.footer>
  )
}

export default Footer