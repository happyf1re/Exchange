import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import ChannelList from '../components/ChannelList';
import ChannelMessages from '../components/ChannelMessages';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const [selectedChannel, setSelectedChannel] = useState(null);

    const handleSelectChannel = (channelId) => {
        setSelectedChannel(channelId);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <ChannelList onSelectChannel={handleSelectChannel} />
                </Grid>
                <Grid item xs={8}>
                    {selectedChannel && <ChannelMessages channelId={selectedChannel} />}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
