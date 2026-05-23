"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, ShieldAlert, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function AdminPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const feedbacks = useQuery(api.feedback.getAllFeedbacks, {});

    const isLoading = authLoading || feedbacks === undefined;

    // Loading State
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] gap-4">
                <Loader2 className="size-8 animate-spin text-zinc-500" />
                <p className="text-sm font-medium text-zinc-500">Loading admin dashboard...</p>
            </div>
        );
    }

    // Auth Guard - only allow authenticated users to view
    if (!isAuthenticated || !user) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-full mb-4">
                    <ShieldAlert className="size-10" />
                </div>
                <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Access Denied</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
                    Please sign in with your administrator account to access the feedback dashboard.
                </p>
                <Link href="/">
                    <Button variant="outline" className="rounded-full gap-2">
                        <ArrowLeft className="size-4" /> Go Back Home
                    </Button>
                </Link>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring" as const, stiffness: 260, damping: 25 } }
    };

    return (
        <main id="main-content" className="flex-1 w-full max-w-5xl mx-auto px-6 pt-24 pb-16">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans">
                            Admin Feedback Feed
                        </h1>
                        <Badge variant="secondary" className="rounded-full px-3 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-none font-semibold text-xs h-5">
                            {feedbacks?.length ?? 0} {feedbacks?.length === 1 ? 'submission' : 'submissions'}
                        </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                        Review and analyze general feedback submitted by users to improve Resumely.
                    </p>
                </div>
                <Link href="/">
                    <Button variant="ghost" className="rounded-full gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer">
                        <ArrowLeft className="size-4" /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {/* Content section */}
            {feedbacks && feedbacks.length > 0 ? (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {feedbacks.map((item) => (
                        <motion.div key={item._id} variants={itemVariants} className="h-full">
                            <Card className="h-full flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:border-zinc-700/60 transition-all duration-300 overflow-hidden">
                                <CardContent className="p-5 flex flex-col flex-1 justify-between gap-5 h-full">
                                    {/* Feedback Message Block */}
                                    <div className="flex-1 flex flex-col gap-3">
                                        <div className="text-zinc-400 dark:text-zinc-600">
                                            <MessageSquare className="size-5" />
                                        </div>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal italic break-words">
                                            "{item.feedback}"
                                        </p>
                                    </div>

                                    {/* User metadata & Time stamp */}
                                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-auto flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-zinc-100 dark:border-zinc-800 rounded-full shadow-sm">
                                                <AvatarImage src={item.user?.picture || undefined} alt={item.user?.name || "User Avatar"} />
                                                <AvatarFallback className="bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs">
                                                    {item.user?.name?.charAt(0).toUpperCase() || item.user?.email?.charAt(0).toUpperCase() || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                                                    {item.user?.name || "Anonymous User"}
                                                </p>
                                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                                                    {item.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                                            <Calendar className="size-3.5" />
                                            <span>
                                                {new Date(item.time).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/10">
                    <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 p-4 rounded-full mb-4">
                        <MessageSquare className="size-8" />
                    </div>
                    <h3 className="text-md font-semibold text-zinc-800 dark:text-zinc-200 mb-1">No Feedback Yet</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                        When users submit feedback through the widget, they will display here in real-time.
                    </p>
                </div>
            )}
        </main>
    );
}
