import forge from "node-forge";
import CryptoJS from "crypto-js";
export const generateAssymetricKeyPair = (password:string) => {
  const r = forge.pki;

  const keyPair = r.rsa.generateKeyPair({ bits: 2048 });
  const {publicKey, privateKey} = keyPair;
  const publicKeyPem = r.publicKeyToPem(publicKey);
  const privateKeyPem = r.privateKeyToPem(privateKey)
  const encryptedPrivateKey = CryptoJS.AES.encrypt(privateKeyPem,password).toString();

  return { publicKey: publicKeyPem, encryptedPrivateKey };
};

export const generateSymmetricKey = () => {
  return CryptoJS.lib.WordArray.random(32).toString();
}

export const encryptSymmetricKey = (symmetricKey:string, publicKey:string) => {
  const publicKeyNormalReceiver = forge.pki.publicKeyFromPem(publicKey);
  return publicKeyNormalReceiver.encrypt(symmetricKey, "RSAES-PKCS1-V1_5");
}

