import "./index.css";

type SelectBasicType = React.ComponentProps<"select">;

export default function SelectBasic({ children, ...rest }: SelectBasicType) {
    return (
        <select {...rest} className="select-basic">
            {children}
        </select>
    );
}
