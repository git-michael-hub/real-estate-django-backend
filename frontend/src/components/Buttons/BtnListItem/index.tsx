import "./index.css";

type BtnListItemProps = React.ComponentProps<"button">;

export default function BtnListItem({ children, ...rest }: BtnListItemProps) {
    return (
        <button className="btn-list-item" {...rest}>
            {children}
        </button>
    );
}
