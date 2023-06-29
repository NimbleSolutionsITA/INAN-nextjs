import {
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material"
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import Button from "../../Button";
import {regExpEmail} from "../../../utils/helpers";
import Checkbox from "../../Checkbox";
import Link from "../../Link";
import {ChangeEvent, useEffect, useState} from "react";
import {API_CUSTOMER_ENDPOINT} from "../../../utils/endpoints";
import {useRouter} from "next/router";
import {setCustomer} from "../../../redux/customerSlice";
import {setAuth} from "../../../redux/authSlice";

const Register = () => {
    const { 
        header: { isMobile },
        auth: { authenticated }
    } = useSelector((state: RootState) => state);
    const router = useRouter()
    const [data, setData] = useState<{
        firstName: null | string;
        lastName: null | string;
        email: null | string;
        newsletter: boolean;
        password: null | string;
        confirmPassword: null | string;
        showPassword: boolean;
        showConfirmPassword: boolean;
    }>({
        firstName: null,
        lastName: null,
        email: null,
        newsletter: false,
        password: null,
        confirmPassword: null,
        showPassword: false,
        showConfirmPassword: false,
    })
    const [dataError, setDataError] = useState<{
        firstName: false | string;
        lastName: false | string;
        email: false | string;
        password: false | string;
        confirmPassword: false | string;
    }>({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false,
    })
    const [error, setError] = useState<false | string>(false)
    const [userCreated, setUserCreated] = useState(false)
    const [creatingUser, setCreatingUser] = useState(false)
    const dispatch = useDispatch()
    const noUppercase = {
        '& .MuiInputBase-input': {
            textTransform: 'none',
        }
    }
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: string) => {
        setDataError({...dataError, [field]: false})
        setData({...data, [field]: event.target.value})
    }
    const handleClickShowPassword = () => {
        setData({ ...data, showPassword: !data.showPassword });
    };
    const handleClickShowConfirmPassword = () => {
        setData({ ...data, showConfirmPassword: !data.showConfirmPassword });
    };

    const handleRegister = async () => {
        setCreatingUser(true)
        setDataError({
            email: !data.email ? 'EMAIL IS REQUIRED' : !regExpEmail.test(data.email) && 'PLEASE ENTER A VALID EMAIL ADDRESS',
            firstName: !data.firstName && 'FIRST NAME IS REQUIRED',
            lastName: !data.lastName && 'LAST NAME IS REQUIRED',
            password: !data.password && 'PASSWORD IS REQUIRED',
            confirmPassword: data.password !== data.confirmPassword && 'PASSWORD DOES NOT MATCH',
        })
        if (data.email && data.firstName && data.lastName && regExpEmail.test(data.email) && data.password && data.password === data.confirmPassword) {
            const response = await fetch(API_CUSTOMER_ENDPOINT, {
                method: 'POST',
                headers: [["Content-Type", 'application/json']],
                body: JSON.stringify({
                    email: data.email,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    password: data.password
                })
            }).then(r => r.json())
            if (response.success) {
                dispatch(setCustomer(response.customer))
                dispatch(setAuth({
                    authenticated: true,
                    user: response.customer
                }))
            }
            else {
                setError(response.message)
            }
            setCreatingUser(false)
            setUserCreated(false)
        }
    }
    useEffect(() => {
        if (authenticated) {
            router.push({ pathname: router.query.origin === 'checkout' ? '/checkout' : '/account' });
        }
    }, [authenticated]);

    return (
        <Grid style={{marginTop: isMobile ? 0 : '20px'}} container spacing={isMobile ? 0 : 4}>
            <Grid item xs={12} md={12}>
                {userCreated ? (
                    <Typography style={{marginTop: '10px'}} variant="h1" component="h1">CONGRATULATIONS! ACCOUNT CREATED SUCCESSFULLY</Typography>
                ) : (
                    <>
                        <Typography variant="h1" component="h1">Create new account</Typography>
                        {!isMobile && <Divider />}
                        {error ? (
                            <Typography color="error" variant="body1" component="p">{error}</Typography>
                        ) : (
                            <Typography variant="body1" component="p">REGISTER TO COMPLETE CHECKOUT MORE QUICKLY, REVIEW ORDER INFORMATION and much more.</Typography>
                        )}
                    </>
                )}
            </Grid>
            <Grid item xs={12} md={6}>
                {!userCreated && (
                    <form>
                        <Grid container spacing={isMobile ? 0 : 4}>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth style={{marginTop: '10px'}}>
                                    <TextField
                                        placeholder="ENTER YOUR FIRST NAME"
                                        required
                                        autoComplete="given-name"
                                        error={!!dataError.firstName}
                                        label="FIRST NAME"
                                        helperText={dataError.firstName}
                                        fullWidth
                                        type="text"
                                        value={data.firstName}
                                        onChange={(event) => handleChange(event, 'firstName')}
                                        InputLabelProps={{
                                            disableAnimation: true,
                                            focused: false,
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth style={{marginTop: '10px'}}>
                                    <TextField
                                        placeholder="ENTER YOUR LAST NAME"
                                        required
                                        autoComplete="family-name"
                                        error={!!dataError.lastName}
                                        label="LAST NAME"
                                        helperText={dataError.lastName}
                                        fullWidth
                                        type="text"
                                        value={data.lastName}
                                        onChange={(event) => handleChange(event, 'lastName')}
                                        InputLabelProps={{
                                            disableAnimation: true,
                                            focused: false,
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth style={{marginTop: '10px'}}>
                            <TextField
                                placeholder="ENTER YOUR EMAIL"
                                required
                                autoComplete="email"
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
                        <Grid container spacing={isMobile ? 0 : 4}>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth style={{marginTop: '10px'}}>
                                    <TextField
                                        placeholder="ENTER YOUR PASSWORD"
                                        required
                                        autoComplete="password"
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
                                                        onMouseDown={event => event.preventDefault()}
                                                        edge="end"
                                                    >
                                                        {data.showPassword ? <Typography variant="body2">HIDE</Typography> : <Typography variant="body2">SHOW</Typography>}
                                                    </IconButton>
                                                </InputAdornment>,
                                            sx: noUppercase
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth style={{marginTop: '10px'}}>
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
                                                        onClick={handleClickShowConfirmPassword}
                                                        onMouseDown={event => event.preventDefault()}
                                                        edge="end"
                                                    >
                                                        {data.showConfirmPassword ? <Typography variant="body2">HIDE</Typography> : <Typography variant="body2">SHOW</Typography>}
                                                    </IconButton>
                                                </InputAdornment>,
                                            sx: noUppercase
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth style={{margin: '10px 0',}}>
                            <FormControlLabel
                                value={data.newsletter}
                                control={
                                    <Checkbox
                                        checked={data.newsletter}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        onChange={() => setData({...data, newsletter: !data.newsletter})}
                                    />}
                                label="SUBSCRIBE TO OUR NEWSLETTER"
                                labelPlacement="end"
                            />
                        </FormControl>
                        <Button variant="contained" color="secondary" fullWidth onClick={handleRegister}>{creatingUser ? <CircularProgress size={15} /> : 'register'}</Button>
                        <Typography style={{marginTop: '5px'}} variant="body1" component="p">
                            BY CLICKING 'REGISTER', YOU AGREE TO OUR <Link color="inherit" href="/legal-area/terms-and-conditions" target="_blank" >TERMS & CONDITIONS AND PRIVACY & COOKIES POLICY.</Link>
                        </Typography>
                    </form>
                )}
            </Grid>
        </Grid>
    )
}

export default Register