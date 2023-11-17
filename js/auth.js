function login() {
    const xhr = new XMLHttpRequest();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let loginInfo = {
        email: username,
        password: password 
    };
    let requestBody = JSON.stringify(loginInfo);
    xhr.open('POST', URL_DEV + `api/v1/auth/authenticate`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status !== 200) {
                switch(xhr.status) {
                    case 403 :
                        alert("The authentication information you provided does not seem to match our records.");
                        break;
                    default:
                        alert(`An error occured: ${xhr.status}. Message: ${xhr.statusText}`)
                }
            } else {
                let response = xhr.response;
                if(response !== "Mot de Passe éronné.") {
                    responseParsed = JSON.parse(response)
                    sessionStorage.setItem('jwtToken', responseParsed.token);
                    window.location.href = "./homepage"
                }
                return xhr.response;
            }  
        }
    });
    xhr.send(requestBody);
}

function checkAuth() {
    const xhr = new XMLHttpRequest();
    let jwtToken = sessionStorage.getItem('jwtToken');
    xhr.open('GET', URL_DEV + `api/v1/back-office/products/checkAuth`);
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status !== 200) {
                document.getElementById("loginDiv").style.display = "flex"
            } else {
                window.location.href = "./homepage"
                return xhr.response;
            }  
        }
    });
    xhr.send();
}
checkAuth();