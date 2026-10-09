"use client"

import { Sun, MoonStars } from "@/components/icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"


export function ModeToggle() {
    const { theme, systemTheme, setTheme } = useTheme();
    const toggleTheme = () => {
        if (theme === 'system') {
            if(systemTheme === 'dark') {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        } else {
            if(theme === 'dark') {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        }
    }



    return (
        <Button variant="ghost" size="icon" className="rounded-full border" 
            aria-label="Toggle theme"
            aria-description="Toggle light & dark"
            onClick={toggleTheme}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <MoonStars className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
    )
}
