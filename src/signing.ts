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

function symmetricSignature({ clientSecret, HTTPMethod, RelativeUrl, AccessToken, RequestBody, Timestamp }: { clientSecret: string, HTTPMethod: string, RelativeUrl: string, AccessToken: string, RequestBody: object, Timestamp: string }): string {
    const XRequestBody = Object.keys(RequestBody).length ? hashRequestBody(RequestBody) : '';
    const XRelativeUrl = getRelativeUrl(RelativeUrl);
    const StringToSign = `${HTTPMethod}:${XRelativeUrl}:${AccessToken}:${XRequestBody}:${Timestamp}`;
    return crypto.createHmac('sha512', clientSecret).update(StringToSign).digest('base64');
}

export {
    asymmetricSignature,
    symmetricSignature
};
