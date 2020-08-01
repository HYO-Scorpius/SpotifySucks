import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getCookie } from '../helper';

function RefreshDialog({
    spotifyApi,
    open,
    setOpen,
    setToken
}) {
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const refreshToken = () => {
        let r_token = getCookie('refresh_token');
        let refreshURL = `/refresh/${r_token}`;
        fetch(refreshURL)
        .then(() => {
            let token = getCookie('api_token') || null;
            spotifyApi.setAccessToken(token); 
            setToken(token);
            handleClose();
        })
        .catch((err) => console.log("refresh failed: ", err))
    };
    
    return (
        <div>
            <Dialog 
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                
                <DialogTitle id="alert-dialog-title">{"Session Expired"}</DialogTitle> 

                <DialogContent> 
                    <DialogContentText id="alert-dialog-description"> 
                        Your session expired. To carry on, please click the button below to refresh your access token.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={refreshToken} color="primary" autoFocus> 
                        Refresh
                    </Button> 
                </DialogActions>

            </Dialog>
        </div>
    );
}
    
    
export default RefreshDialog;
    
