import "./index..css";

type BtnBasicType = React.ComponentProps<"button">;

export default function BtnBasic({ children, ...rest }: BtnBasicType) {
    return (
        <button className="basic-btn" {...rest}>
            {children}
        </button>
    );
}
