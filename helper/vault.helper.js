import axios from "axios";
import config from "../config/app.config.js";

const VAULT_ADDR = config.vault.address;
const VAULT_TOKEN = config.vault.token;
const VAULT_SECRET_PATH = config.vault.secretPath;

const vault = {
    // Upload function
    upload: async (fileName, fileBuffer) => {
        try {
            const vaultUploadResponse = await axios.post(
                `${VAULT_ADDR}/v1/${VAULT_SECRET_PATH}/data/${fileName}`, // ✅ Correct KV v2 path
                { data: { privateKey: fileBuffer } }, // ✅ Wrap inside "data": {}
                { headers: { "X-Vault-Token": VAULT_TOKEN } }
            );

            return { success: true, message: "File uploaded successfully" };
        } catch (error) {
            return { success: false, error: error.response?.data || error.message };
        }
    },

    // Fetch function
    fetch: async (fileName) => {
        try {
            const vaultFetchResponse = await axios.get(
                `${VAULT_ADDR}/v1/${VAULT_SECRET_PATH}/data/${fileName}`, // ✅ Correct KV v2 path
                { headers: { "X-Vault-Token": VAULT_TOKEN } }
            );

            const privateKey = vaultFetchResponse.data.data.data.privateKey;
            return { success: true, privateKey };
        } catch (error) {
            return { success: false, error: error.response?.data.toString() || error.message.toString() };
        }
    }
};

export default vault;
