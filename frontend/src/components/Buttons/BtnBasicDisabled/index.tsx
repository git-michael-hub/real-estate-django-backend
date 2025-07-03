import "./index.css";

type BtnBasicDisabledProps = React.ComponentProps<"button">;

export default function BtnBasicDisabled({ children, ...rest }: BtnBasicDisabledProps) {
    return (
        <button className="basic-btn-disabled" {...rest}>
            {children}
        </button>
    );
}
