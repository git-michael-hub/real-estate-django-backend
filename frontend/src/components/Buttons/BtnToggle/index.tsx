import "./index.css";

type BtnToggle = React.ComponentProps<"button">;

export default function BtnToggle({ children, ...rest }: BtnToggle) {
    return (
        <button className="btn-toggle" {...rest}>
            {children}
        </button>
    );
}
