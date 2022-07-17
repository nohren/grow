import * as React from 'react';
import { styled } from '@mui/material/styles';
import MUITooltip, { tooltipClasses } from '@mui/material/Tooltip';

//Styled HOC intakes a anonymous component, returns a styled component that then intakes a theme component and finally returns a component that overrides original styles.

const Tooltip = styled((props) => {
  const { className } = props;
  return <MUITooltip {...props} arrow classes={{ popper: className }} />;
})(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    maxWidth: 600,
  },
}));

export default Tooltip;
