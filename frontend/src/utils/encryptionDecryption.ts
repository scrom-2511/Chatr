import axios from "axios";
import CryptoJS from "crypto-js";
import forge from "node-forge";

export const generateSessionKeyDirect = () => {
    return CryptoJS.lib.WordArray.random(32).toString();
};

export const encryptionDirect = (
    publicKeyReceiver: string,
    publicKeySender: string,
    text: string
) => {
    const sessionKey = generateSessionKeyDirect();

    const publicKeyNormalReceiver = forge.pki.publicKeyFromPem(publicKeyReceiver);
    const publicKeyNormalSender = forge.pki.publicKeyFromPem(publicKeySender);

    const encryptedSessionKeyReceiver = forge.util.encode64(
        publicKeyNormalReceiver.encrypt(sessionKey, "RSAES-PKCS1-V1_5")
    );

    const encryptedSessionKeySender = forge.util.encode64(
        publicKeyNormalSender.encrypt(sessionKey, "RSAES-PKCS1-V1_5")
    );

    const encryptedText = CryptoJS.AES.encrypt(text, sessionKey).toString();

    return {
        encryptedText,
        encryptedSessionKeyReceiver,
        encryptedSessionKeySender,
    };
};

export const encryptionDirectImg = (
    publicKeyReceiver: string,
    publicKeySender: string,
    imageBase64: string
)=>{
    const{ encryptedText, encryptedSessionKeyReceiver, encryptedSessionKeySender} =  encryptionDirect(publicKeyReceiver, publicKeySender, imageBase64);
    const file = new File([encryptedText],"encrypted.enc",{type: "application/octet-stream"});
    return {
        file,
        encryptedSessionKeyReceiver,
        encryptedSessionKeySender,
    };
}

export const decryptionDirectImg = async (url:string, encryptedSessionKeyReceiver: string, encryptedSessionKeySender: string)=>{
    console.log("hey")
    const res = await axios.get(url);
    const urlAsText = res.data;
    const {decryptedText} = decryptionDirect(urlAsText,encryptedSessionKeyReceiver, encryptedSessionKeySender) || {};
    console.log(decryptedText);
    return {decryptedText}

}

export const decryptionDirect = (
    text: string,
    encryptedSessionKeyReceiver: string,
    encryptedSessionKeySender: string
) => {
    const privateKey = localStorage.getItem("privateKeySender");
    if (!privateKey) {
        throw new Error("Private key not found in localStorage");
    }

    const privateKeyNormal = forge.pki.privateKeyFromPem(privateKey);

    let decryptedSessionKey = null;

    try {
        decryptedSessionKey = privateKeyNormal.decrypt( forge.util.decode64(encryptedSessionKeyReceiver),"RSAES-PKCS1-V1_5");
    } catch (error) {
        try { decryptedSessionKey = privateKeyNormal.decrypt(forge.util.decode64(encryptedSessionKeySender), "RSAES-PKCS1-V1_5");
        } catch (error) {
            console.error("Second decryption failed", error);
        }
    }

    const decryptedText = CryptoJS.AES.decrypt(text, decryptedSessionKey!).toString(CryptoJS.enc.Utf8);
    if (decryptedText) {
        return { decryptedText };
    }
};

export const decryptEncryptionKeyGroup = (encryptedEncryptionKey: string) => {
    const privateKey = localStorage.getItem("privateKeySender");
    if (!privateKey) {
        throw new Error("Private key not found in localStorage");
    }
    const privateKeyNormal = forge.pki.privateKeyFromPem(privateKey);
    const decryptedEncryptionKey = privateKeyNormal.decrypt(encryptedEncryptionKey, "RSAES-PKCS1-V1_5");
    return { decryptedEncryptionKey };
}

export const encryptionGroup = (decryptedEncryptionKey: string, text: string) => {
    const encryptedText = CryptoJS.AES.encrypt(text, decryptedEncryptionKey).toString();
    return { encryptedText };
}

export const decryptionGroup = (decryptedEncryptionKey: string, encryptedText: string) => {
    const decryptedText = CryptoJS.AES.decrypt(encryptedText, decryptedEncryptionKey).toString(CryptoJS.enc.Utf8);
    return { decryptedText };
}
