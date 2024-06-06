import { getISOTimestamp } from './timestamp';
import { hashRequestBody, getRelativeUrl } from './support';
import crypto from 'crypto';

function asymmetricSignature({ clientID, privateKey, timestamp, withMillisecond }: { clientID: string, privateKey: string, timestamp?: string, withMillisecond?: boolean }): { signature: string, timestamp: string } {
    const usedTimestamp = timestamp ?? getISOTimestamp({ withMillisecond });

    const signature = crypto.createSign('RSA-SHA256')
        .update(`${clientID}|${usedTimestamp}`)
        .sign(privateKey, 'base64');

    return {
        signature,
        timestamp: usedTimestamp
    };
}

function symmetricSignature({ clientSecret, httpMethod, relativeUrl, accessToken, requestBody, timestamp, withMillisecond }: { clientSecret: string, httpMethod: string, relativeUrl: string, accessToken: string, requestBody: object, timestamp?: string, withMillisecond?: boolean }): { signature: string, timestamp: string } {
    const usedTimestamp = timestamp ?? getISOTimestamp({ withMillisecond });

    const xRequestBody = Object.keys(requestBody).length ? hashRequestBody(requestBody) : '';
    const xRelativeUrl = getRelativeUrl(relativeUrl);
    const stringToSign = `${httpMethod}:${xRelativeUrl}:${accessToken}:${xRequestBody}:${usedTimestamp}`;

    const signature = crypto.createHmac('sha512', clientSecret).update(stringToSign).digest('base64');

    return {
        signature,
        timestamp: usedTimestamp
    };
}

export {
    asymmetricSignature,
    symmetricSignature
};
