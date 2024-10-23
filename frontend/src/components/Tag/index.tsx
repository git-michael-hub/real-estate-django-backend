import "./index.css";

type TagType = React.ComponentProps<"span">;

export default function Tag({ children, className, ...rest }: TagType) {
    return (
        <span className={className} {...rest}>
            {children}
        </span>
    );
}
