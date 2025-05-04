import "./index.css";

type BtnTabProps = React.ComponentProps<"button">;

export default function BtnTab({ children, ...rest }: BtnTabProps) {
    return (
        <button className="btn-tab" {...rest}>
            {children}
        </button>
    );
}
