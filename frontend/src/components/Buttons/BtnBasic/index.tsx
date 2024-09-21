import "./index.css";

type BtnBasicProps = React.ComponentProps<"button">;

export default function BtnBasic({ children, ...rest }: BtnBasicProps) {
    return (
        <button className="basic-btn" {...rest}>
            {children}
        </button>
    );
}
