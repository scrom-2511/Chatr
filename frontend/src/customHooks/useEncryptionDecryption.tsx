// import CryptoJS from "crypto-js";
// import forge from "node-forge";

// const useEncryptionDecryption = () => {
//   const generateSessionKeyDirect = () => {
//     return CryptoJS.lib.WordArray.random(32).toString();
//   };

//   const encryptionDirect = (
//     publicKeyReceiver: string,
//     publicKeySender: string,
//     text: string
//   ) => {
//     const sessionKey = generateSessionKeyDirect();

//     const publicKeyNormalReceiver =
//       forge.pki.publicKeyFromPem(publicKeyReceiver);
//     const publicKeyNormalSender = forge.pki.publicKeyFromPem(publicKeySender);

//     const encryptedSessionKeyReceiver = forge.util.encode64(
//       publicKeyNormalReceiver.encrypt(sessionKey, "RSAES-PKCS1-V1_5")
//     );

//     const encryptedSessionKeySender = forge.util.encode64(
//       publicKeyNormalSender.encrypt(sessionKey, "RSAES-PKCS1-V1_5")
//     );

//     const encryptedText = CryptoJS.AES.encrypt(text, sessionKey).toString();

//     return {
//       encryptedText,
//       encryptedSessionKeyReceiver,
//       encryptedSessionKeySender,
//     };
//   };

//   const decryptionDirect = (
//     text: string,
//     encryptedSessionKeyReceiver: string,
//     encryptedSessionKeySender: string
//   ) => {
//     const privateKey = localStorage.getItem("privateKeySender");
//     if (!privateKey) {
//       throw new Error("Private key not found in localStorage");
//     }

//     const privateKeyNormal = forge.pki.privateKeyFromPem(privateKey);

//     let decryptedSessionKey = null;

//     try {
//       decryptedSessionKey = privateKeyNormal.decrypt(
//         forge.util.decode64(encryptedSessionKeyReceiver),
//         "RSAES-PKCS1-V1_5"
//       );
//     } catch (error) {
//       try {
//         decryptedSessionKey = privateKeyNormal.decrypt(
//           forge.util.decode64(encryptedSessionKeySender),
//           "RSAES-PKCS1-V1_5"
//         );
//       } catch (error) {
//         console.error("Second decryption failed", error);
//       }
//     }

//     const decryptedText = CryptoJS.AES.decrypt(
//       text,
//       decryptedSessionKey!
//     ).toString(CryptoJS.enc.Utf8);
//     if (decryptedText) {
//       return { decryptedText };
//     }
//   };

//   const decryptEncryptionKeyGroup = (encyptedEncryptionKey:string)=>{
//     const privateKey = localStorage.getItem("privateKeySender");
//     const privateKeyNormal = forge.pki.privateKeyFromPem(privateKey!);
//     const decryptedEncryptionKey = privateKeyNormal.decrypt(encyptedEncryptionKey, "RSAES-PKCS1-V1_5");
//     return {decryptedEncryptionKey};
//   }

//   const encryptionGroup = (encryptedEncryptionKey:string, text:string)=>{
//     const {decryptedEncryptionKey} = decryptEncryptionKeyGroup(encryptedEncryptionKey);
//     const encryptedText = CryptoJS.AES.encrypt(text, decryptedEncryptionKey).toString();
//     return {encryptedText};
//   }

//   const decryptionGroup = (encryptedEncryptionKey:string, encryptedText:string)=>{
//     const {decryptedEncryptionKey} = decryptEncryptionKeyGroup(encryptedEncryptionKey);
//     const decryptedText = CryptoJS.AES.decrypt(encryptedText, decryptedEncryptionKey).toString(CryptoJS.enc.Utf8);
//     return {decryptedText};
//   }

//   return { generateSessionKeyDirect, encryptionDirect, decryptionDirect, encryptionGroup, decryptionGroup };
// };

// export default useEncryptionDecryption;
