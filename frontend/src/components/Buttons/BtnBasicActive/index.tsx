import "./index.css";

type BtnBasicActiveProps = React.ComponentProps<"button">;

export default function BtnBasicActive({ children, ...rest }: BtnBasicActiveProps) {
    return (
        <button className="basic-btn-active" {...rest}>
            {children}
        </button>
    );
}
