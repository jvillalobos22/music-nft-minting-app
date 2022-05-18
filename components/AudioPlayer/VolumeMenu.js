import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import styled from 'styled-components';

const VolumeButton = styled(Button)``;

const StyledMenu = styled(Menu)`
  && {
    input[type='range'] {
      margin: 0.5rem 1rem;
      width: 200px;
      height: 5px;
    }
  }
`;

const VolumeMenu = ({ className }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <VolumeButton
        size="small"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        className={className}
      >
        VOL
      </VolumeButton>
      <StyledMenu
        id="menu-appbar"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorReference="anchorEl"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <input type="range" className="amplitude-volume-slider" />
      </StyledMenu>
    </>
  );
};

VolumeMenu.propTypes = {
  className: PropTypes.string
};

VolumeMenu.defaultProps = {
  className: ''
};

export default VolumeMenu;
