/* eslint-disable react/jsx-props-no-spreading */
import React, { useReducer } from 'react';

const initialState = { isPlaying: 0, songs: [] };

function audioPlayerReducer(state, action) {
  switch (action.type) {
    case 'setIsPlaying': {
      const { isPlaying } = action.payload;

      return { ...state, isPlaying };
    }
    case 'reset':
      return { ...initialState };
    default:
      throw new Error();
  }
}

const AudioPlayerStateContext = React.createContext(null);
const AudioPlayerDispatchContext = React.createContext(null);

const useAudioPlayer = () => {
  const audioPlayerState = React.useContext(AudioPlayerStateContext);
  const audioPlayerDispatch = React.useContext(AudioPlayerDispatchContext);

  return { audioPlayerState, audioPlayerDispatch };
};

// eslint-disable-next-line react/function-component-definition
const withAudioPlayer = Component => props => {
  const { audioPlayerState, audioPlayerDispatch } = useAudioPlayer();

  return (
    <Component
      {...props}
      audioPlayerState={audioPlayerState}
      audioPlayerDispatch={audioPlayerDispatch}
    />
  );
};

// eslint-disable-next-line react/prop-types
const AudioPlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(audioPlayerReducer, initialState);

  return (
    <AudioPlayerStateContext.Provider value={state}>
      <AudioPlayerDispatchContext.Provider value={dispatch}>
        {children}
      </AudioPlayerDispatchContext.Provider>
    </AudioPlayerStateContext.Provider>
  );
};

export { AudioPlayerProvider, useAudioPlayer, withAudioPlayer };
