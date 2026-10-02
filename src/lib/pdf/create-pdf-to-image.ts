import { revokeBlobUrl } from "./create-blob-url";

export interface CreatePdfToImageProps {
    pdfBlob: Blob;
    scale?: number;
}

/**
 * Converts all pages of a PDF blob into individual image blobs (one per page).
 */
export const createPdfToImages = async ({ pdfBlob, scale = 2 }: CreatePdfToImageProps): Promise<Blob[]> => {
    const { pdfjs } = await import("react-pdf");
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const pdfUrl = URL.createObjectURL(pdfBlob);
    try {
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        const imageBlobs: Blob[] = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error(`Failed to get canvas context for page ${pageNum}`);
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: ctx,
                canvas,
                viewport,
            };

            await page.render(renderContext).promise;

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((b) => {
                    if (!b) {
                        reject(new Error(`Failed to convert canvas to blob for page ${pageNum}`));
                        return;
                    }
                    resolve(b);
                }, "image/png");
            });

            imageBlobs.push(blob);
        }

        return imageBlobs;
    } finally {
        revokeBlobUrl({ url: pdfUrl });
    }
};

/**
 * Converts the first page of a PDF blob into an image blob.
 */
export const createPdfToImage = async ({ pdfBlob, scale = 2 }: CreatePdfToImageProps): Promise<Blob> => {
    const images = await createPdfToImages({ pdfBlob, scale });
    return images[0];
};
