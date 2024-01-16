import { Box, Tooltip, tooltipClasses, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import WorkIcon from '@mui/icons-material/Work';
import classes from './custom-tooltip.module.scss'
import { Theme } from "../../theme/theme";
import i18n from "../../i18n";
const CustomTooltip = styled(({ className, data, ...props }: any) => (
    <Tooltip sx={{direction:i18n.dir(i18n.language)}} arrow {...props} classes={{arrow:classes.arrow, popper: className}} className={classes.tooltipDirectionRtl} title={
        <React.Fragment>
            <Box sx={{display:"flex", gap:"1rem"}}>
                <PersonIcon /> 
                <Typography color="inherit">{data.name}</Typography>
            </Box>
            <Box sx={{display:"flex", gap:"1rem"}}>
                <MailIcon /> 
                <Typography color="inherit">{data.email}</Typography>
            </Box>
            <Box sx={{display:"flex", gap:"1rem"}}>
                <WorkIcon /> 
                <Typography color="inherit">{data.position}</Typography>
            </Box>
            
        </React.Fragment>}
    >
        
        {props.children}
    </Tooltip>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'rgba(80, 93, 111, 1)',
      color: Theme.palette.text.primary,
      padding:"0.5rem 1rem",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      direction:i18n.dir(i18n.language)
    },
    [`& .${tooltipClasses.arrow}::before`]:{
        backgroundColor: 'rgba(80, 93, 111, 1)'
    }
  }));

  export default CustomTooltip
  