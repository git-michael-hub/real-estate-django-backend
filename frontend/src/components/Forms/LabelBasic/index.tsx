import "./index.css";

type LabelBasicProps = React.ComponentProps<"label">;

export default function LabelBasic({ children, ...rest }: LabelBasicProps) {
    return (
        <label className="label-basic" {...rest}>
            {children}
        </label>
    );
}
