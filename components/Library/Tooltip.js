import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover .tooltiptext {
    visibility: visible;
  }
`;

const TooltipHoverMessage = styled.div`
  visibility: hidden;
  width: 440px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 100;
`;

const Tooltip = ({ children, message }) => {
  console.log(children);
  return (
    <TooltipContainer>
      {children}
      <TooltipHoverMessage className="tooltiptext">
        {message}
      </TooltipHoverMessage>
    </TooltipContainer>
  );
};

Tooltip.propTypes = {
  message: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element])
};

Tooltip.defaultProps = {
  message: 'Tooltip Text',
  children: <div />
};

export default Tooltip;
