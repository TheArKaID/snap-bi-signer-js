import { hashRequestBody, getRelativeUrl } from './support';
import crypto from 'crypto';

function verifyAsymmetricSignature({clientID, publicKey, signature, timestamp}:{clientID: string, publicKey: string, signature: string, timestamp: string}): boolean {
    return crypto.createVerify('RSA-SHA256')
    .update(`${clientID}|${timestamp}`)
    .verify(publicKey, signature, 'base64');
}

function verifySymmetricSignature({clientSecret, httpMethod, relativeUrl, accessToken, requestBody, timestamp, signature}:{clientSecret: string, httpMethod: string, relativeUrl: string, accessToken: string, requestBody: object, timestamp: string, signature: string}): boolean {
    const XRequestBody = Object.keys(requestBody).length ? hashRequestBody(requestBody) : '';
    const XRelativeUrl = getRelativeUrl(relativeUrl);
    const XStringToSign = `${httpMethod}:${XRelativeUrl}:${accessToken}:${XRequestBody}:${timestamp}`;
    const XSignature = crypto.createHmac('sha512', clientSecret).update(XStringToSign).digest('base64');

    return XSignature === signature;
}

export {
    verifyAsymmetricSignature,
    verifySymmetricSignature
};