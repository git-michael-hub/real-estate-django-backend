import "./index.css";

type SelectBasicType = {
    label: string;
    children: React.ReactNode;
    labelProps?: React.ComponentProps<"label">;
    selectProps?: React.ComponentProps<"select">;
};

export default function SelectBasic({ label, children, labelProps, selectProps }: SelectBasicType) {
    return (
        <div className="select-with-label-container">
            <label {...labelProps} className="select-with-label-label">
                {label}
            </label>
            <select {...selectProps} className="select-with-label">
                {children}
            </select>
        </div>
    );
}
