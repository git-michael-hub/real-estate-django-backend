import "./index.css";

type TextAreaBasicProps = React.ComponentProps<"textarea">;

export default function TextAreaBasic({ ...rest }: TextAreaBasicProps) {
    return <textarea className="textarea-basic" {...rest} />;
}
