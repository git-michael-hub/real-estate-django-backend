import "./index.css";

type MyRealEstateHeaderType = {
    children: React.ReactNode;
};

export default function MyRealEstateHeader({ children }: MyRealEstateHeaderType) {
    return <div className="my-real-estate-header">{children}</div>;
}
