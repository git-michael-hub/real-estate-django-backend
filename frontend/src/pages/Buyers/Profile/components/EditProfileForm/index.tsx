import { useEffect, useRef, useState } from "react";
import BtnBasicActive from "../../../../../components/Buttons/BtnBasicActive";
import FormBasic from "../../../../../components/Forms/FormBasic";
import LabelBasic from "../../../../../components/Forms/LabelBasic";
import TextAreaBasic from "../../../../../components/Forms/TextAreaBasic";
import { BuyerAccountType } from "../../../../../types/buyer";
import { BuyerFormMessageType } from "../../../../../types/formMessages";
import "./index.css";
import useBuyer from "../../../../../features/buyers/hooks/useBuyers";
import { APIResponseType } from "../../../../../utils/api-service";
import Message from "../../../../../components/Message";

export type EditProfileFormProps = {
    buyer: BuyerAccountType;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const DEFAULT_PROFILE_PICTURE = "/static/images/default-profile-picture.jpg";

export default function EditProfileForm({ buyer, setIsModalVisible }: EditProfileFormProps) {
    const [formMessages, setFormMessages] = useState<BuyerFormMessageType>({});
    const [profileImagePath, setProfileImagePath] = useState<string>(DEFAULT_PROFILE_PICTURE);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [bio, setBio] = useState<string>("");
    const imageInputRef = useRef<HTMLInputElement>(null);

    const { editProfileAndUpdateState } = useBuyer();

    useEffect(() => {
        if (buyer.profile_image_path) setProfileImagePath(buyer.profile_image_path);
        setBio(buyer.bio);
    }, []);

    const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageFile = files[0];
            setProfileImageFile(imageFile);
            setProfileImagePath(URL.createObjectURL(imageFile));
        }
    };

    const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.currentTarget.value);
    };

    const resetProfilePicture = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setProfileImageFile(null);
        buyer.profile_image_path
            ? setProfileImagePath(buyer.profile_image_path)
            : setProfileImagePath(DEFAULT_PROFILE_PICTURE);

        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: FormData = new FormData(e.currentTarget);
        if (profileImageFile) formData.append("profile_image_path", profileImageFile);
        if (bio !== buyer.bio) formData.append("bio", bio);

        const response: APIResponseType = await editProfileAndUpdateState(buyer.user.username, formData);
        response.success ? setIsModalVisible(false) : setFormMessages(response.err_messages as BuyerFormMessageType);
    };

    return (
        <FormBasic id="edit-profile-form" onSubmit={onSubmit}>
            <h3>Edit Profile</h3>
            <div>
                <LabelBasic>Profile Picture:</LabelBasic>
                <div className="profile-picture-container">
                    {profileImageFile ? (
                        <img className="profile-picture" src={URL.createObjectURL(profileImageFile)} />
                    ) : (
                        <img className="profile-picture" src={profileImagePath} />
                    )}
                </div>
                {profileImageFile ? (
                    <label id="upload-profile-pic-btn" className="label-link-style" onClick={resetProfilePicture}>
                        Remove
                    </label>
                ) : (
                    <label htmlFor="profile_image_path" id="upload-profile-pic-btn" className="label-link-style">
                        Edit
                    </label>
                )}
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    id="profile_image_path"
                    name="profile_image_path"
                    onChange={onChangeImage}
                    ref={imageInputRef}
                />
                <div>
                    {formMessages.profile_image_path ? (
                        <Message type="error">{formMessages.profile_image_path[0]}</Message>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div>
                <LabelBasic htmlFor="bio">Bio: </LabelBasic>
                <TextAreaBasic name="bio" id="bio" defaultValue={bio} onChange={onChangeBio}></TextAreaBasic>
                <div>{formMessages.bio ? <Message type="error">{formMessages.bio[0]}</Message> : <></>}</div>
            </div>
            <div>
                {formMessages.error ? <Message type="error">{formMessages.error[0]}</Message> : <></>}
                {formMessages.non_field_errors ? (
                    <Message type="error">{formMessages.non_field_errors[0]}</Message>
                ) : (
                    <></>
                )}
            </div>

            <BtnBasicActive type="submit">Save</BtnBasicActive>
        </FormBasic>
    );
}
