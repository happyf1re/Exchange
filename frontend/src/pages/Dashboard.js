import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Modal, TextField, Typography } from '@mui/material';
import ChannelList from '../components/ChannelList';
import ChannelMessages from '../components/ChannelMessages';
import Sidebar from '../components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel, fetchChannels } from '../store/actions/channelActions';

const Dashboard = () => {
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [open, setOpen] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const channels = useSelector((state) => state.channels.channels);

    useEffect(() => {
        if (user) {
            console.log("User found in Dashboard, fetching channels");
            dispatch(fetchChannels());
        } else {
            console.log("No user found in Dashboard");
        }
    }, [dispatch, user]);

    const handleSelectChannel = (channelId) => {
        setSelectedChannel(channelId);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCreateChannel = () => {
        if (channelName && user) {
            console.log('Creating channel with data:', {
                name: channelName,
                creatorUserName: user.userName,
                isPrivate,
                parentId: null,
            });
            dispatch(createChannel({
                name: channelName,
                creatorUserName: user.userName,
                isPrivate,
                parentId: null,
            })).then(() => {
                setChannelName('');
                setIsPrivate(false);
                handleClose();
            }).catch((error) => {
                console.error('Error creating channel:', error);
            });
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <ChannelList onSelectChannel={handleSelectChannel} />
                    <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginTop: 2 }}>
                        Create Channel
                    </Button>
                </Grid>
                <Grid item xs={8}>
                    {selectedChannel && <ChannelMessages channelId={selectedChannel} />}
                </Grid>
            </Grid>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4
                }}>
                    <Typography variant="h6" component="h2">Create New Channel</Typography>
                    <TextField
                        label="Channel Name"
                        fullWidth
                        margin="normal"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateChannel}>
                        Create
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default Dashboard;
