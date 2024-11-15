import "./index.css";

type BtnEditProps = React.ComponentProps<"button">;

export default function BtnEdit({ children = "edit", ...rest }: BtnEditProps) {
    return (
        <button className="edit-btn" {...rest}>
            <span>{children}</span>
            <i className="fa-solid fa-pen-to-square"></i>
        </button>
    );
}
