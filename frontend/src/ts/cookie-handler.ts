export type Token = string | null;

const cookieHandler = {
    get: function (cookieName: string): Token {
        let cookieValue: Token = null;
        if (document.cookie && document.cookie !== "") {
            const cookies: string[] = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie: string = cookies[i].trim();
                if (cookie.substring(0, cookieName.length + 1) === cookieName + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(cookieName.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    set: function (cookieName: string, cookieValue: Token): void {
        const EXPIRE_DAYS: number = 7;
        var exdate: Date = new Date();
        exdate.setDate(exdate.getDate() + EXPIRE_DAYS);
        document.cookie =
            cookieName +
            "=" +
            cookieValue +
            ";path=/" +
            (EXPIRE_DAYS == null ? "" : ";expires=" + exdate.toUTCString());
    },

    delete: function (cookieName: string): void {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
};

export default cookieHandler;
