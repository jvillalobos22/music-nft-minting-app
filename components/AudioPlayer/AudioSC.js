import styled from 'styled-components';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const VolumeOffIconSC = styled(VolumeOffIcon)`
  color: #fff;
  font-size: 20px;
`;

const VolumeDownIconSC = styled(VolumeDownIcon)`
  color: #fff;
  font-size: 20px;
`;

const VolumeUpIconSC = styled(VolumeUpIcon)`
  color: #fff;
  font-size: 20px;
`;

const PauseIconSC = styled(PauseIcon)`
  color: #01ff95;
  font-size: 48px;
`;

const PlayArrowIconSC = styled(PlayArrowIcon)`
  color: #01ff95;
  font-size: 48px;
`;

const SkipNextIconSC = styled(SkipNextIcon)`
  color: #01ff95;
  font-size: 48px;
`;

const SkipPreviousIconSC = styled(SkipPreviousIcon)`
  color: #01ff95;
  font-size: 48px;
`;

const VolumeSlider = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justif-content: center;

  input[type='range'] {
    margin: 0 0.5rem;
  }

  input[type='range'] {
    width: 100%;
    min-width: 100px;
    background-color: transparent;
    -webkit-appearance: none;
  }

  input[type='range']:focus {
    outline: none;
  }

  input[type='range']::-webkit-slider-runnable-track {
    /* background: rgb(18, 18, 18); */
    background: rgb(69, 69, 69);
    border: 0;
    width: 100%;
    height: 12px;
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-thumb {
    margin-top: 0px;
    width: 18px;
    height: 12px;
    background: #01ff95;
    border: 0;
    cursor: pointer;
    -webkit-appearance: none;
  }

  input[type='range']:focus::-webkit-slider-runnable-track {
    /* background: rgb(18, 18, 18); */
    background: rgb(69, 69, 69);
  }

  input[type='range']::-moz-range-track {
    /* background: rgb(18, 18, 18); */
    background: rgb(69, 69, 69);
    border: 0;
    width: 100%;
    height: 12px;
    cursor: pointer;
  }

  input[type='range']::-moz-range-thumb {
    width: 18px;
    height: 12px;
    background: #01ff95;
    border: 0;
    cursor: pointer;
  }

  input[type='range']::-ms-track {
    background: transparent;
    border-color: transparent;
    border-width: 0px 0;
    color: transparent;
    width: 100%;
    height: 12px;
    cursor: pointer;
  }

  input[type='range']::-ms-fill-lower {
    background: #01ff95;
    border: 0;
  }

  input[type='range']::-ms-fill-upper {
    background: rgb(69, 69, 69);
    border: 0;
  }

  input[type='range']::-ms-thumb {
    width: 18px;
    height: 12px;
    background: #01ff95;
    border: 0;
    cursor: pointer;
    margin-top: 0px;
    /*Needed to keep the Edge thumb centred*/
  }

  input[type='range']:focus::-ms-fill-lower {
    background: rgb(69, 69, 69);
  }

  input[type='range']:focus::-ms-fill-upper {
    background: rgb(69, 69, 69);
  }

  /*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
how to remove the virtical space around the range input in IE*/
  @supports (-ms-ime-align: auto) {
    /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
    input[type='range'] {
      margin: 0;
      /*Edge starts the margin from the thumb, not the track as other browsers do*/
    }
  }
`;

export {
  PauseIconSC,
  PlayArrowIconSC,
  SkipNextIconSC,
  SkipPreviousIconSC,
  VolumeOffIconSC,
  VolumeDownIconSC,
  VolumeUpIconSC,
  VolumeSlider
};
