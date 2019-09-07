
import React, { createRef } from 'react';
import track from '../../assets/audio/track.json'
import './style.scss'


interface MusicProps {
  audioUrl: string
}

interface MusicStates {

}


class Music extends React.Component<MusicProps, MusicStates> {
  private audioRef = createRef<HTMLAudioElement>()


  /**
   * audio 不要用source的src, 会出现setState没有效果
   * @private
   */
  private onPlay = () => {
    const audioDOM = this.audioRef.current
    audioDOM && audioDOM.play()
  }


  render () {
    const { audioUrl } = this.props
    return (
      <audio className='audio' src={audioUrl} ref={this.audioRef} ></audio>
    )
  }
}


export default Music;
