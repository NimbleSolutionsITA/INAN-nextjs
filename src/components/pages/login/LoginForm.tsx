import React, {ChangeEvent, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Typography, TextField, FormControl, CircularProgress} from "@mui/material"
import {regExpEmail, sanitize} from "../../../utils/helpers";
import Link from "../../Link";
import Button from "../../Button";
import {RootState} from "../../../redux/store";
import {checkLoginUser, loginUser} from "../../../utils/auth";
import {setAuth} from "../../../redux/authSlice";
import parse from "html-react-parser";
import {setCustomer} from "../../../redux/customerSlice";

const LoginForm = () => {
    const [email, setEmail] = React.useState('')
    const [emailError, setEmailError] = React.useState<false | string>(false)
    const [password, setPassword] = useState( '' )
    const [passwordError, setPasswordError] = React.useState<false | string>(false)
    const [error, setError] = React.useState<false | string>(false)

    const dispatch = useDispatch()
    const authenticating = useSelector((state: RootState) => state.auth.authenticating)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.type === 'email') {
            setEmailError(false)
            setEmail(event.target.value)
        }
        else {
            setPassword(event.target.value)
        }
    }
    async function handleLogin() {
        dispatch(setAuth({authenticating: true}))
        if (!email) {
            setEmailError('YOUR EMAIL IS REQUIRED')
        }
        else if (!regExpEmail.test(email)) {
            setEmailError('PLEASE ENTER A VAILD EMAIL ADDRESS')
        }
        else if (!password) {
            setPasswordError('YOUR PASSWORD IS REQUIRED')
        }
        else {
            const response = await loginUser(email, password)
            if (response.token ) {
                const token = response.token
                localStorage.setItem('inan-token', token);
                const customer = await checkLoginUser()
                if (customer) {
                    dispatch(setCustomer(customer))
                    dispatch(setAuth({
                        authenticated: !!customer, authenticating: false, user: customer ? {
                            id: customer.id,
                            email: customer.email,
                            first_name: customer.first_name,
                            last_name: customer.last_name,
                            username: customer.username,
                        } : undefined
                    }))
                    return
                }
            }
            else if (response.code === '[jwt_auth] incorrect_password')
                setPasswordError('the password is incorrect')
            else if (response.code === '[jwt_auth] invalid_email')
                setEmailError('the email is incorrect')
            if (response.message)
                setError(response.message)
            dispatch(setAuth({authenticating: false}))
        }
    }
    return (
        <form>
            {error && <Typography color="error" variant="body1">{parse(sanitize(error))}</Typography> }
            <FormControl fullWidth style={{marginTop: '10px'}}>
                <TextField
                    placeholder="ENTER YOUR EMAIL"
                    required
                    autoComplete="email"
                    error={!!emailError}
                    label="EMAIL"
                    helperText={emailError}
                    fullWidth
                    type="email"
                    value={email}
                    onChange={handleChange}
                    InputLabelProps={{
                        disableAnimation: true,
                        focused: false,
                        shrink: true,
                    }}
                />
            </FormControl>
            <div style={{position: 'relative', marginTop: '10px', marginBottom: '25px'}}>
                <Link style={{position: 'absolute', top: '10px', right: 0, zIndex: 1}} color="error" href="/reset-password">Forgot Password?</Link>
                <FormControl fullWidth>
                    <TextField
                        sx={{
                            '& .MuiInputBase-input': {
                                textTransform: 'none',
                            }
                        }}
                        placeholder="ENTER YOUR PASSWORD"
                        required
                        autoComplete="password"
                        error={!!passwordError}
                        label="PASSWORD"
                        helperText={passwordError}
                        fullWidth
                        type="password"
                        value={password}
                        onChange={handleChange}
                        InputLabelProps={{
                            disableAnimation: true,
                            focused: false,
                            shrink: true,
                        }}
                    />
                </FormControl>
            </div>
            <Button variant="contained" color="secondary" fullWidth onClick={handleLogin}>{authenticating ? <CircularProgress size={15} /> : 'log in'}</Button>
        </form>
    )
}

export default LoginForm