// import { useState } from "react";
import { useRef, useEffect } from "react";
import { checkChannels } from "../helper/ChannelHelper";
import "./List.css";
const arrChannelsLike = JSON.parse(localStorage.getItem("channels") || "[]");
const arrChannelsDisLike = JSON.parse(localStorage.getItem("dislikechannels") || "[]");



const List = () => {
  // console.log('globals', globals);

  const ulRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const containerElem = ulRef.current;
    if (containerElem) {
      checkChannels(containerElem);
    }
  }, []);
  
  console.log(arrChannelsLike, arrChannelsDisLike);
  return (
    <ul className="list-container" ref={ulRef}>
      {/* {arrChannelsLike.map((channel: string, index: number) => (
        return (<li key={index} style={{ color: "green" }}>
          {channel}
        </li>)
      ))}
      {arrChannelsDisLike.map((channel: string, index: number) => (
        return (<li key={index} style={{ color: "red" }}>
          {channel}
        </li>)
      ))} */}
  {/*     <li style={{ color: "green" }}>Channel 1</li>
      <li style={{ color: "red" }}>Channel 2</li>
      <li style={{ color: "green" }}>Channel 3</li> */}
    </ul >
  );
}

export default List;