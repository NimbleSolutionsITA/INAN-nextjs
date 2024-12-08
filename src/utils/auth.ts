import {
    API_CUSTOMER_ENDPOINT,
    WORDPRESS_LOGIN_ENDPOINT,
    WORDPRESS_RESET_PASSWORD_ENDPOINT,
    WORDPRESS_RESET_PASSWORD_VALIDATE_CODE_ENDPOINT,
    WORDPRESS_SET_NEW_PASSWORD_ENDPOINT,
    WORDPRESS_VERIFY_TOKEN_ENDPOINT
} from "./endpoints";
import {Customer} from "../../@types/woocommerce";

export const checkLoginUser = async (): Promise<Customer | false> => {
    const localAccessToken = localStorage.getItem('inan-token');
    if (localAccessToken) {
        const response = await fetch(WORDPRESS_VERIFY_TOKEN_ENDPOINT, { method: 'POST',  headers: {
                'Authorization': `Bearer ${localAccessToken}`
            }})
        const verify = await response.json()
        if (verify.code === 'jwt_auth_valid_token') {
            const user_id = getUserIdFromToken(localAccessToken);
            const userResponse = await fetch(`${API_CUSTOMER_ENDPOINT}/${user_id}`, {
                headers: [["Content-Type", 'application/json']]
            })
            const {customer} = await userResponse.json()
            return customer
        }
        localStorage.removeItem('inan-token')
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

function getUserIdFromToken(token: string) {
    try {
        // Split the token into parts (header, payload, signature)
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        // Decode the payload (base64 URL-encoded)
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

        // Ensure the payload has the expected structure
        if (payload && payload.data && payload.data.user && payload.data.user.id) {
            return payload.data.user.id;
        } else {
            throw new Error('user_id not found in token');
        }
    } catch (error: any) {
        console.error('Error extracting user_id:', error.message);
        return null; // Return null if extraction fails
    }
}