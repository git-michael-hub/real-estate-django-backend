import React, { LegacyRef } from "react";

type FormWithRefProps = React.ComponentProps<"form">;

const FormWithRef = React.forwardRef(({ children, ...rest }: FormWithRefProps, ref: LegacyRef<HTMLFormElement>) => {
    return (
        <form className="form-basic" ref={ref} {...rest}>
            {children}
        </form>
    );
});

export default FormWithRef;
