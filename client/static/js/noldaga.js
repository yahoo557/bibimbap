//data => need JSON.stringify()
const xhrPromise = (method, url, data) => {
    return new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest();
       xhr.open(method, url);
       if(method.toUpperCase() == 'POST'){
           xhr.setRequestHeader('Content-Type', 'application/json');
       }
       xhr.onload = () => {
           if(xhr.status >= 200 && xhr.status < 300) {
               if(xhr.response)
                   resolve(JSON.parse(xhr.response));
               else
                   resolve();
           } else {
               reject(JSON.parse(xhr.response));
           }
       }
       xhr.send(data);
    });
}

const showMessageRedirect = (data) => {
    if(data?.hasOwnProperty('msg')) {
        alert(data.msg);
    }
    if(data?.hasOwnProperty('redirect')) {
        location.href = data.redirect;
    }
};

const parseCookie = str =>
    str.split(';').map(v => v.split('=')).reduce((acc, v) => {
        acc[decodeURIComponent(v[0]?.trim())] = decodeURIComponent(v[1]?.trim());
        return acc;
    }, {});

const checkLoginStatus = () => {
    const cookie = parseCookie(document.cookie);
    const flag = cookie?.hasOwnProperty('accessToken') && cookie?.hasOwnProperty('user');
    return {flag: flag, token: cookie.accessToken};
}

let decodeToken = (token) => {
    const rawPayload = token.split('.')[1];
    const payload = decodeURIComponent(atob(rawPayload));
    return JSON.parse(payload.toString());
}

const dateFormating = (date) => {
    if(typeof(date) == "string") date = new Date(date);
    const dateString = date.toISOString().split('T');
    const ymd = dateString[0].replaceAll('-', '.');
    const hms = dateString[1].split('.')[0];

    return `${ymd} ${hms}`;
}
