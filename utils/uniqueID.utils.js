import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique chain ID using UUID v4.
 * @returns {string} A unique chain ID.
 */
const generateChainId = () => {
    return `chain-${uuidv4()}`; // Prefix to distinguish chain IDs
};

export default generateChainId;
