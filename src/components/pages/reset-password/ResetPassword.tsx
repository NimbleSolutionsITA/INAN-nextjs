import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {Divider, FormControl, Grid, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {regExpEmail} from "../../../utils/helpers";
import {
    WORDPRESS_RESET_PASSWORD_ENDPOINT,
} from "../../../utils/endpoints";
import {resetPassword, setNewPassword, validateCode} from "../../../utils/auth";
import Button from "../../Button";
import {useRouter} from "next/router";

const ResetPassword = () => {
    const { header: {isMobile}, auth: {authenticated} } = useSelector((state: RootState) => state);
    const honeyRef = useRef<HTMLInputElement>(null)
    const noUppercase = {
        '& .MuiInputBase-input': {
            textTransform: 'none',
        }
    }
    const router = useRouter()
    const [data, setData] = useState<{
        email: string | null;
        password: string | null;
        code: string | null;
        confirmPassword: string | null;
        showPassword: boolean;
        showConfirmPassword: boolean;
        emailSent: false | string;
        validCode: boolean;
        resetSuccess: boolean | string;
    }>({
        email: null,
        password: null,
        code: null,
        confirmPassword: null,
        showPassword: false,
        showConfirmPassword: false,
        emailSent: false,
        validCode: false,
        resetSuccess: false,
    })
    const [dataError, setDataError] = useState<{
        email: false | string
        password: false | string
        code: false | string
        confirmPassword: false | string
    }>({
        email: false,
        password: false,
        code: false,
        confirmPassword: false,
    })

    const handleChange = (event:  ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const value = event.target.value
        if (field === 'code' && data.email && regExpEmail.test(data.email) && value.length === 4) {
            setData({...data, code: value})
            validateCode(data.email, value)
                .then((response) => setData({...data, code: value, validCode: !!response.message}))
                .catch((error) => {
                    setData({...data, code: value, validCode: false})
                    if (error.message) setDataError({...dataError, code: error.message})
                });
            return
        }
        if (field === 'code' && value.length > 4) return
        setDataError({...dataError, [field]: false})
        setData({...data, [field]: event.target.value})
    }
    const handleClickShowPassword = () => {
        setData({ ...data, showPassword: !data.showPassword });
    };
    const handleClickShowConfirmPassword = () => {
        setData({ ...data, showConfirmPassword: !data.showConfirmPassword });
    };

    const handleReset = () => {
        setDataError({
            email: !data.email ? 'EMAIL IS REQUIRED' : !regExpEmail.test(data.email) && 'PLEASE ENTER A VALID EMAIL ADDRESS',
            password: !data.password && 'PASSWORD IS REQUIRED',
            confirmPassword: data.password !== data.confirmPassword && 'PASSWORD DOES NOT MATCH',
            code: data.code?.length !== 4 ? 'CODE MUST BE 4 DIGITS' : dataError.code
        })
        if (data.code && data.validCode && data.email && regExpEmail.test(data.email) && data.password && data.password === data.confirmPassword && !honeyRef.current?.value) {
            setNewPassword(data.email, data.code, data.password).
                then(response => setData({...data, resetSuccess: response.message}))
        }
    }
    const handleSubmit = () => {
        setDataError({
            email: !data.email ? 'EMAIL IS REQUIRED' : (!regExpEmail.test(data.email) && 'PLEASE ENTER A VALID EMAIL ADDRESS'),
            password: false,
            code: false,
            confirmPassword: false
        })
        if (data.email && !honeyRef.current?.value) {
            resetPassword(data.email)
                .then(response => {
                    setData({...data, emailSent: response.message})
                })
                .catch(error => setDataError({...dataError, email: error.message}));
        }
    }

    useEffect(() => {
        if (authenticated) {
            router.push({ pathname: '/account' });
        }
    }, [authenticated]);

    return (
        <Grid sx={{marginTop: isMobile ? 0 : '20px'}} container spacing={isMobile ? 0 : 4}>
            <Grid item xs={12} md={12}>
                {isMobile && <br />}
                {isMobile && <br />}
                <Typography variant="h1" component="h1">Reset password</Typography>
                {!isMobile && <Divider />}
                {!data.resetSuccess && (data.emailSent ? (
                    <Typography variant="body1" component="p">{data.emailSent}</Typography>
                ) : (
                    <Typography variant="body1" component="p">Enter the email address associated with your account. You will shortly recieve an email to reset your password.</Typography>
                )) }
            </Grid>
            <Grid item xs={12} md={6}>
                {data.resetSuccess ? (
                    <Typography variant="h1" component="h1">{data.resetSuccess}</Typography>
                ) : (
                    data.emailSent ? (
                        <form>
                            <FormControl fullWidth style={{marginTop: '10px'}}>
                                <TextField
                                    InputLabelProps={{
                                        disableAnimation: true,
                                        focused: false,
                                        shrink: true,
                                    }}
                                    placeholder="ENTER YOUR EMAIL"
                                    required
                                    error={!!dataError.email}
                                    label="EMAIL"
                                    helperText={dataError.email}
                                    fullWidth
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => handleChange(event, 'email')}
                                />
                            </FormControl>
                            <FormControl fullWidth style={{marginTop: '10px'}}>
                                <TextField
                                    InputLabelProps={{
                                        disableAnimation: true,
                                        focused: false,
                                        shrink: true,
                                    }}
                                    placeholder="ENTER THE 4 DIGIT CODE RECEIVED BY EMAIL"
                                    required
                                    error={!!dataError.code}
                                    label="code"
                                    helperText={dataError.code || data.validCode}
                                    fullWidth
                                    type="number"
                                    value={data.code}
                                    onChange={(event) => handleChange(event, 'code')}
                                />
                            </FormControl>
                            <FormControl fullWidth style={{marginTop: '10px'}}>
                                <TextField
                                    placeholder="ENTER YOUR PASSWORD"
                                    required
                                    error={!!dataError.password}
                                    label="PASSWORD"
                                    helperText={dataError.password}
                                    fullWidth
                                    type={data.showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(event) => handleChange(event, 'password')}
                                    InputLabelProps={{
                                        disableAnimation: true,
                                        focused: false,
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={(event) =>  event.preventDefault()}
                                                    edge="end"
                                                >
                                                    {data.showPassword ? <Typography variant="body2">HIDE</Typography> : <Typography variant="body2">SHOW</Typography>}
                                                </IconButton>
                                            </InputAdornment>,
                                        sx: noUppercase
                                    }}
                                />
                            </FormControl>
                            <FormControl fullWidth style={{marginTop: '10px', marginBottom: '20px'}}>
                                <TextField
                                    placeholder="CONFIRM YOUR PASSWORD"
                                    required
                                    error={!!dataError.confirmPassword}
                                    label="CONFIRM PASSWORD"
                                    helperText={dataError.confirmPassword}
                                    fullWidth
                                    type={data.showConfirmPassword ? 'text' : 'password'}
                                    value={data.confirmPassword}
                                    onChange={(event) => handleChange(event, 'confirmPassword')}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={(event) =>  event.preventDefault()}
                                                    edge="end"
                                                >
                                                    {data.showConfirmPassword ? <Typography variant="body2">HIDE</Typography> : <Typography variant="body2">SHOW</Typography>}
                                                </IconButton>
                                            </InputAdornment>,
                                        sx: noUppercase
                                    }}
                                    InputLabelProps={{
                                        disableAnimation: true,
                                        focused: false,
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                            <label className="ohnohoney" htmlFor="name" />
                            <input className="ohnohoney" autoComplete="off" type="name" id="name" name="name" placeholder="Your name here" ref={honeyRef} />
                            <Button variant="contained" color="secondary" fullWidth onClick={handleReset}>Reset</Button>
                        </form>
                    ) : (
                        <form>
                            <FormControl fullWidth style={{marginBottom: '20px'}}>
                                <TextField
                                    placeholder="ENTER YOUR EMAIL"
                                    required
                                    error={!!dataError.email}
                                    label="EMAIL"
                                    helperText={dataError.email}
                                    fullWidth
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => handleChange(event, 'email')}
                                    InputLabelProps={{
                                        disableAnimation: true,
                                        focused: false,
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                            <label className="ohnohoney" htmlFor="name" />
                            <input className="ohnohoney" autoComplete="off" type="name" id="name" name="name" placeholder="Your name here" ref={honeyRef} />
                            <Button variant="contained" color="secondary" fullWidth onClick={handleSubmit}>submit</Button>
                        </form>
                    )
                )}
            </Grid>
        </Grid>
    )
}

export default ResetPassword