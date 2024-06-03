import crypto from 'crypto';
import url from 'url';
import type { ParsedUrlQuery } from 'querystring';

function hashRequestBody(requestBodys: object): string {
    const MinifyJson = JSON.stringify(requestBodys);
    const SHA256 = crypto.createHash('sha256').update(MinifyJson).digest('hex');
    const XRequestBody = SHA256.toLowerCase();

    return XRequestBody;
}

function getRelativeUrl(fullUrl: string) {
    const parsedUrl = url.parse(fullUrl, true);
    let relativeUrl = parsedUrl.pathname;

    if (Object.keys(parsedUrl.query).length) {
        relativeUrl += '?' + getSortedQueryString(parsedUrl.query);
    }

    return relativeUrl;
}

function getSortedQueryString(query: ParsedUrlQuery): string{
    const params = [];
    for (const key in query) {
        const oneQuery = query[key]
        if (Array.isArray(oneQuery)) {
            oneQuery.sort().forEach((val: any) => {
                return params.push([key, val]);
            });
        } else {
            params.push([key, oneQuery]);
        }
    }
    params.sort((a, b) => {
        if (a[0] && b[0]) {
            const a0 = a[0];
            const b0 = b[0];

            return a0.localeCompare(b0) || (a[1] && b[1] ? a[1].localeCompare(b[1]) : 0);
        }
        return 0;
    });

    return params.map(param => param.map(encodeUriComponentCustom).join('=')).join('&');
}

function encodeUriComponentCustom(str:string|undefined, index: number, array: (string | undefined)[]): string {
    if (str) {
        const unreserved = /[A-Za-z0-9\-._~]/;
        return Array.from(str)
        .map((c) => {return unreserved.test(c) ? c : encodeURIComponent(c);})
        .join('');
    }
    return '';
}

export {
    hashRequestBody,
    getRelativeUrl
};