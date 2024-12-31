'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative h-10 w-10 rounded-full border-2 transition-colors duration-300 hover:border-primary"
                >
                    <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all duration-300 ease-in-out dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2 min-w-[150px] rounded-lg border-2">
                {['light', 'dark', 'system'].map((themeOption) => (
                    <DropdownMenuItem
                        key={themeOption}
                        onClick={() => setTheme(themeOption)}
                        className={`flex items-center justify-between gap-2 capitalize transition-colors hover:bg-accent ${theme === themeOption ? 'bg-accent' : ''
                            }`}
                    >
                        <span>{themeOption}</span>
                        {theme === themeOption && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}