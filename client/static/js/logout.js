window.onload = () => {
    console.log("LoGoUt");
    const urlString = window.location.href;
    const urlObject = new URL(urlString);
    const searchParams = urlObject.searchParams;
    const redirectURL = searchParams.has("redirect") ? searchParams.get("redirect") : "/";

    document.cookie =  'accessToken=;user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.location.pathname = redirectURL;
}