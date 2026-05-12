import { revokeBlobUrl } from "./create-blob-url";
interface CreatePdfToImageProps {
    pdfBlob: Blob;
    scale: number;
}

export const createPdfToImage = async ({ pdfBlob, scale = 2 }: CreatePdfToImageProps): Promise<Blob> => {
    const { pdfjs } = await import("react-pdf");
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const pdfUrl = URL.createObjectURL(pdfBlob);
    const loadingTask = pdfjs.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: ctx,
        canvas,
        viewport,
    };

    await page.render(renderContext).promise;

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Failed to convert canvas to blob"));
                return;
            }

            revokeBlobUrl({ url: pdfUrl });
            resolve(blob);
        }, "image/png");
    });
};
