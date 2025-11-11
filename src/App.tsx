import { useEffect, useState } from 'react';
import './App.css'
import { getChannelsLike } from "./helper/ChannelHelper";
import List from './components/List';

function App() {

  const [channels, setChannels] = useState<Array<string>>([]);


  useEffect(() => {
    getChannelsLike().then((arrChannelLike) => {
      console.log('data', arrChannelLike.length);
      setChannels([...channels, ...arrChannelLike]);
    });
  }, []);


  const addChannel = () => {
    const newChannel = `Channel ${channels.length + 1}`;
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
          Add
        </button>
      </div>
    </div>
  )
}

export default App
