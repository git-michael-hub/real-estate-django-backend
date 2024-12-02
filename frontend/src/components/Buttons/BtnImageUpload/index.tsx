import "./index.css";

type BtnImageUploadProps = {
    buttonProps?: React.ComponentProps<"button">;
    inputProps?: React.ComponentProps<"input">;
    imageFile?: File | null | string;
};

export default function BtnImageUpload({ buttonProps, inputProps, imageFile = null }: BtnImageUploadProps) {
    return (
        <>
            {imageFile ? (
                <div className="image-upload-btn">
                    <button type="button" {...buttonProps}>
                        <span>
                            <i className="fa-solid fa-xmark"></i>
                        </span>
                    </button>
                    {typeof imageFile === "string" ? (
                        <img src={imageFile} alt="" />
                    ) : (
                        <img src={URL.createObjectURL(imageFile)} alt="" />
                    )}
                </div>
            ) : (
                <label className="image-upload-btn no-image">
                    <input type="file" accept="image/png, image/jpeg" {...inputProps} />
                    <img src={"/images/256px-Image_not_available.png"} alt="" />
                </label>
            )}
        </>
    );
}
