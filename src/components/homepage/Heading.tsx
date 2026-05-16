"use client"
import { cn } from '@/lib/utils'
import React from 'react'

const Heading = ({
    children,
    className,
    as: Component = 'h1',
  }: {
    children: React.ReactNode
    className?: string
    as?: React.ElementType
}) => {
  return (
      <Component className={cn("text-4xl md:text-5xl text-left font-bold tracking-tight", className)}>
      {children}
    </Component>
  )
}

export default Heading