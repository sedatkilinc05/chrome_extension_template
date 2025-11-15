// import { useState } from "react";
import { useRef, useEffect, useState } from "react";
import { getChannelHandle } from "../helper/ChannelHelper";
import "./List.css";
import ListElement from "./ListElement";

const List = ({ channels }: { channels: string[] }) => {

  const [currentChannel, setCurrentChannel] = useState<string>('');

  const ulRef = useRef<HTMLUListElement>(null);
  const liRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    getChannelHandle().then((channelHandle: string) => {
      console.log('fetched channel handle', channelHandle);
      setCurrentChannel(channelHandle);
    });
    const containerElem = ulRef.current;
    const liElem = liRef.current;
    
    if (liElem && containerElem) {
      liElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (containerElem) {
      containerElem.scrollTo({ top: containerElem.scrollHeight, behavior: 'smooth' });
    }


  }, [currentChannel]);






  return (
    <ul
      className="list-container"
      ref={ulRef}
    >
      {channels.map((channel: string, index: number) => {
        return (
          <ListElement
            channel={channel}
            index={index}
            key={crypto.randomUUID().toString()}
            isCurrent={channel === currentChannel}
            ref={channel === currentChannel ? liRef : undefined}
          />
        )
      })}
    </ul >
  );
}

export default List;