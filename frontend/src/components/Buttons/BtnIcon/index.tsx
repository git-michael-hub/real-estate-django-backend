import "./index.css";

type BtnIconProps = React.ComponentProps<"button">;

export default function BtnIcon({ children, ...rest }: BtnIconProps) {
    return (
        <button className="icon-btn" {...rest}>
            {children}
        </button>
    );
}
