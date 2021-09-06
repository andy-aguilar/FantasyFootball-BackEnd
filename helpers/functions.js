require('dotenv').config()
const crypto = require ("crypto");

const helperFunctions = {
    range: (size, startAt=0) => {
        return [...Array(size).keys()].map(i => i+startAt)
    },
    encrypt: (message) => {
        const algorithm = process.env.CRYPTO_ALGO

        const initVector = Buffer.from(process.env.INIT_VECTOR, "hex")
        const securityKey = Buffer.from(process.env.SECURITY_KEY, "hex")

        const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);

        let encryptedData = cipher.update(message, "utf-8", "hex");

        encryptedData += cipher.final("hex");
        return encryptedData
    },
    decrypt: (data) => {
        const algorithm = process.env.CRYPTO_ALGO

        const initVector = Buffer.from(process.env.INIT_VECTOR, "hex")
        const securityKey = Buffer.from(process.env.SECURITY_KEY, "hex")
        
        const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);
        let decryptedData = decipher.update(data, "hex", "utf-8");
    
        decryptedData += decipher.final("utf8");
        return decryptedData
    }
}

module.exports = helperFunctions