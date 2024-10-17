import "./index.css";

type InputBasicProps = React.ComponentProps<"input">;

export default function InputBasic({ children, ...rest }: InputBasicProps) {
    return <input className="input-basic" {...rest} />;
}
