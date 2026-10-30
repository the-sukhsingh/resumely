"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./theme/ThemeToggle";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Menu, LogOut, CreditCard, FileText, Briefcase, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import ColoredButton from "./custom/colored-button";
import AnimatedSwitcher from "./custom/animated-switcher";
import WorkspaceWarmer from "./workspace/WorkspaceWarmer";
import UserProfilePopover from "./navbar/UserProfilePopover";
import BuyCreditsDialog from "./navbar/BuyCreditsDialog";

const Navbar = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);

    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 15);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { href: "/resume", label: "Resumes", icon: FileText },
        { href: "/tracker", label: "Job Tracker", icon: Briefcase },
    ];

    if (pathname.startsWith("/r/") || pathname.startsWith("/resume/view/")) {
        return null;
    }

    return (
        <nav className={cn(
            "fixed top-0 z-50 w-full transition-all duration-200",
            pathname.match(/^\/resume\/[^/]+$/) 
                ? "bg-background border-b border-border/50" 
                : scrolled 
                    ? "bg-background/85 backdrop-blur-md border-b border-border/40 shadow-xs" 
                    : "bg-transparent border-b border-transparent"
        )}>
            <div className={cn(
                "mx-auto px-4 sm:px-6 transition-all duration-200",
                isHome ? "max-w-[1380px] lg:px-8" : "max-w-5xl"
            )}>
                {/* Skip link for keyboard users */}
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 bg-background px-4 py-2 rounded-xl border border-border transition-all">Skip to content</a>

                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Brand Logo & Wordmark (Matching editorial reference) */}
                    <Link href="/" className="flex items-center gap-2 group tracking-tight">
                        <svg
                            className="w-5 h-5 text-neutral-800 dark:text-neutral-200 transition-transform group-hover:scale-105"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
                        </svg>
                        <span className="font-sans font-medium text-lg text-neutral-900 dark:text-neutral-100">
                            resumely
                        </span>
                    </Link>

                    {/* Desktop Center Navigation */}
                    {isAuthenticated ? (
                        <>
                            {user && <WorkspaceWarmer userId={user._id} />}
                            <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
                                <AnimatedSwitcher
                                    value={pathname.startsWith("/tracker") ? "/tracker" : pathname.startsWith("/resume") ? "/resume" : ""}
                                    layoutId="navbar-tab-indicator"
                                    items={links.map((link) => ({
                                        value: link.href,
                                        label: link.label,
                                        href: link.href,
                                    }))}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-7 lg:gap-9 text-[14px] text-neutral-600 dark:text-neutral-400 font-normal">
                            <Link href="#features" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                                Platform
                            </Link>
                            <Link href="#solutions" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                                Solutions
                            </Link>
                            <Link href="#templates" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                                Templates
                            </Link>
                            <Link href="#pricing" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                                Pricing
                            </Link>
                        </div>
                    )}

                    {/* Right side: auth / actions / mobile menu */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Mobile Controls */}
                        <div className="flex md:hidden items-center gap-2">
                            <ModeToggle />
                            {isAuthenticated && user && (
                                <UserProfilePopover user={user} />
                            )}
                            <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" aria-label="Open navigation menu">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[calc(100vw-2rem)] p-4 mt-2 border-border/50 shadow-2xl rounded-3xl bg-background/95 backdrop-blur-xl" align="end">
                                    <div className="space-y-4">
                                        {isAuthenticated && user ? (
                                            <>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {links.map((link) => {
                                                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                                        const Icon = link.icon;
                                                        return (
                                                            <Link
                                                                key={link.href}
                                                                href={link.href}
                                                                prefetch={true}
                                                                onClick={() => setMobileMenuOpen(false)}
                                                                className={cn(
                                                                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-medium text-sm",
                                                                    isActive
                                                                        ? "text-foreground bg-muted/60 font-semibold"
                                                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                                )}
                                                            >
                                                                <Icon className="size-4 shrink-0" />
                                                                <span>{link.label}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>

                                                <div className="pt-4 border-t border-border/50">
                                                    <div className="flex items-center gap-4 mb-4 px-3">
                                                        <Avatar className="h-10 w-10 rounded-full border border-border">
                                                            <AvatarImage src={user?.picture} />
                                                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                                {user?.name?.charAt(0).toUpperCase() || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold truncate">{user?.name}</div>
                                                            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between p-3.5 mb-3 mx-1 rounded-2xl bg-muted/30 border border-border/50">
                                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Credits</span>
                                                        <span className="text-sm font-semibold">{user?.credits ?? 0}</span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            setBuyCreditsOpen(true);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors font-medium text-sm mb-1 cursor-pointer"
                                                    >
                                                        <CreditCard className="size-4 shrink-0 text-amber-500" />
                                                        <span>Buy Credits</span>
                                                    </button>

                                                    <Button
                                                        variant="ghost"
                                                        className="w-full rounded-2xl gap-2 justify-start h-11 px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            signOut();
                                                        }}
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex flex-col gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                    <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-muted/50">
                                                        Platform
                                                    </Link>
                                                    <Link href="#solutions" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-muted/50">
                                                        Solutions
                                                    </Link>
                                                    <Link href="#templates" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-muted/50">
                                                        Templates
                                                    </Link>
                                                    <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-muted/50">
                                                        Pricing
                                                    </Link>
                                                </div>
                                                <Button
                                                    variant="default"
                                                    className="w-full rounded-full h-11 text-sm font-medium bg-[#1b2820] text-white hover:bg-[#25382d] dark:bg-white dark:text-neutral-900"
                                                    onClick={() => {
                                                        setMobileMenuOpen(false);
                                                        signIn("google");
                                                    }}
                                                >
                                                    <span>Start Free Trial</span>
                                                    <ArrowUpRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Desktop Auth & Dark Pill CTA Button */}
                        <div className="hidden md:flex items-center gap-3">
                            {isLoading ? (
                                <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
                            ) : isAuthenticated && user ? (
                                <UserProfilePopover user={user} />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => signIn("google")}
                                    className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 bg-[#1b2820] hover:bg-[#25382d] text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-medium transition-all shadow-xs hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                >
                                    <span>Book a demo</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <div className="pl-1 flex items-center h-6">
                                <ModeToggle />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <BuyCreditsDialog open={buyCreditsOpen} onOpenChange={setBuyCreditsOpen} />
        </nav>
    );
};

export default Navbar;
