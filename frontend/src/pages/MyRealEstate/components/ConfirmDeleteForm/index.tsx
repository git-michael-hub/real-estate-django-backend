import BtnBasicActive from "../../../../components/Buttons/BtnBasicActive";
import "./index.css";

type ConfirmDeleteFormProps = {
    objectId: number | string | null;
    deleteFunction: (objectId: number | string) => Promise<boolean>;
    setIsConfirmDeleteFormActive: React.Dispatch<React.SetStateAction<boolean>>;
    callback?: () => void;
};

export default function ConfirmDeleteForm({
    objectId,
    deleteFunction,
    setIsConfirmDeleteFormActive,
    callback,
}: ConfirmDeleteFormProps) {
    async function onDelete(e: React.FormEvent<HTMLFormElement>, objectId: number | string | null): Promise<void> {
        e.preventDefault();

        if (!objectId) return;

        const isDeleted: boolean = await deleteFunction(objectId);
        if (isDeleted) {
            setIsConfirmDeleteFormActive(false);
            if (callback) callback();
            return alert("Successfully deleted listing.");
        } else return alert("An error occurred.");
    }

    return (
        <div id="background-mask">
            <form id="confirm-delete-form" onSubmit={(e) => onDelete(e, objectId)}>
                <p>Confirm Delete</p>
                <div>
                    <div className="delete-btn-container">
                        <BtnBasicActive type="submit">Delete</BtnBasicActive>
                    </div>
                    <BtnBasicActive type="button" onClick={() => setIsConfirmDeleteFormActive(false)}>
                        Cancel
                    </BtnBasicActive>
                </div>
            </form>
        </div>
    );
}
