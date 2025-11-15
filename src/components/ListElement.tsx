
import { forwardRef, type MouseEvent } from 'react';
import './ListElement.css';

const ListElement = forwardRef<HTMLLIElement, { channel: string, index: number, key: string, isCurrent: boolean }>(({ channel, index, key, isCurrent = true }, ref) => {
    const handleChannel = (event: MouseEvent<HTMLButtonElement>) => {
        const channelId = event.currentTarget.id.split('/')[0];
        const urlPart = channelId.startsWith('@') ? `${event.currentTarget.id}` : `channel/${event.currentTarget.id}`;
        const channelUrl = `https://youtube.com/${urlPart}`
        console.log('channel Url', channelUrl);
        window.open(channelUrl, '_blank');
    }

    return (
        <li
            id={`key_${index}`}
            className={isCurrent ? 'channel-current' : 'channel-other'}
            data-scrollvalue={65 * index}
            key={key}
            ref={ref}
        >
            <div>
                <button type="button" id={channel} onClick={handleChannel} className="btn-channel">{channel}</button>
                <button type="button" id={`${channel}/videos`} onClick={handleChannel} className="btn-channel">Videos</button>
            </div>
        </li>
    );
});

export default ListElement;