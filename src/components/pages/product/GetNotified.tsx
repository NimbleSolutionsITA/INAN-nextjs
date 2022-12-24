import {ChangeEvent, useState} from "react"
import Button from "../../Button";
import RightDrawer from "../../RightDrawer";
import styled from "@emotion/styled";
import {FormControl, TextField, Typography} from "@mui/material";
import {regExpEmail} from "../../../utils/helpers";
import {WORDPRESS_API_ENDPOINT} from "../../../utils/endpoints";
import { ShopProduct} from "../../../utils/products";

type GetNotifiedProps = {
    isMobile: boolean
    leatherType: string | null
    colorType: string | null
    sizeType: string | null
    itemId: number
    product: ShopProduct

}

const GetNotifiedTitleWrapper = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid;
  margin-bottom: 10px;
`
const GetNotifiedInputWrapper = styled.div`
  padding: 20px 0;
`

const GetNotified = ({ isMobile, leatherType, colorType, sizeType, itemId, product }: GetNotifiedProps) => {
    const [openPreOrder, setOpenPreOrder] = useState(false)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<string | boolean>(false)
    const [emailSuccess, setEmailSuccess] = useState(false)
    const [honeypot, setHoneypot] = useState<boolean |  string>(false)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailError(false)
        setEmail(event.target.value)
    }

    const handleGetNotifiedSubmit = () => {
        if (!email) {
            setEmailError('email is required')
            return
        }
        if (regExpEmail.test(email) && !honeypot) {
            setEmailError(false)
            const formdata = new FormData();
            formdata.append("email", email);
            formdata.append("id", itemId.toString());
            formdata.append("product", product.name);

            if(leatherType) formdata.append('leather', leatherType)
            if(colorType) formdata.append('color', colorType)
            if(sizeType) formdata.append('size', sizeType)

            const requestOptions: RequestInit = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            fetch(`${WORDPRESS_API_ENDPOINT}/contact-form-7/v1/contact-forms/124/feedback`, requestOptions)
                .then(response => response.text())
                .then(() => setEmailSuccess(true))
                .catch(error => console.log('error', error));
        }
        else setEmailError('Invalid email address')
    }

    return (
        <>
            <Button fullWidth color="secondary" variant="contained" onClick={() => setOpenPreOrder(true)}>get notified</Button>
            <RightDrawer open={openPreOrder} setOpen={setOpenPreOrder}>
                <GetNotifiedTitleWrapper>
                    <Typography variant="h3" component="h3">Get notified</Typography>
                </GetNotifiedTitleWrapper>
                {emailSuccess ? (
                    <>
                        <Typography variant={isMobile ? 'h1' : 'h2'} component="h3">Thank you</Typography>
                        <Typography variant="body1" component="p">email submitted succesfully.</Typography>
                        <Typography variant={isMobile ? 'h1' : 'h2'} component="h3">we will notify you when this item is back in stock.</Typography>
                    </>
                ) : (
                    <>
                        <Typography variant="body1" component="p">by entering your email below, you will be notfied when this product is
                            available.</Typography>
                        <GetNotifiedInputWrapper>
                            <FormControl fullWidth>
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
                        </GetNotifiedInputWrapper>
                        <label className="ohnohoney" htmlFor="name" />
                        <input className="ohnohoney" autoComplete="off" type="name" id="name" name="name" placeholder="Your name here" ref={node => setHoneypot(node?.value || false)} />
                        <Button fullWidth color="secondary" variant="contained" type="submit" onClick={handleGetNotifiedSubmit}>Get notified</Button>
                    </>
                )}
            </RightDrawer>
        </>
    )
}

export default GetNotified