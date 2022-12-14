import Session from "supertokens-node/recipe/session";
import {TypeInput} from "supertokens-node/types";
import UserRoles from "supertokens-node/recipe/userroles";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import Dashboard from "supertokens-node/recipe/dashboard";

import jwt_decode from "jwt-decode";

export const SuperTokensConfig: TypeInput = {
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "http://localhost:3567/"
    },
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: "http://localhost:3001",
        websiteDomain: "http://localhost:3000",
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        // EmailPassword.init(),
        Session.init(),
        UserRoles.init(),
        Dashboard.init({
            apiKey: "test"
        }),
        ThirdPartyEmailPassword.init({
            // contactMethod: "EMAIL", // This example will work with any contactMethod
            // flowType: "USER_INPUT_CODE_AND_MAGIC_LINK", // This example will work with any flowType
            providers: [
                {
                    id: "keycloak",
                    get: (redirectURI, authCodeFromRequest) => {
                        return {
                            accessTokenAPI: {
                                // this contains info about the token endpoint which exchanges the auth code with the access token and profile info.
                                url: "http://localhost:8580/auth/realms/supertoken/protocol/openid-connect/token",
                                params: {
                                    // example post params
                                    client_id: "supertoken",
                                    client_secret: "fSiw9XekCzaSx6XXbOP2mtrFAjoww64v",
                                    grant_type: "authorization_code",
                                    redirect_uri: redirectURI || "",
                                    code: authCodeFromRequest || "",
                                    //...
                                }
                            },
                            authorisationRedirect: {
                                // this contains info about forming the authorisation redirect URL without the state params and without the redirect_uri param
                                url: "http://localhost:8580/auth/realms/supertoken/protocol/openid-connect/auth",
                                params: {
                                    client_id: "supertoken",
                                    scope: "openid profile",
                                    response_type: "code",
                                    //...
                                }
                            },
                            getClientId: () => {
                                return "supertoken";
                            },
                            getProfileInfo: async (accessTokenAPIResponse) => {
                                const newVar: any = jwt_decode(accessTokenAPIResponse.access_token);
                                // @ts-ignore
                                return {
                                    // id: newVar!.sub,
                                    id: newVar!.email,
                                    email : { // optional
                                        id: newVar!.email, // emailID
                                        isVerified: newVar!.email_verified // true if the email is verified already
                                    }
                                };
                            }
                        }
                    }
                }
            ],
        })
    ]
}
