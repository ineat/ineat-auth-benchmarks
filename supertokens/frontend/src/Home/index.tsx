import Button from "./Button";
import SuccessView from "./SuccessView";
import {useSessionContext} from "supertokens-auth-react/recipe/session";
import {useNavigate} from "react-router-dom";
import {signOut} from "supertokens-auth-react/recipe/session";
import {SuperTokensConfig} from "../config"
// TODO: This screen needs to be more professional
export default function Home() {
    const sessionContext = useSessionContext();
    const navigate = useNavigate();

    async function logoutClicked() {
        await signOut();
        navigate("/auth");
    }

    async function dashboardClicked() {
        window.location.href= SuperTokensConfig.appInfo.apiDomain + "/auth/dashboard";
    }

    if (sessionContext.loading === true) {
        return null;
    }

    return (
        <div className="fill">
            <Button label={"Go to dashboard"} buttonClicked={dashboardClicked}/>
            <Button label={"Sign out"} buttonClicked={logoutClicked}/>
            <SuccessView userId={sessionContext.userId}/>
        </div>
    );
}
