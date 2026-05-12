"use client"
import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
const Tabs = () => {
    const [activeTab, setActiveTab] = React.useState('Tab 1');
    const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
    return (
        <CustomTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    )
}


interface CustomTabsProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    className?: string;
}

export const CustomTabs = ({ tabs, activeTab, setActiveTab, className="" }: CustomTabsProps) => {

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <motion.div className={cn("flex w-full gap-2 p-1.5", className)} role="tablist" aria-label="Custom Tabs">
            {tabs.map((tab) => (
                <motion.button
                    key={tab}
                    className="relative px-4 py-2 text-sm font-medium"
                    onClick={() => handleTabChange(tab)}
                >
                    {activeTab === tab && (
                        <motion.span
                            layoutId="active"
                            layout
                            initial={false}
                            className="absolute inset-0 rounded-full bg-black dark:bg-white shadow-[0_0_5px_1.5px_rgba(255,255,255,0.4)_inset,0_0_0px_0.8px_rgba(0,0,0,1),0_0_0_0.5px_rgba(255,255,255,0.3)_inset]"
                            transition={{
                                duration: 0.3,
                                type: "spring",
                                bounce: 0.2,
                            }}
                        />
                    )}
                    <span
                        className={cn(
                            'relative z-10 transition-colors duration-200 capitalize',
                            activeTab === tab ? 'dark:text-black text-white' : 'dark:text-white text-black'
                        )}
                    >
                        {tab}
                    </span>
                </motion.button>
            ))}
        </motion.div>
    )
}


export default Tabs