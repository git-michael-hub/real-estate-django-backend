import "./index.css";

type SelectBasicType = {
    label: string;
    children: React.ReactNode;
    labelProps?: React.ComponentProps<"label">;
    selectProps?: React.ComponentProps<"select">;
};

export default function SelectBasic({ label, children, labelProps, selectProps }: SelectBasicType) {
    return (
        <div className="select-basic-container">
            <label {...labelProps} className="select-basic-label">
                {label}
            </label>
            <select {...selectProps} className="select-basic">
                {children}
            </select>
        </div>
    );
}
