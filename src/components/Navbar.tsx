"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./theme/ThemeToggle";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Menu, X, Rocket, LogOut, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    const links = [
        { href: "/resume", label: "Resume" },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full border-b bg-background transition-all duration-300 ">
            <div className="max-w-5xl mx-auto px-4 xl:px-0">
                {/* Skip link for keyboard users */}
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 bg-background px-4 py-2 rounded-full border shadow-lg transition-all">Skip to content</a>

                <div className="flex items-center justify-between h-12">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl font-bold font-mono tracking-tighter">
                            <svg viewBox="0 0 24 24" color="#78B6DD" className="size-8"><path fill="currentColor" d="M 6 2 C 4.895 2 4 2.895 4 4 L 4 5 C 3.23 5 2.749 5.833 3.134 6.5 C 3.313 6.809 3.643 7 4 7 L 4 9 C 3.23 9 2.749 9.833 3.134 10.5 C 3.313 10.809 3.643 11 4 11 L 4 13 C 3.23 13 2.749 13.833 3.134 14.5 C 3.313 14.809 3.643 15 4 15 L 4 17 C 3.23 17 2.749 17.833 3.134 18.5 C 3.313 18.809 3.643 19 4 19 L 4 20 C 4 21.105 4.895 22 6 22 L 18 22 C 19.105 22 20 21.105 20 20 L 20 4 C 20 2.895 19.105 2 18 2 L 6 2 Z" opacity=".3" fillRule="evenodd" className="duo-icons-secondary-layer"/><path fill="currentColor" d="M 8.5 6 C 7.672 6 7 6.672 7 7.5 L 7 8.5 C 7 9.328 7.672 10 8.5 10 L 15.5 10 C 16.328 10 17 9.328 17 8.5 L 17 7.5 C 17 6.672 16.328 6 15.5 6 L 8.5 6 Z" fillRule="evenodd" className="duo-icons-primary-layer"/></svg>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center space-x-1">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                        "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right side: auth / mobile menu */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[calc(100vw-2rem)] p-4 mt-2 border-primary/10 shadow-2xl backdrop-blur-2xl bg-background/95 rounded-2xl" align="end">
                                    <div className="space-y-4">
                                        {isAuthenticated ? (
                                            <>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {links.map((link) => (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            className={cn(
                                                                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium",
                                                                "text-muted-foreground hover:bg-accent hover:text-foreground"
                                                            )}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    ))}
                                                </div>

                                                <div className="pt-4 border-t border-primary/10 ">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                                                            <AvatarImage src={user?.imageUrl || undefined} alt={user?.name || "User"} />
                                                            <AvatarFallback className="bg-primary/5 text-primary">
                                                                {user?.name?.charAt(0).toUpperCase() || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold truncate">{user?.name}</div>
                                                            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                                                            <div className="mt-1 flex items-center gap-1 text-primary">
                                                                <Rocket className="h-3 w-3" />
                                                                <span className="text-xs font-bold">{user?.credits ?? 0} Credits</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full rounded-xl gap-2 border-primary/20"
                                                        onClick={() => signOut()}
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <Button variant={"neo"} className="w-full rounded-md h-12 text-base font-semibold" onClick={() => signIn("google")}>
                                                Get Started
                                            </Button>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-3">
                            {isLoading ? (
                                <div className="w-10 h-10 rounded-full bg-accent animate-pulse" />
                            ) : isAuthenticated && user ? (
                                <div className="flex items-center gap-3 pl-4 border-l">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-transparent ring-primary/20 transition-all hover:ring-4 ">
                                                <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                                                    <AvatarImage src={user.imageUrl || undefined} />
                                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-2 mt-2" align="end">
                                            <div className="px-3 py-4 border-b">
                                                <p className="text-sm font-semibold leading-none">{user.name}</p>
                                                <p className="text-xs text-muted-foreground mt-2 truncate">{user.email}</p>
                                                <div className="mt-4 flex items-center justify-between p-2 rounded-xl bg-accent/50 border">
                                                    <span className="text-xs font-medium text-muted-foreground">Available Credits</span>
                                                    <span className="text-sm font-bold text-primary">{user.credits ?? 0}</span>
                                                </div>
                                            </div>
                                            <div className="p-1 space-y-1">
                                                <Link href="/profile" className="block w-full">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                        Buy Credits
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    onClick={() => signOut()}
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Sign Out
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            ) : (
                                <Button variant={"neo"} className="px-4 border rounded-full" onClick={() => signIn("google")}>
                                    Get Started
                                </Button>
                            )}
                            <div className="pl-2">
                                <ModeToggle />
                            </div>
                        </div>

                        {/* Mobile Side Controls */}
                        <div className="md:hidden flex items-center gap-2">
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;