import Session from "supertokens-auth-react/recipe/session";
import EmailPassword from "supertokens-auth-react/lib/build/recipe/emailpassword/recipe";

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: "http://localhost:3001",
        websiteDomain: "http://localhost:3000",
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init(),
        Session.init(),
        // ThirdPartyEmailPassword.init({
        //     // contactMethod: "EMAIL", // This example will work with any contactMethod
        //     signInAndUpFeature: {
        //         providers: [
        //             {
        //                 id: "keycloak",
        //                 name: "Keycloak", // Will display "Continue with X"
        //
        //                 // optional
        //                 // you do not need to add a click handler to this as
        //                 // we add it for you automatically.
        //                 buttonComponent: <div style={{
        //                     cursor: "pointer",
        //                     border: "1",
        //                     paddingTop: "5px",
        //                     paddingBottom: "5px",
        //                     borderRadius: "5px",
        //                     borderStyle: "solid"
        //                 }}>Login with Keycloak</div>
        //             }
        //         ],
        //         // ...
        //     },
        //     // ...
        // }),
    ],
};
