import React from "react";
import BtnLink from "../../Buttons/BtnLink";
import "./index.css";

type DefaultModalProps = {
    children?: React.ReactNode;
    sectionProps?: React.ComponentProps<"section">;
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DefaultModal({ children, isModalVisible, setIsModalVisible, sectionProps }: DefaultModalProps) {
    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleChildClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
    };

    return (
        <>
            {isModalVisible ? (
                <div className="modal-background-mask" onClick={closeModal}>
                    <section className="default-modal" onClick={handleChildClick} {...sectionProps}>
                        <BtnLink onClick={closeModal} id="modal-close-btn">
                            close
                        </BtnLink>
                        {children}
                    </section>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
