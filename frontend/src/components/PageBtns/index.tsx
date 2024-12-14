import { useNavigate } from "react-router-dom";
import BtnIcon from "../Buttons/BtnIcon";
import BtnIconActive from "../Buttons/BtnIconActive";
import "./index.css";

type PageBtnsType = {
    previousPageLink: string | null;
    nextPageLink: string | null;
    page: number;
    pages: number;
    action: (enpoint: string) => Promise<any>;
    enableNavigate?: boolean;
};

export default function PageBtns({
    page,
    pages,
    previousPageLink,
    nextPageLink,
    action,
    enableNavigate = false,
}: PageBtnsType) {
    const navigate = useNavigate();

    async function onClickPrevious(): Promise<void> {
        if (previousPageLink) {
            const url = new URL(previousPageLink);
            await action(url.search);
            if (enableNavigate) navigate(`${url.pathname + url.search}`);
        }
    }

    async function onClickNext(): Promise<void> {
        if (nextPageLink) {
            const url = new URL(nextPageLink);
            await action(url.search);
            if (enableNavigate) navigate(`${url.pathname + url.search}`);
        }
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        let pageLink = nextPageLink;
        if (!pageLink) pageLink = previousPageLink;
        if (!pageLink) return;
        const url = new URL(pageLink);
        const params: URLSearchParams = url.searchParams;
        params.delete("page");
        params.append("page", e.currentTarget.innerText);
        await action(`?${params.toString()}`);
        if (enableNavigate) navigate(`${url.pathname}?${params.toString()}`);
    }

    return (
        <div className="page-btn-container">
            {previousPageLink ? (
                <BtnIcon onClick={onClickPrevious}>
                    <i className="fa-solid fa-chevron-left"></i>
                </BtnIcon>
            ) : (
                <BtnIcon onClick={onClickPrevious} disabled>
                    <i className="fa-solid fa-chevron-left"></i>
                </BtnIcon>
            )}

            {[...Array(pages).keys()].map((index) => {
                let currentNum = index + 1;

                if (page - 2 <= currentNum && page + 2 >= currentNum) {
                    if (page === currentNum) return <BtnIconActive key={currentNum}>{page}</BtnIconActive>;
                    return (
                        <BtnIcon onClick={onClick} key={currentNum}>
                            {currentNum}
                        </BtnIcon>
                    );
                }

                if ((page >= pages - 2 && currentNum >= pages - 4) || (page <= 2 && currentNum <= 5)) {
                    if (page === currentNum) return <BtnIconActive key={currentNum}>{page}</BtnIconActive>;
                    return (
                        <BtnIcon onClick={onClick} key={currentNum}>
                            {currentNum}
                        </BtnIcon>
                    );
                }

                return <></>;
            })}

            {nextPageLink ? (
                <BtnIcon onClick={onClickNext}>
                    <i className="fa-solid fa-chevron-right"></i>
                </BtnIcon>
            ) : (
                <BtnIcon onClick={onClickNext} disabled>
                    <i className="fa-solid fa-chevron-right"></i>
                </BtnIcon>
            )}
        </div>
    );
}
