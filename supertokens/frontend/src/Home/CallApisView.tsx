import axios from "axios";
import {useState} from "react";
import {SuperTokensConfig} from '../config';
import ReactJson from 'react-json-view'
import {SessionAuth, useSessionContext} from 'supertokens-auth-react/recipe/session';
import {UserRoleClaim,} from 'supertokens-auth-react/recipe/userroles';

export default function CallApisView() {
    const [sessionInfoState, setSessionInfoState] = useState({});
    const [adminInfoState, setAdminInfoState] = useState("");
    const [userInfoState, setUserInfoState] = useState("");
    const [unsecuredInfoState, setUnsecuredInfoState] = useState("");

    async function callSessionInfo() {
        await axios.get(SuperTokensConfig.appInfo.apiDomain + "/sessioninfo")
            .then(value => {
                setSessionInfoState(value.data);
            })
    }

    async function promoteAs(type: string) {
        await axios.post(SuperTokensConfig.appInfo.apiDomain + "/promote/" + type)
            .then(value => {
                callEndpoints()
            })
    }

    async function unpromoteAs(type: string) {
        await axios.post(SuperTokensConfig.appInfo.apiDomain + "/unpromote/" + type)
            .then(value => {
                callEndpoints()
            })
    }

    async function callAdminEndpoint() {
        await axios.get(SuperTokensConfig.appInfo.apiDomain + "/admin").then(value => {
            setAdminInfoState(JSON.stringify(value.data, null, 2));
        }).catch(reason => setAdminInfoState(reason.message))
        ;
    }

    async function callUserEndpoint() {
        await axios.get(SuperTokensConfig.appInfo.apiDomain + "/user").then(value => {
            setUserInfoState(JSON.stringify(value.data, null, 2));
        }).catch(reason => setUserInfoState(reason.message))
        ;
    }

    async function callUnsecuredEndpoint() {
        await axios.get("http://localhost:3001/unsecured").then(value => {
            setUnsecuredInfoState(JSON.stringify(value.data, null, 2));

        });
    }


    function callEndpoints() {
        callSessionInfo().then(r => r)
        callUnsecuredEndpoint().then(value => value)
        callAdminEndpoint().then(value => value)
        callUserEndpoint().then(value => value)
    }

    return (
        <div>
            <button className={"sessionButton"} onClick={callEndpoints}>Call endpoints</button>
            <button className={"sessionButton"} onClick={() => promoteAs("user")}>Promote as user</button>
            <button className={"sessionButton"} onClick={() => unpromoteAs("user")}>Unpromote as user</button>
            <button className={"sessionButton"} onClick={() => promoteAs("admin")}>Promote as admin</button>
            <button className={"sessionButton"} onClick={() => unpromoteAs("admin")}>Unpromote as admin</button>
            <table>
                <thead>
                <tr>
                    <th>Type</th>
                    <th>Response</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>Unsecured</th>
                    <th>{unsecuredInfoState}</th>
                </tr>
                <tr>
                    <th>Session info</th>
                    <th><ReactJson src={sessionInfoState}/></th>
                </tr>
                <tr>
                    <th>Admin Endpoint</th>
                    <th>{adminInfoState}</th>
                </tr>
                <tr>
                    <th>User Endpoint</th>
                    <th>{userInfoState}</th>
                </tr>
                </tbody>
            </table>
            <SessionAuth
                overrideGlobalClaimValidators={(globalValidators) =>
                    [...globalValidators,
                        UserRoleClaim.validators.includes("admin"),
                        /* PermissionClaim.validators.includes("modify") */
                    ]
                }
            >
                <InvalidClaimHandler>
                    <div>
                        Only visible for users with ADMIN role
                    </div>
                </InvalidClaimHandler>
            </SessionAuth>
            <SessionAuth
                overrideGlobalClaimValidators={(globalValidators) =>
                    [...globalValidators,
                        UserRoleClaim.validators.includes("user"),
                        /* PermissionClaim.validators.includes("modify") */
                    ]
                }
            >
                <InvalidClaimHandler>
                    <div>
                        Only visible for users with USER role
                    </div>
                </InvalidClaimHandler>
            </SessionAuth>

        </div>
    );

    function InvalidClaimHandler(props: React.PropsWithChildren<any>) {
        let sessionContext = useSessionContext();
        if (sessionContext.loading) {
            return null;
        }

        if (sessionContext.invalidClaims.some(i => i.validatorId === UserRoleClaim.id)) {
            return <div>You cannot access this content because you are not granted to.</div>
        }

        // We show the protected route since all claims validators have
        // passed implying that the user is an admin.
        return <div>{props.children}</div>;
    }
}
