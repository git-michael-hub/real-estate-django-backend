import "./index.css";

type ListDropDownProps = React.ComponentProps<"ul">;

export default function ListDropDown({ children, ...rest }: ListDropDownProps) {
    return (
        <ul className="list-drop-down" {...rest}>
            {children}
        </ul>
    );
}
