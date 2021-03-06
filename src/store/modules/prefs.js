import {
  PREFS_REQUEST,
  PREFS_RECEIVE,
  PREFS_SET,
  PREFS_PUSH,
  PREFS_REQUEST_SCAN,
  PREFS_REQUEST_SCAN_CANCEL,
  SCANNER_WORKER_STATUS,
  SCANNER_WORKER_DONE,
  _ERROR,
} from 'shared/actionTypes'

import { logout } from './user'
import HttpApi from 'lib/HttpApi'
const api = new HttpApi('prefs')

export function setPref (key, data) {
  return {
    type: PREFS_SET,
    payload: { key, data },
  }
}

// ------------------------------------
// Fetch all prefs
// ------------------------------------
export function fetchPrefs () {
  return (dispatch, getState) => {
    // informational
    dispatch({
      type: PREFS_REQUEST,
    })

    return api('GET', '')
      .then(prefs => {
        dispatch(receivePrefs(prefs))

        // sign out if we see isFirstRun flag
        if (prefs.isFirstRun && getState().user.userId !== null) {
          dispatch(logout())
        }
      })
      .catch(err => {
        dispatch({
          type: PREFS_REQUEST + _ERROR,
          error: err.message,
        })
      })
  }
}

// ------------------------------------
// Receive prefs
// ------------------------------------
export function receivePrefs (data) {
  return {
    type: PREFS_RECEIVE,
    payload: data,
  }
}

// ------------------------------------
// request media scan
// ------------------------------------
export function requestScan () {
  return (dispatch, getState) => {
    // informational
    dispatch({
      type: PREFS_REQUEST_SCAN,
    })

    return api('GET', '/scan')
      .catch(err => {
        dispatch({
          type: PREFS_REQUEST_SCAN + '_ERROR',
          error: err.message,
        })
      })
  }
}

// ------------------------------------
// request cancelation of media scan
// ------------------------------------
export function requestScanCancel () {
  return (dispatch, getState) => {
    // informational
    dispatch({
      type: PREFS_REQUEST_SCAN_CANCEL,
    })

    return api('GET', '/scan/cancel')
      .catch(err => {
        dispatch({
          type: PREFS_REQUEST_SCAN_CANCEL + '_ERROR',
          error: err.message,
        })
      })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PREFS_RECEIVE]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [PREFS_PUSH]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [SCANNER_WORKER_STATUS]: (state, { payload }) => ({
    ...state,
    isScanning: true,
    updateText: payload.text,
    updateProgress: payload.progress,
  }),
  [SCANNER_WORKER_DONE]: (state, { payload }) => ({
    ...state,
    isScanning: false,
  }),
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isScanning: false,
  isReplayGainEnabled: false,
  updateText: '',
  updateProgress: 0,
  paths: { result: [], entities: {} },
}

export default function prefsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
