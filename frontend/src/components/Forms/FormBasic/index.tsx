import "./index.css";

type FormBasicProps = React.ComponentProps<"form">;

export default function FormBasic({ children, ...rest }: FormBasicProps) {
    return (
        <form className="form-basic" {...rest}>
            {children}
        </form>
    );
}
