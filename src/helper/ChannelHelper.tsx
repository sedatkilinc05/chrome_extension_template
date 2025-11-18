
let channelHandle: string;
/* export const OPT_LIKE = {
    like: 'like',
    dislike: 'dislike'
} */


const getLocalStorage = (channel: string): string => {
    
    const szLocalStorage = localStorage.getItem(channel) || "[]";
    
    return szLocalStorage;
}

// 0: szLikeChannel, 1: typeChannels, 2: channelHandle
const setLocalStorageChannel = (...args: string[]): string => {
    
    localStorage.setItem(args[1], args[0]);

    // remove channel from other list if existent
    const otherChannels = args[1] === 'channels' ? 'dislikechannels' : 'channels';
    const arrOtherChannels = JSON.parse(localStorage.getItem(otherChannels)|| '[]');
    if (arrOtherChannels.length > 0 && arrOtherChannels.indexOf(args[2]) > -1) {
        arrOtherChannels.splice(arrOtherChannels.indexOf(args[2]), 1);
        localStorage.setItem(otherChannels, JSON.stringify(arrOtherChannels));
    }

    return localStorage.getItem(args[1]) || '';
}

function isClip(): boolean {
    
    let is_clip = false;
    const result = location.href.match('watch');
    if (result != null && result.length > 0) { is_clip = true; };
    
    return is_clip;
}

function isShorts(): boolean {
    let is_short = false;
    const result = location.href.match('shorts');
    if (result != null && result.length > 0) { is_short = true; };
    
    return is_short;
}

function clickLikeButton(): string {
    const btnLike: HTMLButtonElement = (
        document.querySelectorAll('#segmented-like-button ytd-toggle-button-renderer yt-button-shape button')[0] || 
        document.querySelectorAll('.watch-active-metadata .ytd-toggle-button-renderer button#button.yt-icon-button')[0] || 
        document.querySelectorAll('segmented-like-dislike-button-view-model like-button-view-model > toggle-button-view-model button')[0]
    ) as HTMLButtonElement;
    
    if (btnLike === null)
        return '';
    btnLike.click();
    return btnLike.ariaPressed?.toString() || '';
}

function clickDislikeButton(): string {
    const btnDisLike: HTMLButtonElement = (
        document.querySelector('#segmented-dislike-button ytd-toggle-button-renderer yt-button-shape button') ||
        document.querySelectorAll('.watch-active-metadata .ytd-toggle-button-renderer button#button.yt-icon-button')[1] ||
        document.querySelector('segmented-like-dislike-button-view-model dislike-button-view-model > toggle-button-view-model button')
    ) as HTMLButtonElement;
    
    if (btnDisLike === null)
        return '';
    btnDisLike.click();
    return btnDisLike.ariaPressed?.toString() || '';
}


async function clickButton(isLike: boolean) {
    
    if (isLike) {
        return await executeScriptOnPage(clickLikeButton);
    } else {
        return await executeScriptOnPage(clickDislikeButton);
    }
}

function getChannelLink(): string {
    // const link2channel: HTMLAnchorElement = document.querySelector('#owner ytd-video-owner-renderer ytd-channel-name a') as HTMLAnchorElement;
    const link2channel: HTMLLinkElement = document.querySelector("a#header") as HTMLLinkElement;
    
    return link2channel?.href || '';
}

export async function getChannelHandle(): Promise<string> {
    const link2channel: string = await executeScriptOnPage(getChannelLink)
    
    return link2channel?.split('/').pop() || '';
}

function processHandleInChannels(handle: string, arrChannel: string[]): string {
    
    if (arrChannel.indexOf(handle) > -1) {
        arrChannel.splice(arrChannel.indexOf(handle), 1);
    } else {
        arrChannel.push(handle);
    }
    
    return JSON.stringify(arrChannel);
}

async function updateChannels(szLikeChannel: string, typeChannels: string) {
    const szChannels = await executeScriptOnPage(setLocalStorageChannel, szLikeChannel, typeChannels, channelHandle);
    
    return szChannels;
}

export async function isCurrentPageVideoClip(): Promise<boolean> {
    const is_clip = await getWebPageInfo(isClip)
    return is_clip;
}

export async function isCurrentPageShorts(): Promise<boolean> {
    const is_shorts = await getWebPageInfo(isShorts)
    return is_shorts;
}

export async function handleCurrentChannel(arrChannel: string[], isLike: boolean): Promise<string[]> {
    
    await clickButton(isLike);
    
    channelHandle = await getChannelHandle();
    
    const szLikeChannel = processHandleInChannels(channelHandle, arrChannel);
    const szChannels = await updateChannels(szLikeChannel, isLike ? 'channels' : 'dislikechannels');

    return JSON.parse(szChannels) as string[];
}

async function executeScriptOnPage(callback: (...args: string[]) => string, ...args: string[]): Promise<string> {
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const result = await chrome.scripting.executeScript<string[], string>({
        target: {
            tabId: tabs[0].id || 0
        },
        func: callback,
        args: args
    });


    return result[0].result as string;
}


export async function getWebPageInfo<T>(callback: () => T): Promise<T> {
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    const result = await chrome.scripting.executeScript({
        target: {
            tabId: tabs[0].id || 0
        },
        func: callback
    });
    return result[0].result as T;
}



export async function getChannels(channel: string): Promise<string[]> {
    
    const szChannels = await executeScriptOnPage(getLocalStorage, channel);
    const result = JSON.parse(szChannels);
    return result || [];
}
