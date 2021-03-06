import PropTypes from 'prop-types'
import React from 'react'
import './MP4Player.css'

class MP4Player extends React.Component {
  static propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    mediaId: PropTypes.number.isRequired,
    mediaKey: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onAudioElement: PropTypes.func.isRequired,
    // media events
    onEnd: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onStatus: PropTypes.func.isRequired,
  }

  video = React.createRef()

  componentDidMount () {
    this.props.onAudioElement(this.video.current)
    this.props.onStatus({ isAlphaSupported: false })
    this.updateSources()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.mediaKey !== this.props.mediaKey) {
      this.updateSources()
    }

    if (prevProps.isPlaying !== this.props.isPlaying) {
      this.updateIsPlaying()
    }
  }

  render () {
    const { width, height } = this.props

    return (
      <video styleName='video'
        preload='auto'
        width={width}
        height={height}
        onCanPlayThrough={this.updateIsPlaying}
        onEnded={this.props.onEnd}
        onError={this.handleError}
        onLoadStart={this.props.onLoad}
        onTimeUpdate={this.handleTimeUpdate}
        ref={this.video}
      />
    )
  }

  updateSources = () => {
    this.video.current.src = `/api/media/${this.props.mediaId}?type=video`
    this.video.current.load()
  }

  updateIsPlaying = () => {
    if (this.props.isPlaying) {
      this.video.current.play()
        .then(() => this.props.onPlay())
        .catch(err => this.props.onError(err.message))
    } else {
      this.video.current.pause()
    }
  }

  /*
  * <video> event handlers
  */
  handleError = (el) => {
    const { message, code } = el.target.error
    this.props.onError(`${message} (code ${code})`)
  }

  handleTimeUpdate = () => {
    this.props.onStatus({
      position: this.video.current.currentTime,
    })
  }
}

export default MP4Player
