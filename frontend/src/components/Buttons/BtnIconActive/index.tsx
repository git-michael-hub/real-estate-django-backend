import "./index.css";

type BtnIconActiveProps = React.ComponentProps<"button">;

export default function BtnIconActive({ children, ...rest }: BtnIconActiveProps) {
    return (
        <button className="icon-btn-active" {...rest}>
            {children}
        </button>
    );
}
