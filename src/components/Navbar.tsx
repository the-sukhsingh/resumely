"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./theme/ThemeToggle";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Menu, LogOut, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
const Navbar = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const links = [
        { href: "/resume", label: "Resume" },
    ];

    return (
        <nav className={cn("fixed top-0 z-100 w-full",
            pathname.match(/^\/resume\/[^/]+$/) ? "bg-background" : "bg-transparent"
        )}>
            <div className="max-w-5xl mx-auto px-6">
                {/* Skip link for keyboard users */}
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 bg-background px-4 py-2 rounded-xl border border-border transition-all">Skip to content</a>

                <div className="flex items-center justify-between h-12">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group font-mono font-medium tracking-tight text-xl">
                        re.
                    </Link>

                    {/* Desktop Links */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                                        "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right side: auth / mobile menu */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[calc(100vw-2rem)] p-4 mt-2 border-border/50 shadow-2xl rounded-3xl bg-background/95 backdrop-blur-xl" align="end">
                                    <div className="space-y-4">
                                        {isAuthenticated && user ? (
                                            <>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {links.map((link) => (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            className={cn(
                                                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-medium text-sm",
                                                                "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                            )}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    ))}
                                                </div>

                                                <div className="pt-4 border-t border-border/50">
                                                    <div className="flex items-center gap-4 mb-6 px-3">
                                                        <Avatar className="h-10 w-10 rounded-full border border-border">
                                                            <AvatarImage src={user?.picture} />
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold truncate">{user?.name}</div>
                                                            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between p-4 mb-4 mx-1 rounded-2xl bg-muted/30 border border-border/50">
                                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Credits</span>
                                                        <span className="text-sm font-semibold">{user?.credits ?? 0}</span>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        className="w-full rounded-2xl gap-2 justify-start h-12 px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                        onClick={() => signOut()}
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <Button variant="neo" className="w-full rounded-full h-12 text-sm font-semibold" onClick={() => signIn("google")}>
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
                                <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
                            ) : isAuthenticated && user ? (
                                <div className="flex items-center gap-3">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all">
                                                <Avatar className="h-8 w-8 border border-border rounded-full">
                                                        <AvatarImage src={user.picture || undefined} />
                                                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                                        </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-0 mt-2 rounded-xl border-border/50 shadow-none bg-background/95 backdrop-blur-xl overflow-hidden gap-0" align="end">
                                            <div className="px-2.5 py-3 border-b border-border/50 bg-muted/10">
                                                <p className="text-sm font-semibold leading-none mb-1.5">{user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>

                                                <div className="mt-5 flex items-center justify-between p-2 rounded-lg bg-background border border-border/50 shadow-sm">
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Credits</span>
                                                    <span className="text-sm font-semibold">{user.credits ?? 0}</span>
                                                </div>
                                            </div>
                                            <div className=" space-y-1">
                                                <Link href="/" className="block w-full">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start gap-3 rounded-b-xl rounded-t-none h-11 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                        Buy Credits
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start gap-3 rounded-xl h-11 text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
                                <Button variant="neo" className="h-8 px-4 rounded-full text-sm font-semibold" onClick={() => signIn("google")}>
                                    Get Started
                                </Button>
                            )}
                            <div className="pl-2 border-l border-border/50 flex items-center h-6">
                                <ModeToggle />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;