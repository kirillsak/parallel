import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { List, ListItemButton, ListItemText, Stack } from "@mui/material";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import { Divider } from "semantic-ui-react";
import { TxButton } from "../substrate-lib/components";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useCommunity } from './CommunityContext'
import { useSubstrateState } from '../substrate-lib';


function AddAdminDialog() {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = useState(null)
  const [newAdmin, setNewAdmin] = useState('');
  const { selectedCommunity } = useCommunity()
  const { currentAccount } = useSubstrateState()

  const handleClickOpen = () => {
    setOpen(true);
    console.log(currentAccount)
    console.log(selectedCommunity.id)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setNewAdmin(event.target.value);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add admin
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: 'black' }}>Add admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="account"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={newAdmin} // controlled input
            onChange={handleInputChange} // handle the input change
            inputProps={{ style: { color: 'black' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <TxButton label="Submit" setStatus={setStatus} type="SIGNED-TX" attrs={{
            palletRpc: 'communities',
            callable: 'addAdmin',
            inputParams: [selectedCommunity.id, newAdmin],
            paramFields: [true, true],
          }} />
          <div style={{ overflowWrap: 'break-word', color: 'black' }}>{status}</div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function RemoveAdminDialog() {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = useState(null)
  const [removeAdmin, setRemoveAdmin] = useState('');
  const { selectedCommunity } = useCommunity()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setRemoveAdmin(event.target.value);
  };


  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Remove admin
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: 'black' }}>Remove admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="account"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={removeAdmin} // controlled input
            onChange={handleInputChange} // handle the input change
            inputProps={{ style: { color: 'black' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <TxButton label="Submit" setStatus={setStatus} type="SIGNED-TX" attrs={{
            palletRpc: 'communities',
            callable: 'removeAdmin',
            inputParams: [selectedCommunity.id, removeAdmin],
            paramFields: [true, true],
          }} />
          <div style={{ overflowWrap: 'break-word', color: 'black' }}>{status}</div>
        </DialogActions>
      </Dialog>
    </div>
  );
}


function AdminsCard() {
  const { communityHead, admins } = useCommunity()

  return (
    <Card sx={{ backgroundColor: "#171717", borderRadius: "30px" }}>
      <Box
        paddingTop={2}
        paddingBottom={2}
        paddingLeft={3}
        paddingRight={3}
        minWidth={290}
      >
        <Box>
          <Box
            display="flex"
            justifyContent="center"
          >
            <Typography variant="h1" component="h1" sx={{ fontSize: "2.5rem" }}>
              Community Leadership
            </Typography>
          </Box>
        </Box>
        <Box paddingLeft={2}>
          <Box
            display="flex"
            justifyContent="flex-start"
          >
            <Typography variant="h2" component="h1" sx={{ fontSize: "2rem" }}>
              HEAD
            </Typography>
          </Box>
        </Box>
        <Divider />
        <List>
          <ListItemButton sx={{ borderRadius: '50px' }}>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={communityHead} />
          </ListItemButton>
        </List>
        <Box paddingLeft={2} marginTop={4}>
          <Box
            display="flex"
            justifyContent="flex-start"
          >
            <Typography variant="h2" component="h1" sx={{ fontSize: "2rem" }}>
              ADMINS
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box>
          <List>
            {admins.map((item, index) => (
              <ListItemButton key={index} sx={{ borderRadius: '50px' }}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Divider />
        <Stack direction="row" spacing={2}>
          <AddAdminDialog />
          <RemoveAdminDialog />
        </Stack>
      </Box>

    </Card>
  );
}

export default AdminsCard;
