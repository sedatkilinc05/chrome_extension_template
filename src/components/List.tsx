// import { useState } from "react";
import { useRef, useEffect, useState } from "react";
import { getChannelHandle } from "../helper/ChannelHelper";
import "./List.css";

const List = ({ channels }: { channels: string[] }) => {

  const [currentChannel, setCurrentChannel] = useState<string>('');

  const ulRef = useRef<HTMLUListElement>(null);
  const liRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    getChannelHandle().then((channelHandle: string) => {
      console.log('fetched channel handle', channelHandle);
      // arrHandle.push(channelHandle);
      setCurrentChannel(channelHandle);
    });
    const containerElem = ulRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }

    const liElem = liRef.current;
    if (liElem && containerElem) {
      const scrollValue = liElem.getAttribute('data-scrollvalue');
      if (scrollValue) {
        containerElem.scrollTop = parseInt(scrollValue, 10) - 53;
      }
    }


  }, [channels]);




  const handleChannel = (event: React.MouseEvent<HTMLButtonElement>) => {
    const channelId = event.currentTarget.id.split('/')[0];
    const urlPart = channelId.startsWith('@') ? `${event.currentTarget.id}` : `channel/${event.currentTarget.id}`;
    const channelUrl = `https://youtube.com/${urlPart}`
    console.log('channel Url', channelUrl);
    window.open(channelUrl, '_blank');
  }

  return (
    <ul
      className="list-container"
      ref={ulRef}
    >
      {channels.map((channel: string, index: number) => {
        return (
          <li
            id={`key_${index}`}
            className={(channel === currentChannel) ? 'channel-current' : 'channel-other'}
            data-scrollvalue={65 * index}
            key={crypto.randomUUID()}
            ref={(channel === currentChannel) ? liRef : null}
          >
            <button type="button" id={channel} onClick={handleChannel} className="btn-channel">{channel}</button>
            <button type="button" id={`${channel}/videos`} onClick={handleChannel} className="btn-channel">Videos</button>
          </li>
        )
      })}
    </ul >
  );
}

export default List;