export default function Button(props: { buttonClicked: () => void , label: string}) {
    let logoutClicked = props.buttonClicked;
    let buttonLabel = props.label;
    return (
        <div
            style={{
                display: "flex",
                height: "70px",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingLeft: "75px",
                paddingRight: "75px",
            }}
        >
            <div
                onClick={logoutClicked}
                style={{
                    display: "flex",
                    // width: "116px",
                    margin: "15px",
                    padding: "5px",
                    height: "42px",
                    backgroundColor: "#000000",
                    borderRadius: "10px",
                    cursor: "pointer",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: "bold",
                }}
            >
                {buttonLabel}
            </div>
        </div>
    );
}
