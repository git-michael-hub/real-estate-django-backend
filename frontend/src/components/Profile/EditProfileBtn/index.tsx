import BtnBasicActive from "../../Buttons/BtnBasicActive";
import BtnLink from "../../Buttons/BtnLink";
import "./index.css";

type EditProfileBtnPropsType = {
    action: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditProfileBtn({ action }: EditProfileBtnPropsType) {
    return (
        <>
            <BtnBasicActive id="edit-profile-btn" onClick={() => action(true)}>
                <span>Edit</span>
            </BtnBasicActive>
            <BtnLink id="edit-profile-btn-link" onClick={() => action(true)}>
                <span>Edit</span>
            </BtnLink>
        </>
    );
}
