import {ChangeEvent, useState} from 'react'
import { useDispatch, useSelector} from "react-redux"
import {regExpEmail} from "../../../utils/helpers";
import {
    Typography,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    FormControl,
    CircularProgress,
} from "@mui/material"
import Button from "../../../components/Button"
import {RootState} from "../../../redux/store";
import { API_CUSTOMER_ENDPOINT } from "../../../utils/endpoints";
import {setCustomer} from "../../../redux/customerSlice";
import {useIsMobile} from "../../../utils/layout";

const PersonalInfo = () => {
    const customer = useSelector((state: RootState) => state.customer.customer);
    const isMobile = useIsMobile()
    const firstName = customer?.first_name
    const lastName = customer?.last_name
    const email = customer?.email
    const noUppercase = {
        '& .MuiInputBase-input': {
            textTransform: 'none !important',
        }
    }
    const initialState: {
        firstName: string,
        lastName: string,
        email: string,
        newsletter: boolean,
        password: string,
        confirmPassword: string,
        showPassword: boolean,
        showConfirmPassword: boolean,
        changePassword: boolean
    } = {
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        newsletter: false,
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        changePassword: false,
    }
    const [data, setData] = useState(initialState)

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
    const [userUpdated, setUserUpdated] = useState(false)
    const [updatingUser, setUpdatingUser] = useState(false)
    const [error, setError] = useState(false)
    const dispatch = useDispatch()
    const handleChange = (event:  ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setDataError({...dataError, [field]: false})
        setData({...data, [field]: event.target.value})
    }
    const handleClickShowPassword = () => {
        setData({ ...data, showPassword: !data.showPassword });
    };
    const handleClickShowConfirmPassword = () => {
        setData({ ...data, showConfirmPassword: !data.showConfirmPassword });
    };
    function handleCancel() {
        setData(initialState)
    }
    function handleSave() {
        setUpdatingUser(true)
        setDataError({
            email: !data.email ? 'EMAIL IS REQUIRED' : !regExpEmail.test(data.email) && 'PLEASE ENTER A VALID EMAIL ADDRESS',
            firstName: !data.firstName && 'FIRST NAME IS REQUIRED',
            lastName: !data.lastName && 'LAST NAME IS REQUIRED',
            password: data.changePassword && !data.password && 'PASSWORD IS REQUIRED',
            confirmPassword: data.changePassword && data.password !== data.confirmPassword && 'PASSWORD DOES NOT MATCH',
        })
        if (
            customer?.id &&
            data.email &&
            data.firstName &&
            data.lastName &&
            regExpEmail.test(data.email) &&
            (!data.changePassword || (data.password && data.password === data.confirmPassword))
        ) {
            const {email, firstName: first_name, lastName: last_name, password} = data
            fetch(`${API_CUSTOMER_ENDPOINT}/${customer.id}`, {
                method: 'POST',
                headers: [["Content-Type", 'application/json']],
                body: JSON.stringify({
                    email,
                    first_name,
                    last_name,
                    ...(password ? {password} : {})
                })
            })
                .then(r => r.json())
                .then((response => {
                    setUserUpdated(true)
                    if (!response.success) {
                        setError(response.message)
                    }
                    dispatch(setCustomer(response.customer))
                }))
                .finally(() => setUpdatingUser(false))
        }
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
                <form>
                    <Typography variant={isMobile ? 'h2' : 'h1'} component="h1">Personal Info</Typography>
                    {!error && userUpdated && <Typography variant="body1">PERSONAL INFO {data.changePassword && 'AND PASSWORD'} SUCCESSFULLY UPDATED</Typography> }
                    {userUpdated && <Typography variant="body1" color="error">{error}</Typography> }
                    {isMobile && <br />}
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
                    {data.changePassword ? (
                        <>
                            <Typography style={{marginTop: '20px'}} variant="h1" component="h1">Change password</Typography>
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
                                                    onMouseDown={(event) => event.preventDefault()}
                                                    edge="end"
                                                >
                                                    {data.showPassword ? <Typography variant="body2">HIDE</Typography> : <Typography variant="body2">SHOW</Typography>}
                                                </IconButton>
                                            </InputAdornment>,
                                        sx: noUppercase
                                    }}
                                />
                            </FormControl>
                            <FormControl fullWidth style={{margin: '10px 0 20px'}}>
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
                                                    onMouseDown={(event) => event.preventDefault()}
                                                    edge="end"
                                                >
                                                    {data.showConfirmPassword ? <Typography variant="body2">HIDE</Typography> : <Typography variant="body2">SHOW</Typography>}
                                                </IconButton>
                                            </InputAdornment>,
                                        sx: noUppercase
                                    }}
                                />
                            </FormControl>
                        </>
                    ) : (
                        <div style={{padding: '10px 0 20px', textAlign: 'right'}}><Button color="secondary" disableGutters onClick={() => setData({...data, changePassword: true})}>Change password</Button></div>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Button variant="outlined" color="secondary" fullWidth onClick={handleCancel}>cancel</Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button variant="contained" color="secondary" fullWidth onClick={handleSave}>{updatingUser ? <CircularProgress size={15} /> : 'save'}</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}

export default PersonalInfo