# snap-bi-signer
Reducing the complexity when testing on local development, and Client Simulator on ASPI Devsite for SNAP Bank Indonesia OpenAPI.

This is an example of how to create and validate a signature for a Snap Bank Indonesia OpenAPI. 

This process follows the standards set out in the [Standar Teknis dan Keamanan](https://apidevportal.aspi-indonesia.or.id/docs/standar-teknis-keamanan) version 1.0.1 November 2021.

## How to use
Why I wrote this? Because I found the documentation to be a bit confusing and I wanted to make sure I understood it correctly. I hope this helps you too.
### You access PJP API
When you as a Partner/Mitra accessing PJP API, you need to sign the request with your Private Key, and the signature is then validated by PJP using your public key (Asymmetric).

```typescript
import { asymmetricSignature, symmetricSignature } from "./signing";

const privateKey = '' // Your private key used to sign the request
const clientID = '' // Your client ID/Key
const clientSecret = '' // Your client secret
const httpMethod = '' // HTTP method used
const relativeUrl = '' // Relative URL of the request (ex: /v1.0/transfer-va/inquiry)
const accessToken = '' // Access token from access-token (ex: /v1.0/access-token/b2b)
const requestBody = {} // Request body from the request.body (object)
const timestamp = '' // Your own timestamp (optional). We'll generate one for you if no.
const withMillisecond = false // Default false (not used if you bring your own timestamp). As per ISO 8601 and [https://262.ecma-international.org/6.0/#sec-date-time-string-format)(ECMA Spec), the timestamp format includes milliseconds. But ASPI Devsite implementation does not include milliseconds in the timestamp (in contrast to Technical Documents). Set this to true if you want to include milliseconds in the timestamp.

const asymmetricData = asymmetricSignature({clientID, privateKey, timestamp, withMillisecond})

const symmetricData = symmetricSignature({clientSecret, httpMethod, relativeUrl, accessToken, requestBody, timestamp, withMillisecond})
```
`asymmetricSignature` will get you two things, the final result of signature,and the timestamp used. You can use this timestamp to validate the signature.
While `symmetricSignature` will only get you the final result of signature.

### PJP API access your API
When PJP API accessing your API (like Transfer VA Inquiry or Payment Flagging), you need to validate their signature. The signature is created by PJP API using their private key and you need to validate it using their public key.

```typescript
import { verifyAsymmetricSignature, verifySymmetricSignature } from './verify';

const clientSecret = '' // Your client secret
const publicKey = '' // Paired public key from the sender
const clientID = '' // Your client ID/Key
const signature = '' // Signature from the sender
const httpMethod = '' // HTTP method used
const relativeUrl = '' // Relative URL of the request (ex: /v1.0/transfer-va/inquiry)
const accessToken = '' // Access token from access-token (ex: /v1.0/access-token/b2b)
const requestBody = {} // Request body from the request.body (object)
const timestamp = '' // Timestamp received from the request 

const asymmetricStatus = verifyAsymmetricSignature({clientID, publicKey, signature, timestamp})
const symmetricStatus = verifySymmetricSignature({clientSecret, httpMethod, relativeUrl, accessToken, requestBody, timestamp, signature})
```
`verifyAsymmetricSignature` will return a boolean value, `true` if the signature is valid, `false` otherwise. As well as `verifySymmetricSignature`.

This project is written in TypeScript, but you can use it in JavaScript as well. Just make sure you have the necessary dependencies installed.
