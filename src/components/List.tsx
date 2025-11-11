// import { useState } from "react";
import { useRef, useEffect } from "react";
import "./List.css";
const arrChannelsLike = JSON.parse(localStorage.getItem("channels") || "[]");
const arrChannelsDisLike = JSON.parse(localStorage.getItem("dislikechannels") || "[]");



const List = ({ channels }: { channels: string[] }) => {
  // console.log('globals', globals);

  const ulRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const containerElem = ulRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [channels]);

  console.log(arrChannelsLike, arrChannelsDisLike);

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
          <li id={`key_${index}`} key={crypto.randomUUID()} >
            <button type="button" id={channel} onClick={handleChannel} className="btn-channel">{channel}</button>

            <button type="button" id={`${channel}/videos`} onClick={handleChannel} className="btn-channel">Videos</button>
          </li>
        )
      })}

    </ul >
  );
}

export default List;