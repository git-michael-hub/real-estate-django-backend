import "./index.css";

type BtnIconNoBgProps = React.ComponentProps<"button">;

export default function BtnIconNoBg({ children, ...rest }: BtnIconNoBgProps) {
    return (
        <button className="icon-btn-no-bg" {...rest}>
            {children}
        </button>
    );
}
