import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useEffect, useState } from 'react'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Toast({ message, status, when, type }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(status === when) handleClick();
    },[status])

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar anchorOrigin={{ vertical:'top', horizontal:'left' }} open={open} autoHideDuration={6000} onClose={handleClose} >
            <Alert onClose={handleClose} severity={type} sx={{ width: '100%', color:type==='error'?'red':'#00ff00', backgroundColor:'#111111' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}