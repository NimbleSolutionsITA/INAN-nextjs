import {
    WORDPRESS_LOGIN_ENDPOINT,
    WORDPRESS_RESET_PASSWORD_ENDPOINT,
    WORDPRESS_RESET_PASSWORD_VALIDATE_CODE_ENDPOINT,
    WORDPRESS_SET_NEW_PASSWORD_ENDPOINT,
    WORDPRESS_USER_INFO_ENDPOINT
} from "./endpoints";
import {Auth} from "../../@types";

export const checkLoginUser = (): Promise<Auth['user']> | false => {
    const localAccessToken = localStorage.getItem('inan-token');
    if (localAccessToken) {
        let myHeaders = new Headers()
        myHeaders.append('Authorization', `Bearer ${localAccessToken}`)
        return fetch(WORDPRESS_USER_INFO_ENDPOINT, { method: 'POST',  headers: myHeaders})
            .then(response => response.json())
            .catch((error) => error);
    }
    return false
}

export const loginUser = (username: string, password: string): Promise<Partial<{
    token: string
    user_email: string
    user_nicename: string
    user_display_name: string
    code: string,
    data: {status: number},
    message: string
}>> => {
    let formdata = new FormData();
    formdata.append("username", username);
    formdata.append("password", password);

    const requestOptions = {
        method: 'POST',
        body: formdata
    };
    return fetch(WORDPRESS_LOGIN_ENDPOINT, requestOptions)
        .then((response) => response.json())
        .catch(error => error.response.data.code);
}

export const resetPassword = (email: string): Promise<{message: string}> => {
    let formdata = new FormData();
    formdata.append('email', email);
    const requestOptions = {
        method: 'POST',
        body: formdata
    };
    return fetch(WORDPRESS_RESET_PASSWORD_ENDPOINT, requestOptions)
        .then((response) => response.json())
        .catch(error => error.response.data.code);
}

export const setNewPassword = (email: string, code: string, password: string): Promise<{message: string}> => {
    let formdata = new FormData();
    formdata.append('email', email);
    formdata.append('code', code);
    formdata.append('password', password);
    const requestOptions = {
        method: 'POST',
        body: formdata
    };
    return fetch(WORDPRESS_SET_NEW_PASSWORD_ENDPOINT, requestOptions)
        .then((response) => response.json())
        .catch(error => error.response.data.code);
}

export const validateCode = (email: string, code: string): Promise<{message: string}> => {
    let formdata = new FormData();
    formdata.append('email', email);
    formdata.append('code', code);
    const requestOptions = {
        method: 'POST',
        body: formdata
    };
    return fetch(WORDPRESS_RESET_PASSWORD_VALIDATE_CODE_ENDPOINT, requestOptions)
        .then((response) => response.json())
        .catch(error => error.response.data.code);
}