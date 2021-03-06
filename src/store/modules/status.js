import {
  PLAYER_REQ_OPTIONS,
  PLAYER_REQ_PLAY,
  PLAYER_REQ_PAUSE,
  PLAYER_REQ_NEXT,
  PLAYER_REQ_VOLUME,
  PLAYER_STATUS,
  PLAYER_LEAVE,
} from 'shared/actionTypes'

// ------------------------------------
// Actions
// ------------------------------------
export function requestOptions (opts) {
  return {
    type: PLAYER_REQ_OPTIONS,
    payload: opts,
    meta: {
      throttle: {
        wait: 200,
        leading: true,
      }
    },
  }
}

export function requestPlay () {
  return {
    type: PLAYER_REQ_PLAY,
  }
}

export function requestPause () {
  return {
    type: PLAYER_REQ_PAUSE,
  }
}

export function requestPlayNext () {
  return {
    type: PLAYER_REQ_NEXT,
  }
}

export function requestVolume (vol) {
  return {
    type: PLAYER_REQ_VOLUME,
    payload: vol,
    meta: {
      throttle: {
        wait: 200,
        leading: false,
      }
    },
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PLAYER_LEAVE]: (state, { payload }) => ({
    ...state,
    isPlayerPresent: false,
  }),
  [PLAYER_STATUS]: (state, { payload }) => ({
    ...state,
    ...payload,
    isPlayerPresent: true,
  }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  cdgAlpha: 0.5,
  cdgSize: 0.6,
  errorMessage: '',
  historyJSON: '[]', // queueIds in JSON array
  isAlphaSupported: false,
  isAtQueueEnd: false,
  isErrored: false,
  isPlayerPresent: false,
  isPlaying: false,
  position: 0,
  queueId: -1,
  visualizer: {},
  volume: 1,
}

export default function status (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
