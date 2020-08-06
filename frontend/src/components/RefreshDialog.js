import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function RefreshDialog({
    spotifyApi,
    open,
    setOpen,
    setToken,
    r_token,
    apiServer
}) {
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const refreshToken = () => {
        let refreshURL = `${apiServer}/refresh/${r_token}`;
        fetch(refreshURL)
        .then(response => response.text())
        .then((data) => {
            document.cookie = `api_token=${data}`;
            spotifyApi.setAccessToken(data); 
            setToken(data);
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
    
