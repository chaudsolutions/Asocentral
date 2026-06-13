import jsPDF from "jspdf";
import type { NewsDataType } from "~/types/news";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_SPACE = 20;

async function loadImageViaElement(
    url: string,
): Promise<{ data: string; format: "JPEG" | "PNG" } | null> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth || 800;
                canvas.height = img.naturalHeight || 600;
                const ctx = canvas.getContext("2d");
                if (!ctx) { resolve(null); return; }
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                resolve({ data: dataUrl, format: "JPEG" });
            } catch {
                // Canvas tainted — CORS headers missing from cached response
                resolve(null);
            }
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

async function fetchImageBase64(
    url: string,
): Promise<{ data: string; format: "JPEG" | "PNG" } | null> {
    // S3 must send Access-Control-Allow-Origin for this origin.
    // Without that bucket CORS rule, browsers cannot legally read image pixels.
    try {
        const res = await fetch(url, {
            mode: "cors",
            cache: "reload",
        });
        if (res.ok) {
            const blob = await res.blob();
            const format: "JPEG" | "PNG" =
                blob.type === "image/png" ? "PNG" : "JPEG";
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () =>
                    resolve({ data: reader.result as string, format });
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        }
    } catch {
        // Direct fetch can fail until the bucket CORS policy is configured.
    }

    // Fallback: Image element -> canvas. This also requires S3 CORS headers.
    return loadImageViaElement(url);
}

export async function generateNewsPdf(
    news: NewsDataType,
    appName: string,
    websiteUrl?: string,
): Promise<void> {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 0;
    let pageNum = 1;

    const addPageFooter = () => {
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        doc.text(
            `${appName.toUpperCase()} | ${websiteUrl || ""}  •  Page ${pageNum}`,
            PAGE_W / 2,
            PAGE_H - 6,
            { align: "center" },
        );
    };

    const ensureSpace = (needed: number) => {
        if (y + needed > PAGE_H - FOOTER_SPACE) {
            addPageFooter();
            doc.addPage();
            pageNum += 1;
            // Slim header band on continuation pages
            doc.setFillColor(0, 51, 102);
            doc.rect(0, 0, PAGE_W, 10, "F");
            doc.setFontSize(8.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text(appName.toUpperCase(), MARGIN, 7);
            y = 18;
        }
    };

    const getContainedImageSize = (
        imageData: string,
        maxWidth: number,
        maxHeight: number,
    ) => {
        const imageProps = doc.getImageProperties(imageData);
        const aspectRatio = imageProps.width / imageProps.height;
        let width = maxWidth;
        let height = width / aspectRatio;

        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }

        return {
            width,
            height,
            x: MARGIN + (maxWidth - width) / 2,
        };
    };

    const addContainedImage = (
        image: { data: string; format: "JPEG" | "PNG" },
        maxHeight: number,
    ) => {
        const size = getContainedImageSize(image.data, CONTENT_W, maxHeight);
        ensureSpace(size.height + 4);
        doc.addImage(
            image.data,
            image.format,
            size.x,
            y,
            size.width,
            size.height,
        );
        y += size.height + 4;
    };

    // ── HEADER BAND ────────────────────────────────────────────────────────
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, PAGE_W, 22, "F");

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(appName.toUpperCase(), MARGIN, 15);

    // Red "NEWS REPORT" badge
    doc.setFillColor(204, 0, 0);
    doc.rect(PAGE_W - 50, 5, 35, 12, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("NEWS REPORT", PAGE_W - 32.5, 12.5, { align: "center" });

    y = 32;

    // ── CATEGORIES ─────────────────────────────────────────────────────────
    if (news.category?.length) {
        let cx = MARGIN;
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        for (const cat of news.category) {
            const tw = doc.getTextWidth(cat.toUpperCase()) + 6;
            doc.setFillColor(0, 51, 102);
            doc.roundedRect(cx, y, tw, 5.5, 1, 1, "F");
            doc.setTextColor(255, 255, 255);
            doc.text(cat.toUpperCase(), cx + 3, y + 3.8);
            cx += tw + 3;
        }
        y += 12;
    }

    // ── TITLE ──────────────────────────────────────────────────────────────
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 26, 26);
    const titleLines = doc.splitTextToSize(news.title, CONTENT_W);
    doc.text(titleLines, MARGIN, y);
    y += (titleLines as string[]).length * 8 + 3;

    // Red short underline accent
    doc.setDrawColor(204, 0, 0);
    doc.setLineWidth(1);
    doc.line(MARGIN, y, MARGIN + 45, y);
    y += 7;

    // ── DESCRIPTION ────────────────────────────────────────────────────────
    if (news.description) {
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(80, 80, 80);
        const descLines = doc.splitTextToSize(news.description, CONTENT_W);
        doc.text(descLines, MARGIN, y);
        y += (descLines as string[]).length * 5.5 + 5;
    }

    // ── META INFO ──────────────────────────────────────────────────────────
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(130, 130, 130);
    if (news.pubDate) {
        const pubDate = new Date(news.pubDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        doc.text(`Published: ${pubDate}`, MARGIN, y);
        y += 5;
    }
    doc.text(`Views: ${news.views ?? 0}  •  Shares: ${news.shares ?? 0}`, MARGIN, y);
    y += 9;

    // Thin divider
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 7;

    // ── COVER IMAGE ────────────────────────────────────────────────────────
    if (news.image_url) {
        const coverImg = await fetchImageBase64(news.image_url);
        if (coverImg) {
            addContainedImage(coverImg, 120);
        }
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += 8;
    }

    // ── CONTENT BLOCKS ─────────────────────────────────────────────────────
    for (const block of news.content ?? []) {
        // Block section title
        if (block.title) {
            ensureSpace(15);
            doc.setFillColor(204, 0, 0);
            doc.rect(MARGIN, y - 4.5, 3, 10, "F");
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 51, 102);
            const btLines = doc.splitTextToSize(block.title, CONTENT_W - 7);
            doc.text(btLines, MARGIN + 6, y);
            y += (btLines as string[]).length * 6 + 5;
        }

        // Block image
        if (block.image_url) {
            const bImg = await fetchImageBase64(block.image_url);
            if (bImg) {
                addContainedImage(bImg, 105);
            }
        }

        // Block body text — preserve paragraphs
        if (block.description) {
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(44, 44, 44);
            const paragraphs = block.description
                .split("\n")
                .map((p) => p.trim())
                .filter(Boolean);
            for (const para of paragraphs) {
                const lines = doc.splitTextToSize(para, CONTENT_W);
                ensureSpace((lines as string[]).length * 5 + 2);
                doc.text(lines, MARGIN, y);
                y += (lines as string[]).length * 5 + 4;
            }
            y += 2;
        }

        // Block separator
        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += 8;
    }

    addPageFooter();

    const safeTitle = news.title
        .substring(0, 50)
        .replace(/[^a-z0-9\s]/gi, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();

    doc.save(`${safeTitle}.pdf`);
}
