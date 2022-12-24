import React, {Dispatch, SetStateAction} from "react";
import {Grid, Dialog as MuiDialog, DialogContent, DialogTitle, DialogContentText, DialogActions} from "@mui/material";
import Button from "./Button";

interface DialogProps {
    isActive: boolean
    onCancel: () => void
    onConfirm: () => void
    message: string
    title?: string
    confirm?: string
    cancel?: string
}

const Dialog = ({isActive, onCancel, onConfirm, message, title = "ILARIA NORSA XX ANGOSTURA", confirm = 'CONFIRM', cancel = "CANCEL"}: DialogProps) => {
    return (
        <MuiDialog
            open={isActive}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                square: true,
            }}
            style={{textAlign: 'center'}}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button fullWidth onClick={onCancel} variant="outlined" color="secondary">
                            {cancel}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth onClick={onConfirm} variant="contained" color="secondary" autoFocus>
                            {confirm}
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </MuiDialog>
    )
}

export default Dialog