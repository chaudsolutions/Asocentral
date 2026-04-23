import axios from "axios";

const url = `https://files.adccloudbook.com/`;

export const uploadImage = async (file: Base64URLString) => {
    try {
        const payload = {
            file,
            folder: "images",
        };

        const response = await axios.post(url, payload);
        return response.data.url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
