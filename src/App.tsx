import { useEffect, useState } from 'react';
import './App.css'
import { getChannelsLike, likeCurrentChannel } from "./helper/ChannelHelper";
import List from './components/List';

function App() {

  const [channels, setChannels] = useState<Array<string>>([]);


  useEffect(() => {
    
    getChannelsLike().then((arrChannelLike) => {
      console.log('data', arrChannelLike.length);
      setChannels((prevChannels) => [...prevChannels, ...arrChannelLike]);
    });
  }, []);


   const addChannel = async () => {
    const arrNewChannel = await likeCurrentChannel();
    console.log('newChannel', arrNewChannel);
    setChannels(arrNewChannel);
  };

  return (
    <div className='container'>
      <div>
        <h1>YouTubers to like 👍🏽 & support</h1>
      </div>
      
      <List channels={channels} />
      <div className='div-button'>
        <button
          type='button'
          onClick={addChannel}
          className='btn-like'
        >
          Add 👍🏽 Remove
        </button>
      </div>
    </div>
  )
}

export default App
