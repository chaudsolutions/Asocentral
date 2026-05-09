import axios from "axios";
import { serVer } from "~/utils/constants";
import { getUserToken } from "./useTools";

type UploadResponse = {
    file: {
        url: string;
        key: string;
        mimetype: string;
        size: number;
        name: string;
    };
};

const dataUrlToFile = (dataUrl: string, fallbackName: string): File => {
    const [header, base64] = dataUrl.split(",");
    const mimeMatch = /data:(.*?);base64/.exec(header);
    const mimeType = mimeMatch?.[1] || "application/octet-stream";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new File([bytes], fallbackName, { type: mimeType });
};

export const uploadFile = async (
    file: File | string,
    options?: { folder?: string; fileName?: string },
): Promise<string> => {
    const normalizedFile =
        typeof file === "string"
            ? dataUrlToFile(file, options?.fileName || "upload-file")
            : file;

    const formData = new FormData();
    formData.append("file", normalizedFile);
    formData.append("folder", options?.folder || "uploads");

    const { token } = getUserToken();
    const response = await axios.post<UploadResponse>(
        `${serVer}/upload/file`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    return response.data.file.url;
};

export const uploadIfNeeded = async (
    value: string | File | null | undefined,
    options?: { folder?: string; fileName?: string },
): Promise<string> => {
    if (!value) return "";
    if (typeof value === "string" && !value.startsWith("data:")) return value;
    return uploadFile(value, options);
};
