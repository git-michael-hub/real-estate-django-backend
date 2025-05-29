import "./index.css";

const DEFAULT_PROFILE_PICTURE = "/static/images/default-profile-picture.jpg";

type ProfileImagePropsType = {
    profile_image_path?: string;
};

export default function ProfileImage({ profile_image_path }: ProfileImagePropsType) {
    return (
        <>
            {profile_image_path ? (
                <img src={profile_image_path} alt="" id="profile-image" />
            ) : (
                <img
                    src={DEFAULT_PROFILE_PICTURE}
                    alt="Photo by Muhammad Khaleeq on https://www.vecteezy.com/vector-art/288638-broker-vector-icon"
                    id="profile-image"
                />
            )}
        </>
    );
}
