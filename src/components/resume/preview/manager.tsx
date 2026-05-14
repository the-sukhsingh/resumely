"use client"
import React from 'react'
import { Button } from '../../ui/button';
import { ChevronDownIcon } from 'lucide-react';
import {
    ButtonGroup,
} from "@/components/ui/button-group"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface ManagerProps {
    onDownloadImage: () => void;
    onDownloadPdf: () => void;
    isDownloading: boolean;
    handleViewPdf: () => void
}

const Manager: React.FC<ManagerProps> = ({ onDownloadImage, onDownloadPdf, isDownloading, handleViewPdf }) => {
    return (
        < div className='bg-background flex items-center justify-between py-2' >
            <div className='flex gap-4 items-center '>
                <ButtonGroup className='bg-linear-to-b border-0 from-[#ffffff] to-[#f3f3f3] dark:from-[#202020] dark:to-[#191919]  dark:shadow-[0_0.5px_0px_#ffffff1a_inset,0_1px_0.5px_#ffffff25_inset,0_10px_10px_-9px_#00000070,0_20px_20px_-14px_#00000060,0_0px_6px_0px_#00000060] focus-visible:ring-1 ring-[#f3f3f3] dark:ring-[#202020] shadow-[0_0.8px_0px_#0000001a_inset,0_1px_0.5px_#ffffff25_inset] rounded-md last:rounded-r-[10px]!'>
                    <Button variant="ghost" className='focus-visible:ring-1 rounded-l-md! rounded-r-none!' onClick={onDownloadPdf}> <svg viewBox="0 0 24 24" fill="#000000"><g> <g stroke="none" fill="none" strokeWidth="1" fillRule="evenodd"> <g id="Download-3"> <rect id="Rectangle" x="0" y="0" width="24" height="24" fillRule="nonzero"> </rect> <line x1="12" y1="5" x2="12" y2="15" id="Path" className='stroke-[#1a1a1a] dark:stroke-[#f7f7f7]' strokeWidth="2" strokeLinecap="round"> </line> <path d="M17,11 L12.7071,15.2929 C12.3166,15.6834 11.6834,15.6834 11.2929,15.2929 L7,11" id="Path" className='stroke-[#1a1a1a] dark:stroke-[#f7f7f7]' strokeWidth="2" strokeLinecap="round"> </path> <line x1="19" y1="20" x2="5" y2="20" id="Path" className='stroke-[#b8b8b8] dark:stroke-[#525252]' strokeWidth="2" strokeLinecap="round"> </line> </g> </g> </g></svg> Download</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className='focus-visible:ring-1 ' size={"icon"}>
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-linear-to-b border-0 from-[#ffffff] to-[#f3f3f3] dark:from-[#202020] dark:to-[#191919]  dark:shadow-[0_0.5px_0px_#ffffff1a_inset,0_1px_0.5px_#ffffff25_inset,0_10px_10px_-9px_#00000070,0_20px_20px_-14px_#00000060,0_0px_6px_0px_#00000060] focus-visible:ring-1 ring-[#f3f3f3] dark:ring-[#202020] shadow-[0_0.8px_0px_#0000001a_inset,0_1px_0.5px_#ffffff25_inset] ring-0 w-fit">

                            <DropdownMenuGroup className='w-fit' >
                                <DropdownMenuItem onSelect={handleViewPdf} >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2 text-foreground" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"/><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/><g id="SVGRepo_iconCarrier"> <g opacity="0.5"> <path d="M14 2.75C15.9068 2.75 17.2615 2.75159 18.2892 2.88976C19.2952 3.02503 19.8749 3.27869 20.2981 3.7019C20.7852 4.18904 20.9973 4.56666 21.1147 5.23984C21.2471 5.9986 21.25 7.08092 21.25 9C21.25 9.41422 21.5858 9.75 22 9.75C22.4142 9.75 22.75 9.41422 22.75 9L22.75 8.90369C22.7501 7.1045 22.7501 5.88571 22.5924 4.98199C22.417 3.97665 22.0432 3.32568 21.3588 2.64124C20.6104 1.89288 19.6615 1.56076 18.489 1.40314C17.3498 1.24997 15.8942 1.24998 14.0564 1.25H14C13.5858 1.25 13.25 1.58579 13.25 2C13.25 2.41421 13.5858 2.75 14 2.75Z" fill="currentColor"/> <path d="M2.00001 14.25C2.41422 14.25 2.75001 14.5858 2.75001 15C2.75001 16.9191 2.75289 18.0014 2.88529 18.7602C3.00275 19.4333 3.21477 19.811 3.70191 20.2981C4.12512 20.7213 4.70476 20.975 5.71085 21.1102C6.73852 21.2484 8.09318 21.25 10 21.25C10.4142 21.25 10.75 21.5858 10.75 22C10.75 22.4142 10.4142 22.75 10 22.75H9.94359C8.10583 22.75 6.6502 22.75 5.51098 22.5969C4.33856 22.4392 3.38961 22.1071 2.64125 21.3588C1.95681 20.6743 1.58304 20.0233 1.40762 19.018C1.24992 18.1143 1.24995 16.8955 1.25 15.0964L1.25001 15C1.25001 14.5858 1.58579 14.25 2.00001 14.25Z" fill="currentColor"/> <path d="M22 14.25C22.4142 14.25 22.75 14.5858 22.75 15L22.75 15.0963C22.7501 16.8955 22.7501 18.1143 22.5924 19.018C22.417 20.0233 22.0432 20.6743 21.3588 21.3588C20.6104 22.1071 19.6615 22.4392 18.489 22.5969C17.3498 22.75 15.8942 22.75 14.0564 22.75H14C13.5858 22.75 13.25 22.4142 13.25 22C13.25 21.5858 13.5858 21.25 14 21.25C15.9068 21.25 17.2615 21.2484 18.2892 21.1102C19.2952 20.975 19.8749 20.7213 20.2981 20.2981C20.7852 19.811 20.9973 19.4333 21.1147 18.7602C21.2471 18.0014 21.25 16.9191 21.25 15C21.25 14.5858 21.5858 14.25 22 14.25Z" fill="currentColor"/> <path d="M9.94359 1.25H10C10.4142 1.25 10.75 1.58579 10.75 2C10.75 2.41421 10.4142 2.75 10 2.75C8.09319 2.75 6.73852 2.75159 5.71085 2.88976C4.70476 3.02503 4.12512 3.27869 3.70191 3.7019C3.21477 4.18904 3.00275 4.56666 2.88529 5.23984C2.75289 5.9986 2.75001 7.08092 2.75001 9C2.75001 9.41422 2.41422 9.75 2.00001 9.75C1.58579 9.75 1.25001 9.41422 1.25001 9L1.25 8.90369C1.24995 7.10453 1.24992 5.8857 1.40762 4.98199C1.58304 3.97665 1.95681 3.32568 2.64125 2.64124C3.38961 1.89288 4.33856 1.56076 5.51098 1.40314C6.65019 1.24997 8.10584 1.24998 9.94359 1.25Z" fill="currentColor"/> </g> <path d="M12 10.75C11.3096 10.75 10.75 11.3096 10.75 12C10.75 12.6904 11.3096 13.25 12 13.25C12.6904 13.25 13.25 12.6904 13.25 12C13.25 11.3096 12.6904 10.75 12 10.75Z" fill="currentColor"/> <path d="M5.89243 14.0598C5.29747 13.3697 5 13.0246 5 12C5 10.9754 5.29748 10.6303 5.89242 9.94021C7.08037 8.56222 9.07268 7 12 7C14.9273 7 16.9196 8.56222 18.1076 9.94021C18.7025 10.6303 19 10.9754 19 12C19 13.0246 18.7025 13.3697 18.1076 14.0598C16.9196 15.4378 14.9273 17 12 17C9.07268 17 7.08038 15.4378 5.89243 14.0598ZM9.25 12C9.25 10.4812 10.4812 9.25 12 9.25C13.5188 9.25 14.75 10.4812 14.75 12C14.75 13.5188 13.5188 14.75 12 14.75C10.4812 14.75 9.25 13.5188 9.25 12Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/> </g></svg>
                                    View Pdf
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={onDownloadImage} disabled={isDownloading} className='whitespace-nowrap'>
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"/><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/><g id="SVGRepo_iconCarrier"> <path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z" className="fill-[#b8b8b8] dark:fill-[#323232] opacity-70"/> <path d="M4.02693 18.329C4.18385 19.277 5.0075 20 6 20H18C19.1046 20 20 19.1046 20 18V14.1901M4.02693 18.329C4.00922 18.222 4 18.1121 4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V14.1901M4.02693 18.329L7.84762 14.5083C8.52765 13.9133 9.52219 13.8481 10.274 14.3494L10.7832 14.6888C11.5078 15.1719 12.4619 15.1305 13.142 14.5864L15.7901 12.4679C16.4651 11.9279 17.4053 11.8855 18.1228 12.3484C18.2023 12.3997 18.2731 12.4632 18.34 12.5301L20 14.1901M11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9Z" className="stroke-[#1a1a1a] dark:stroke-[#f7f7f7]" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </g></svg>
                                    {isDownloading ? 'Downloading...' : 'Download Image'}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
            </div>
        </div >
    )
}

export default Manager