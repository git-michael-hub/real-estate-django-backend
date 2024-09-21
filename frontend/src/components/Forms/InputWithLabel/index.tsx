import "./index.css";

type InputWithLabelProps = {
    children: React.ReactNode;
    labelProps?: React.ComponentProps<"label">;
    inputProps?: React.ComponentProps<"input">;
};

export default function InputWithLabel({ children, labelProps, inputProps }: InputWithLabelProps) {
    return (
        <div className="input-with-label">
            <label {...labelProps}>{children}</label>
            <input {...inputProps} />
        </div>
    );
}
