import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import NaturePeopleIcon from '@mui/icons-material/NaturePeople'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'

export const mainListItems = (
  <React.Fragment>
    <ListItemButton style={{ paddingRight: '-16px' }}>
      <ListItemIcon style={{ marginRight: '-16px' }}>
        <DashboardIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon style={{ marginRight: '-16px' }}>
        <NewReleasesIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText primary="New" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon style={{ marginRight: '-16px' }}>
        <Diversity3Icon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText primary="Communities" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon style={{ marginRight: '-16px' }}>
        <NaturePeopleIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText primary="People" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon style={{ marginRight: '-16px' }}>
        <SwapHorizIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText primary="Transfer" />
    </ListItemButton>
  </React.Fragment>
)

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
)
