module.exports.jwtConfig = {
    secret: "secretsecret",
    tokenExpirationTime: 60*20, //seconds
    audience: "yourwebsite.com",
    issuer: "yourcompany@somewhere.com"
};