# LTI Launch Data Flow

This process starts with an LMS-initiated LTI 1.3 launch using the OIDC data flow. The LTI server then calls the Ilios API with a service token to resolve the user and obtain a short-lived login token, redirects the browser into the Ilios frontend, and exchanges that token for a session token. After login, the browser makes subsequent Ilios API requests using the session token and receives standard JSON:API responses.

```mermaid
sequenceDiagram
    autonumber
    participant LMS as Learning Management System
    participant LTI as LTI Server
    participant I as Ilios Server
    participant B as Browser

    B->>LMS: LTI launch over HTTPS
    LMS->>LTI: Send LTI launch payload

    LTI->>I: GET /api/users?filters[campusId]={campusId}
    Note right of LTI: X-JWT-Authorization: {ServiceToken}
    I-->>LTI: Ilios API User JSON:API Data

    LTI->>I: GET /auth/token/{userId}
    Note right of LTI: X-JWT-Authorization: {ServiceToken}
    I-->>LTI: {shortLivedToken} in response body

    LTI-->>B: 302 redirect to /lti-login/{shortLivedToken}

    B->>I: GET /lti-login/{shortLivedToken}
    I-->>B: 200 OK: HTML (Frontend App)
    B->>I: GET /auth/token
    Note right of I: X-JWT-Authorization: {shortLivedToken}
    I-->>B: {sessionUserToken} in response body

    B->>I: Subsequent Ilios API requests
    Note right of I: X-JWT-Authorization: Token {sessionUserToken}
    I-->>B: JSON responses
```
