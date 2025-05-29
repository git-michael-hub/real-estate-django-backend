import "./index.css";

type ProfileDetailsContainerPropsType = {
    children: React.ReactNode;
};

export default function ProfileDetailsContainer({ children }: ProfileDetailsContainerPropsType) {
    return <section id="profile-details-container">{children}</section>;
}
