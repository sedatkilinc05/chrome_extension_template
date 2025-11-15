// import { useState } from "react";
import { useEffect, useRef, useState } from "react";
import { getChannelHandle } from "../helper/ChannelHelper";
import "./List.css";
import ListElement from "./ListElement";

type ListProps = {
  channels: string[];
  classname: string;
};

// const List = ({ channels, classname }: {channels: string[], classname: string}) => {
const List = ({channels, classname}: ListProps) => {
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


  }, [channels]);






  return (
    <ul
      className={`${classname} list-container`}
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