"use client"
import { createBlobUrl, revokeBlobUrl } from "@/lib/pdf/create-blob-url";
import { createPdfBlob } from "@/lib/pdf/create-pdf-blob";
import React, { useEffect, useRef, useState } from "react";
import PDFError from "./helper/pdf-error";
import PDFLoading from "./helper/pdf-loading";
import { Document, Page, pdfjs } from "react-pdf";
import { ResumeData, ResumeTemplate } from "@/types/resume";
import { cloneDeep, debounce, isEqual, set } from "lodash";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const PDFViewer = ({ url }: { url: string | null; }) => {
    const [error, setError] = useState<Error | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    // Show empty state if the url is not loaded
    if (!url) {
        return null;
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };



    return (
        <div className="flex h-full w-full items-center justify-center">
            <Document
                file={url}
                loading={null}
                onLoadError={(error) => {
                    console.error("[ERROR]: Error loading PDF:", error);
                    setError(error);
                }}
                onLoadSuccess={(d) => {
                    setError(null);
                    setNumPages(d.numPages);
                }}
                className="nobar dark:bg-background flex flex-col gap-4 h-full max-h-full w-full items-center justify-start py-4 overflow-y-scroll"
            >
                {!error && numPages && Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className={'w-auto bg-white shadow-md'}
                    />
                ))}
                {!error && !numPages && (
                    <Page
                        pageNumber={1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className={'w-auto bg-white shadow-md'}
                    />
                )}
            </Document>
        </div>
    );
};

const ResumePreview = ({ resumeData, theme }: { resumeData: ResumeData, theme: ResumeTemplate }) => {
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
    const [data, setData] = useState<ResumeData>(resumeData);

    // Set data from props on mount and when resumeData changes with debounced effect
    const debouncedSetData = useRef(
        debounce((newData: ResumeData) => {
            setData((prevData) => (isEqual(prevData, newData) ? prevData : cloneDeep(newData)));
        }, 500)
    ).current;

    useEffect(() => {
        debouncedSetData(resumeData);
    }, [resumeData, debouncedSetData]);

    // Effect to generate PDF when data changes
    useEffect(() => {
        setPdfError(null);
        (async () => {
            try {
                const blob = await createPdfBlob({ resumeData: data});
                const newUrl = createBlobUrl({ blob });
                setGeneratedPdfUrl(newUrl);
            } catch (err) {
                setPdfError(String(err instanceof Error ? err.message : "An unknown error occurred while generating the PDF."));
                if (generatedPdfUrl) {
                    revokeBlobUrl({ url: generatedPdfUrl });
                }
            }
        })();

        // Cleanup on component unmount or when data changes again (before new generation)
        return () => {
            if (generatedPdfUrl) {
                revokeBlobUrl({ url: generatedPdfUrl });
            }
        };
        // Dont Include generatedPdfUrl in the dependency array as it will cause infinite re-renders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, theme]);

    // If there is an error loading the PDF, show an error message
    if (pdfError) {
        return (
            <div className="h-full w-full">
                <PDFError message={pdfError} />
            </div>
        );
    }

    return (
        <div className="nobar bg-sidebar rounded-lg h-full w-full overflow-y-auto">
            {!generatedPdfUrl ? (
                <div className="h-full w-full mx-auto">
                    <PDFLoading />
                </div>
            ) : (
                <PDFViewer url={generatedPdfUrl} />
            )}
        </div>
    );
};

export default ResumePreview;