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
    const newChannel = await likeCurrentChannel();
    console.log('newChannel', newChannel);
    setChannels([...channels, newChannel]);
  };

  return (
    <div className='container'>
      <h1>YouTube Shit</h1>
      <List channels={channels} />
      <div className='div-button'>
        <button
          type='button'
          onClick={addChannel}
          className='btn-like'
        >
          Add Remove
        </button>
      </div>
    </div>
  )
}

export default App
