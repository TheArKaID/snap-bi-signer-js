import { getISOWithoutMilliseconds } from './timestamp';
import { hashRequestBody, getRelativeUrl } from './support';
import crypto from 'crypto';

function asymmetricSignature(clientID: string, privateKey: string): { signature: string, timestamp: string } {
    const timestamp = getISOWithoutMilliseconds(new Date());

    const signature = crypto.createSign('RSA-SHA256')
        .update(`${clientID}|${timestamp}`)
        .sign(privateKey, 'base64');

    return {
        signature,
        timestamp
    };
}

function symmetricSignature({ clientSecret, httpMethod, relativeUrl, accessToken, requestBody, timestamp }: { clientSecret: string, httpMethod: string, relativeUrl: string, accessToken: string, requestBody: object, timestamp: string }): string {
    const xRequestBody = Object.keys(requestBody).length ? hashRequestBody(requestBody) : '';
    const xRelativeUrl = getRelativeUrl(relativeUrl);
    const stringToSign = `${httpMethod}:${xRelativeUrl}:${accessToken}:${xRequestBody}:${timestamp}`;
    return crypto.createHmac('sha512', clientSecret).update(stringToSign).digest('base64');
}

export {
    asymmetricSignature,
    symmetricSignature
};
