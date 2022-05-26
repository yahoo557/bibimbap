const url = new URL(window.location.href);
console.log(url);
const redirectURL = url.searchParams.get('redirect')

if(redirectURL) {
    const loginForm = document.getElementById("loginForm");
    loginForm.setAttribute('action', `/login?redirect=${redirectURL}`);
}