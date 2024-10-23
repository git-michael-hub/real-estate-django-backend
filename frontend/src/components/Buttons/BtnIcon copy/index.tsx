import "./index.css";

type BtnIconRoundProps = React.ComponentProps<"button">;

export default function BtnIconRound({ children, ...rest }: BtnIconRoundProps) {
    return (
        <button className="icon-btn-round" {...rest}>
            {children}
        </button>
    );
}
