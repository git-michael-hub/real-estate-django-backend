import "./index.css";

type MessageProps = {
    type: "error" | "success";
    children: React.ReactNode;
};

export default function Message({ children, type }: MessageProps) {
    const className = `message ${type}`;

    return <div className={className}>{children}</div>;
}
