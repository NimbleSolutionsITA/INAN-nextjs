import {ChangeEvent, Dispatch, SetStateAction, useState} from "react"
import MailchimpSubscribe, {EmailFormFields} from "react-mailchimp-subscribe"
import Link from "../../Link";
import {Divider, FormControl, FormControlLabel, TextField, Typography} from "@mui/material";
import {regExpEmail} from "../../../utils/helpers";
import Checkbox from "../../Checkbox";

type NewsletterFormProps = {
    isMobile?: boolean
    isModal?: boolean
    sendFeedback?: Dispatch<SetStateAction<boolean>>
}

const NewsletterForm = ({isMobile, isModal, sendFeedback}: NewsletterFormProps) => {
    const [email, setEmail] = useState('')
    const [consent, setConsent] = useState(false)
    const [subscribed, setSubscribed] = useState(false)
    const [honeypot, setHoneypot] = useState(false)
    const [emailError, setEmailError] = useState<string | null>(null)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailError(null)
        setEmail(event.target.value)
    }

    const submit = (subscribe: (data: EmailFormFields) => void) => {
        if(consent) {
            if (!email) {
                setEmailError('email is required')
                return
            }
            if (regExpEmail.test(email)) {
                if (!honeypot) {
                    setEmailError(null)
                    subscribe({ EMAIL: email })
                    setSubscribed(true)
                    setEmail('THANK YOU FOR SUBSCRIBING')
                    if(isModal && sendFeedback)
                        sendFeedback(true)
                }
            }
            else setEmailError('Invalid email address')
        }
    }

    return (
            <MailchimpSubscribe
                url={process.env.NEXT_PUBLIC_MAILCHIMP || ''}
                render={({ subscribe }) => (
                    <>
                        <div style={{display: 'flex', marginBottom: '5px'}}>
                            {!isMobile && !isModal && <div style={{marginRight: '10px', padding: '6px 0'}}><b>NEWSLETTER</b> |</div>}
                            <div
                                style={{
                                    flexGrow: 1,
                                    position: 'relative',
                                    marginTop: '-3px',
                                }}
                            >
                                <FormControl fullWidth style={{borderBottom: isMobile ? '1px solid #fff' : undefined, paddingBottom: isMobile ? '5px' : undefined, marginBottom: isMobile ? '10px' : undefined}}>
                                    <TextField
                                        placeholder={subscribed ? 'THANK YOU FOR SUBSCRIBING' : 'YOUR EMAIL'}
                                        required
                                        disabled={subscribed}
                                        error={!!emailError}
                                        helperText={emailError}
                                        fullWidth
                                        type="email"
                                        value={email}
                                        onChange={handleChange}
                                        InputProps={{
                                            style: {color: (isMobile || isModal) ? '#fff' : undefined, borderBottom: isMobile ? 'none' : undefined},
                                            disableUnderline: true
                                        }}
                                        InputLabelProps={{
                                            disableAnimation: true,
                                            focused: false,
                                            shrink: true,
                                        }}

                                    />
                                </FormControl>
                                <label className="ohnohoney" htmlFor="name" />
                                <input className="ohnohoney" autoComplete="off" type="name" id="name" name="name" placeholder="Your name here" ref={node => setHoneypot(!!node?.value)} />
                            </div>
                            {!isMobile && !isModal && (
                                <div style={{marginLeft: '10px', padding: '8px 0'}}>
                                    <Link color="secondary" href={process.env.NEXT_PUBLIC_INSTAGRAM || ''} target="_blank" rel="noopener noreferrer">
                                        <b>Instagram</b>
                                    </Link>
                                </div>
                            )}
                        </div>
                        {(email || isModal) && (
                            <>
                                <Divider style={{backgroundColor: isModal ? '#fff' : undefined}} />
                                <div style={{marginBottom: '30px'}}>
                                    {subscribed ? <Typography variant="h2">THANK YOU</Typography> : (
                                        <>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={consent}
                                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                                        onChange={() => setConsent(!consent)}
                                                    />}
                                                label={<Typography color="primary.dark">i have read, understood and agree to the <Link isUnderline color="primary.dark" href="/legal-area/privacy-policy">privacy and data protection policy</Link></Typography>}
                                                labelPlacement="end"
                                            />
                                            {consent && <Link style={{float: 'right', color: (isMobile || isModal) ? '#fff' : '#000', fontWeight: 'bold'}} onClick={e => submit(subscribe)}>SUBSCRIBE</Link>}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            />
    )
}

export default NewsletterForm