import config from "../config/app.config.js";


import CryptoJS from "crypto-js";

const SECRET_KEY = config.encryption.secretKey; // Must be 32 bytes for AES-256
const IV_LENGTH = config.encryption.ivLength; // AES block size for CBC mode

if (!SECRET_KEY || SECRET_KEY.length !== 32) {
    
    throw new Error("SECRET_KEY must be 32 bytes long and set in the environment variables.");
}



const AES = {
    encrypt: (text) =>{
        return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    },
    decrypt: (encryptedText)=>{
        const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
    }
}

export default AES;

