import "./index.css";

type BtnToggleProps = React.ComponentProps<"button">;

export default function BtnToggle({ children, ...rest }: BtnToggleProps) {
    return (
        <button className="btn-toggle" {...rest}>
            {children}
        </button>
    );
}
