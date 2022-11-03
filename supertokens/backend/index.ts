import express from "express";
import cors from "cors";
import supertokens from "supertokens-node";
import {verifySession} from "supertokens-node/recipe/session/framework/express";
import {middleware, errorHandler, SessionRequest} from "supertokens-node/framework/express";
import {SuperTokensConfig} from "./config";
import UserRoles from "supertokens-node/recipe/userroles";
import {constants} from "http2";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";

supertokens.init(SuperTokensConfig);

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        methods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true,
    })
);

// This exposes all the APIs from SuperTokens to the client.
app.use(middleware());

// An example API that requires session verification
app.get("/sessioninfo", verifySession(), async (req: SessionRequest, res) => {
    let session = req.session;
    res.send({
        sessionHandle: session!.getHandle(),
        userId: session!.getUserId(),
        accessTokenPayload: session!.getAccessTokenPayload(),
        userData: await ThirdPartyEmailPassword.getUserById(session!.getUserId())
    });
});

app.get("/unsecured", (req, res) => {
    res.send('This is an unsecured endpoint payload');
});

app.get("/user",
    verifySession({
        overrideGlobalClaimValidators: async (globalValidators) => [
            ...globalValidators,
            UserRoles.UserRoleClaim.validators.includes("user"),
        ],
    }), async (req: SessionRequest, res) => {
        let session = req.session;
        res.send(`This is an USER endpoint payload. User connected is ${session!.getUserId()}`);

    }
);

app.get("/admin",
    verifySession({
        overrideGlobalClaimValidators: async (globalValidators) => [
            ...globalValidators,
            UserRoles.UserRoleClaim.validators.includes("admin"),
            // UserRoles.PermissionClaim.validators.includes("edit")
        ],
    }), async (req: SessionRequest, res) => {
        let session = req.session;
        res.send(`This is an ADMIN endpoint payload. User connected is ${session!.getUserId()}`);

    }
);
// In case of session related errors, this error handler
// returns 401 to the client.
app.use(errorHandler());

app.listen(3001, () => console.log(`API Server listening on port 3001`));


app.post("/promote/:type", verifySession(), async (req: SessionRequest, res) => {
    const roleType = req!.params!.type;
    createRole(roleType).then(value => {
        let session = req.session;

        UserRoles.addRoleToUser(session!.getUserId(), roleType).then(response => {
            if (response.status === "UNKNOWN_ROLE_ERROR") {
                // No such role exists
                res.status(constants.HTTP_STATUS_NOT_FOUND)
            }

            // if (response.didUserAlreadyHaveRole === true) {
            //     // The user already had the role
            //     res.status(constants.HTTP_STATUS_NOT_MODIFIED)
            // }

            res.status(constants.HTTP_STATUS_OK)

            session!.fetchAndSetClaim(UserRoles.UserRoleClaim)
                .then(response => session!.fetchAndSetClaim(UserRoles.PermissionClaim))
                .then(response => res.send())
        });


    })
});

app.post("/unpromote/:type", verifySession(), async (req: SessionRequest, res) => {
    const roleType = req!.params!.type;
    let session = req.session;

    UserRoles.removeUserRole(session!.getUserId(), roleType).then(response => {
        if (response.status === "UNKNOWN_ROLE_ERROR") {
            // No such role exists
            res.status(constants.HTTP_STATUS_NOT_FOUND)
        }
        // if (response.didUserHaveRole === false) {
        //     // The user was never assigned the role
        // } else {
        //     // We also want to update the session of this user to reflect this change.
        //     await session.fetchAndSetClaim(UserRoles.UserRoleClaim);
        //     await session.fetchAndSetClaim(UserRoles.PermissionClaim);
        // }

        session!.fetchAndSetClaim(UserRoles.UserRoleClaim)
            .then(response => session!.fetchAndSetClaim(UserRoles.PermissionClaim))
            .then(response => res.send())
        ;
    })

});


async function createRole(roleType: string) {
    /**
     * You can choose to give multiple or no permissions when creating a role
     * createNewRoleOrAddPermissions("user", []) - No permissions
     * createNewRoleOrAddPermissions("user", ["read", "write"]) - Multiple permissions
     */
    return await UserRoles.createNewRoleOrAddPermissions(roleType, ["read"]);

}
