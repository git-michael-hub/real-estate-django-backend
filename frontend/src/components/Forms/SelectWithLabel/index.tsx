import "./index.css";

type SelectWithLabelType = {
    label: string;
    children: React.ReactNode;
    labelProps?: React.ComponentProps<"label">;
    selectProps?: React.ComponentProps<"select">;
};

export default function SelectWithLabel({ label, children, labelProps, selectProps }: SelectWithLabelType) {
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
