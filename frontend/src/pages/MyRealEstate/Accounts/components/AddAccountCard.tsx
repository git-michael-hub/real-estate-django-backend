type AddAccountCardType = React.ComponentProps<"div">;

export default function AddAccountCard({ children, ...rest }: AddAccountCardType) {
    return (
        <div className="account-card add-account" {...rest}>
            <i className="fa-solid fa-circle-plus"></i>
            <span>{children}</span>
        </div>
    );
}
