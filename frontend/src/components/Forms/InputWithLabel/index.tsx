import "./index.css";

type InputWithLabelProps = {
    type?: string;
    children: React.ReactNode;
    name: string;
    id?: string;
};

export default function InputWithLabel({ children, name, type = "text", id }: InputWithLabelProps) {
    return (
        <div className="input-with-label">
            <label htmlFor={name}>{children}</label>
            <input type={type} name={name} id={id} />
        </div>
    );
}
