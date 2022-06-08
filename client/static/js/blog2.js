const loginButton = document.querySelector('.login-button');
const logoutButton = document.querySelector('.logout-button');
const redirectURL = encodeURIComponent(window.location.pathname);

if(loginButton) {
    loginButton.addEventListener('click', (e) => {
        window.location.href = `/login?redirect=${redirectURL}`
    });
}

if(logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        console.log('test');
        window.location.href = `/logout?redirect=${redirectURL}`;
    }); 
}
