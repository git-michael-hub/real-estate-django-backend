import "./index.css";

type BtnLinkProps = React.ComponentProps<"button">;

export default function BtnLink({ children, ...rest }: BtnLinkProps) {
    return (
        <button type="button" className="btn-link" {...rest}>
            {children}
        </button>
    );
}
