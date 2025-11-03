const awsmobile = {
    aws_project_region: "eu-north-1",
    aws_cognito_region: "eu-north-1",
    aws_user_pools_id: "eu-north-1_DhJ3kh2vA",
    aws_user_pools_web_client_id: "4pbavtmi0p46epdpo44lggpr0i",

    // ... other keys if you add API, Storage, etc.
    oauth: {
        domain: "https://eu-north-1dhj3kh2va.auth.eu-north-1.amazoncognito.com",
        scope: ["email", "openid", "phone"],
        oauth2grant_type: 'authorization_code',
        redirectSignIn: "http://localhost:5137/",
        responseType: "code"
    }
};
export default awsmobile;
