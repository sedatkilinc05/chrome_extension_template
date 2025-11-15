import { useEffect, useState } from 'react';
import './App.css'
import { getChannels, likeCurrentChannel } from './helper/ChannelHelper';
import List from './components/List';

function App() {

  const [channels, setChannels] = useState<Array<string>>([]);
  const [isLikeList, setIsLikeList] = useState<boolean>(true);


  useEffect(() => {
    console.log('isLikeList', isLikeList);
    getChannels(isLikeList ? 'channels' : 'dislikechannels').then((arrChannelLike) => {
      console.log('array', arrChannelLike, arrChannelLike.length);
      setChannels(arrChannelLike);
    });
  }, [isLikeList]);


  const addChannel = async () => {
    const arrNewChannel = await likeCurrentChannel();
    console.log('newChannel', arrNewChannel);
    setChannels(arrNewChannel);
  };

  const toggleList = () => {
    setIsLikeList(!isLikeList);
    document.querySelector('#root')?.setAttribute('class', isLikeList ? 'dislike-mode' : 'like-mode');
  }

  return (
    <div className='container'>
      <div className='div-button'>
        <svg xmlns='http://www.w3.org/2000/svg' id='yt-ringo2-svg_yt10' width='30' height='20' viewBox='0 0 30 20' focusable='false' aria-hidden='true' >
          <g>
            <path d='M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z' fill='#FF0033'></path>
            <path d='M19 10L11.5 5.75V14.25L19 10Z' fill='white'></path>
          </g>
        </svg>
        <h1 className={isLikeList ? 'like-mode' : 'dislike-mode'}>{isLikeList ? 'YouTubers you like 👍🏽' : 'YouTubers you hate 👎🏻'}</h1>
        <button
          type='button'
          onClick={toggleList}
          className='btn btn-toggle'
        >
          {isLikeList ? '➔ DisLikes' : '➔ Likes'}
        </button>
      </div>

      <List channels={channels} classname={isLikeList ? 'like-mode' : 'dislike-mode'} />
      <div className='div-button'>
        <button
          type='button'
          onClick={addChannel}
          className='btn btn-like'
        >
           {isLikeList ? '👍🏻 Add 👍🏽 Remove 👍🏻' : '👎 Add 👎🏻 Remove 👎'} 
        </button>
      </div>
    </div>
  )
}

export default App
