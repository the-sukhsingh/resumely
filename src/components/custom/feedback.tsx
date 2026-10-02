"use client"
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircleIcon, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useAuth } from '../../context/AuthContext'

const Feedback = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useState<"idle" | "sending" | "success">("idle");
    const [feedback, setFeedback] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const createFeedback = useMutation(api.feedback.createFeedback);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setFeedback("");
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isOpen]);

    const handleSend = async () => {
        if (state === "sending" || !feedback.trim() || !user?._id) return;
        setState("sending");

        try {
            await createFeedback({
                userId: user._id,
                feedback: feedback.trim(),
            });
            setState("success");
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            setState("idle");
            return;
        }

        // close after a short delay once success is shown
        const closeTimer = setTimeout(() => {
            setState("idle");
            setIsOpen(false);
            setFeedback("");
        }, 3000);

        return () => {
            clearTimeout(closeTimer);
        };
    }

    if (!user) return null;

    return (
        <div className='fixed bottom-4 right-4 z-50' ref={containerRef}>
            <button 
                onClick={() => { setIsOpen(!isOpen) }} 
                className='bg-black dark:bg-white text-white dark:text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer border border-transparent dark:border-neutral-800'
            >
                {isOpen ? <X className='size-5' /> : <MessageCircleIcon className='size-5' />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            filter: "blur(4px)",
                        }}
                        animate={{
                            opacity: 1,
                            filter: "blur(0px)",
                        }}
                        exit={{
                            opacity: 0,
                            filter: "blur(4px)",
                        }}
                        transition={{
                            duration: 0.15,
                            ease: "easeInOut"
                        }}
                        className='w-50 h-60 bg-[#dbdbdb] dark:bg-neutral-800 rounded-3xl rounded-b-3xl absolute bottom-full right-0 -translate-y-2 p-1 shadow-[0_1px_1px_1px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_1px_1px_rgba(255,255,255,0.1)] '>
                        <div className='h-4/5 bg-[#f1f1f1] dark:bg-neutral-900 rounded-t-[20px] rounded-b-3xl overflow-hidden flex flex-col'>
                            {state === "success" ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="text-emerald-600 dark:text-emerald-400 mb-2 bg-emerald-100/50 dark:bg-emerald-950/30 p-2 rounded-full"
                                    >
                                        <Check className="size-5" />
                                    </motion.div>
                                    <motion.p
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-xs font-semibold text-neutral-800 dark:text-neutral-100"
                                    >
                                        Thank You!
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 px-2 leading-tight"
                                    >
                                        We appreciate your feedback.
                                    </motion.p>
                                </div>
                            ) : (
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    disabled={state === "sending"}
                                    placeholder="Write your feedback..."
                                    className="w-full h-full bg-transparent resize-none outline-none border-none p-3 text-xs md:text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-0 focus:outline-none"
                                    autoFocus
                                />
                            )}
                        </div>
                        <div className='flex justify-center items-center gap-2 mt-2'>
                            <Button 
                                className='rounded-full px-5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 shadow-sm active:scale-95 transition-all text-xs font-medium cursor-pointer h-7 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 dark:text-neutral-200 dark:border-neutral-700'
                                onClick={() => {
                                    setIsOpen(false);
                                    setFeedback("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className='rounded-full px-5 bg-black hover:bg-neutral-800 text-white shadow-sm active:scale-95 transition-all flex items-center justify-center text-xs font-medium cursor-pointer h-7 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900'
                                onClick={handleSend} 
                                disabled={state === "sending" || !feedback.trim()}
                            >
                                <Text
                                    value={
                                        state === "idle" ? "Send" :
                                            state === "sending" ? "Sending..." :
                                                "Sent!"
                                    }
                                />
                            </Button>
                        </div>

                    </motion.div>
                )}</AnimatePresence>
        </div>
    )
};

const Text = ({ value }: { value: string }) => {
    const tallies = new Map<string, number>();

    const chars = value.split("");

    const letters = chars.map((char) => {
        const bucket = char.toLowerCase();
        const ordinal = (tallies.get(bucket) || 0) + 1;
        tallies.set(bucket, ordinal);
        return { id: `${bucket}-${ordinal}`, glyph: char };
    });

    return (
        <span className="inline-flex overflow-hidden">
            <AnimatePresence mode='popLayout' initial={false}>
                {letters.map((letter) => (
                    <motion.span
                        key={letter.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                            duration: 0.15,
                            ease: "easeInOut"
                        }}
                        className="inline-block whitespace-pre"
                    >
                        {letter.glyph}
                    </motion.span>
                ))}
            </AnimatePresence>
        </span>
    )
}

export default Feedback