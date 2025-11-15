
/*
interface Result {
    documentId: string;
    frameId: number;
    result: string;
}
*/
export const OPT_LIKE = {
    like: 'like',
    dislike: 'dislike'
}

const arrLikeChannel: string[] = [];
// const arrDislikeChannel : string[] = [];

const getLocalStorage = (): string => {
    console.log("document = ", document, chrome);
    return localStorage.getItem("channels") || "[]";
}

const setLocalStorageChannel = (...args: string[]): string => {
    console.log('sz_channel', args[0]);
    localStorage.channels = args[0]
    return localStorage.channels
}

function clickLikeButton(): string {
    const btnLike: HTMLButtonElement = (document.querySelectorAll('#segmented-like-button ytd-toggle-button-renderer yt-button-shape button')[0] || document.querySelectorAll('.watch-active-metadata .ytd-toggle-button-renderer button#button.yt-icon-button')[0] || document.querySelectorAll('segmented-like-dislike-button-view-model like-button-view-model > toggle-button-view-model button')[0]) as HTMLButtonElement;
    console.log('btnLike', btnLike);
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
    console.log('btnDisLike', btnLike);
    if (btnDisLike === null)
        return '';
    btnDisLike.click();
    return btnDisLike.ariaPressed?.toString() || '';
}


async function clickLike(opts = OPT_LIKE.like) {
    console.log('opts', opts);
    if (opts === OPT_LIKE.like) {
        return await executeScriptOnPage(clickLikeButton);
    } else {
        return await executeScriptOnPage(clickDislikeButton);
    }
}

function getChannelLink(): string {
    // const link2channel: HTMLAnchorElement = document.querySelector('#owner ytd-video-owner-renderer ytd-channel-name a') as HTMLAnchorElement;
    const link2channel: HTMLLinkElement =  document.querySelector("a#header") as HTMLLinkElement;
    console.log('link2channel', link2channel);
    return link2channel.href || '';
}

export async function getChannelHandle():Promise<string> {
    const link2channel:string = await executeScriptOnPage(getChannelLink)
    console.log('link2channel', link2channel);
    return link2channel.split('/').pop() ||'';
}

function addHandleToChannel(handle: string, arrChannel: string[]): string {
    console.log('addHandleToChannel handle', handle, 'arrChannel', arrChannel);
    if (arrChannel.indexOf(handle) > -1) {
            return '';
        }
    arrChannel.push(handle);
    return JSON.stringify(arrChannel);
}

async function updateLikeChannels(szLikeChannel: string) {
    const szChannels = await executeScriptOnPage(setLocalStorageChannel, szLikeChannel);
    console.log(szChannels);
    return szChannels;
}

export async function likeCurrentChannel(): Promise<string> {
    const pressed = await clickLike(OPT_LIKE.like);
    console.log('pressed', pressed);
    const channelHandle: string = await getChannelHandle();

    const szLikeChannel = addHandleToChannel(channelHandle, arrLikeChannel);
    if (szLikeChannel === '') {
        return '';
    }
    const szChannels = await updateLikeChannels(szLikeChannel);
    console.log('szChannels', szChannels);
    return channelHandle
}

// Object.keys(localStorage)


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



export async function getChannelsLike(): Promise<string[]> {
    const szChannels = await executeScriptOnPage(getLocalStorage);
    const result = JSON.parse(szChannels);
    arrLikeChannel.push(...result);
    return result || [];
}

export async function getChannelsLikeX(): Promise<string[]> {
    const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    const results = await chrome.scripting.executeScript<string[], unknown>({
        target: {
            tabId: tabs[0].id || 0
        },
        func: (): string[] => {
            console.log("document = ", document);
            return JSON.parse(localStorage.channels);
        }
    });
    return (results[0].result as string[]);
}


// const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function logit(...args: unknown[]) {
    console.log('[SEDAT•YouTube-Like]:', ...args);
}

logit('Start');

let pressedAltR = false;

let btnLike: HTMLButtonElement;
let btnDisLike: HTMLButtonElement;

// const arrEventType: string[] = [ 'loadstart', 'play', 'playing', 'load', 'selectionchange', 'canplay', 'change', 'slotchange' ];
const arrChannels: string[] = [];
const arrDislikeChannels: string[] = [];

let currentChannel = '';
let currentTitle = getTitle();

if (localStorage.getItem('channels') === null) {
    saveChannel('@SedatKPunkt');
    saveChannel('@garipthecat2067');
} else {
    arrChannels.push(...JSON.parse(localStorage.getItem('channels') || ''))
}

if (localStorage.getItem('dislikechannels') !== null) {
    arrDislikeChannels.push(...JSON.parse(localStorage.getItem('dislikechannels') || ''))
}

const loadListener = (ev: Event) => {
    logit(' Event ' + ev.type + '•' + ev.target + '.addEventListener', ev);
    findChannelName(ev.target + '.' + ev.type);
    lookForLikeButton(0);
    removeAdRendererAll();
}

const keyUpListener = (ev: KeyboardEvent) => {
    logit('keyup event object', ev);

    findChannelName('onkeyup');

    if (ev.altKey === false) {
        return;
    };

    logit('alt key down', ev);

    switch (ev.code) {
        case 'KeyL':
            handleChannel(currentChannel, !ev.shiftKey);
            pressedAltR = false;
            break;
        case 'KeyR':
            pressedAltR = true;
            break;
        case 'KeyA':
            if (pressedAltR) {
                resetAllChannels();
                logit('all DISLIKED-channels reseted', localStorage.channels, localStorage.dislikechannels)
            } else {
                logit('Press Alt-R then Alt-A to delete all channels');
            }
            pressedAltR = false;
            break;
        case 'KeyC':
            if (pressedAltR) {
                resetLikedChannels();
                logit('all DISLIKED-channels reseted', localStorage.channels, localStorage.dislikechannels)
            } else {
                logit('Press Alt-R then Alt-C to delete all LIKE-channels');
            }
            pressedAltR = false;
            break;
        case 'KeyD':
            if (pressedAltR) {
                resetDislikedChannels();
                logit('all DISLIKED-channels reseted', localStorage.channels, localStorage.dislikechannels)
            } else {
                logit('Press Alt-R then Alt-D to delete all DISLIKE-channels');
            }
            pressedAltR = false;
            break;
        default:
            pressedAltR = false;
            break
    }
}
document.addEventListener('load', loadListener);

// transitionend
document.addEventListener('transitionend', loadListener);

document.addEventListener('keyup', keyUpListener);
// window.onkeyup = keyUpListener;
function findChannelName(from = 'default') {
    logit('findChannelName', from);
    let found = false;

    currentTitle = getTitle();
    logit('currentTitle', currentTitle);
    logit('saveTitle', saveTitle());

    const allAnchorTagsChannel = $$('a[href^="/c"]');
    logit('allAnchorTagsChannel.length', allAnchorTagsChannel.length);

    const allAnchorTagsChannelName = $$('ytd-video-owner-renderer.ytd-watch-metadata  > div.ytd-video-owner-renderer  > ytd-channel-name.ytd-video-owner-renderer  > div.ytd-channel-name  > div.ytd-channel-name  > yt-formatted-string.ytd-channel-name.complex-string  > a.yt-simple-endpoint.yt-formatted-string');
    logit('allAnchorTagsChannelName.length', allAnchorTagsChannelName.length);

    if (!found && foundChannelName()) {
        logit('currentChannel', currentChannel);
        if (arrChannels.indexOf(currentChannel) > -1) {
            lookForLikeButton(1);
        }
        if (arrDislikeChannels.indexOf(currentChannel) > -1) {
            lookForLikeButton(2);
        }
        found = true;
    }
}

function foundChannelName(): boolean {
    currentChannel = isShorts() ? getChannelNameShorts() : getChannelName();
    return currentChannel !== '';
}

function getChannelName(): string {
    let channelName = '';
    const allAnchorTagsChannelName: NodeListOf<HTMLAnchorElement> = $$('ytd-video-owner-renderer.ytd-watch-metadata  > div.ytd-video-owner-renderer  > ytd-channel-name.ytd-video-owner-renderer  > div.ytd-channel-name  > div.ytd-channel-name  > yt-formatted-string.ytd-channel-name.complex-string  > a.yt-simple-endpoint.yt-formatted-string');
    if (allAnchorTagsChannelName !== undefined && allAnchorTagsChannelName.length > 0) {
        const arrChannelURL = allAnchorTagsChannelName[0].href.split('/');
        channelName = arrChannelURL.pop() || '';
    }
    return channelName;
}

function getChannelNameShorts(): string {
    let channelName = '';
    const allAnchorTagsChannelName: NodeListOf<HTMLAnchorElement> = $$('yt-reel-channel-bar-view-model a');
    if (allAnchorTagsChannelName !== undefined && allAnchorTagsChannelName.length > 0) {
        //channelName = allAnchorTagsChannelName[0].href.replace(location.protocol+'//'+location.host+'/', '').replace('/shorts', '');
        const arrChannelURL = allAnchorTagsChannelName[0].href.split('/');
        channelName = arrChannelURL.pop() || '';
        if (channelName === 'shorts') {
            channelName = arrChannelURL.pop() || '';
        }
    }
    return channelName;
}

function lookForLikeButton(action: number, prevState = false) {
    logit('lookForLikeButton', 'action = ' + action);

    if (isShorts()) { setLikeDisLikeButtonsShorts() } else { setLikeDislikeButtons() }

    if (btnLike && btnDisLike) {
        logit('btnLike = ', btnLike, "btnDisLike", btnDisLike);
        switch (action) {
            case 1:
                logit('lookForLikeButton • btnLike is', btnLike.children[0].children[0].classList.contains('style-default-active'));;
                if (btnLike.ariaPressed === prevState.toString()) {

                    btnLike.click();
                }
                break;
            case 2:
                logit('lookForDisLikeButton • btnDisLike is', btnLike.children[0].children[0].classList.contains('style-default-active'));;
                if (btnDisLike.ariaPressed === prevState.toString()) {

                    btnDisLike.click();
                }
                break;
            default:
                logit('lookForLikeButton • 1 btnLike is', btnLike.children[0].children[0].classList.contains('style-default-active'));
                break;
        }
    }
}

function setLikeDislikeButtons() {
    const tmpBtnLike = ($$('#segmented-like-button ytd-toggle-button-renderer yt-button-shape button')[0])
        || $$('.watch-active-metadata .ytd-toggle-button-renderer button#button.yt-icon-button')[0]
        || $$('segmented-like-dislike-button-view-model like-button-view-model > toggle-button-view-model button')[0];
    btnLike = tmpBtnLike as HTMLButtonElement;
    const tmpBtnDislike = $$('#segmented-dislike-button ytd-toggle-button-renderer yt-button-shape button')[0]
        || $$('.watch-active-metadata .ytd-toggle-button-renderer button#button.yt-icon-button')[1]
        || $$('segmented-like-dislike-button-view-model dislike-button-view-model > toggle-button-view-model button')[0];
    btnDisLike = tmpBtnDislike as HTMLButtonElement;
}

function setLikeDisLikeButtonsShorts() {
    const arrButtons = $$('ytd-like-button-renderer yt-button-shape button');
    const tmpBtnLike = arrButtons[0];
    btnLike = tmpBtnLike as HTMLButtonElement;
    const tmpBtnDislike = arrButtons[1];
    btnDisLike = tmpBtnDislike as HTMLButtonElement;
}

function isShorts() {
    let isShort = false;
    const result = location.href.match('shorts');
    if (result != null && result.length > 0) { isShort = true; };
    return isShort;
}

function handleChannel(channelName: string, like: boolean) {
    if (channelName === "") {
        return;
    }
    if (like && arrChannels.indexOf(channelName) < 0) {
        saveChannel(channelName);
        removeDislikeChannel(channelName);
        lookForLikeButton(1, false);
    } else if (like) {
        removeChannel(channelName);
        lookForLikeButton(1, true);
    } else if (!like && arrDislikeChannels.indexOf(channelName) < 0) {
        saveDislikeChannel(channelName);
        removeChannel(channelName);
        lookForLikeButton(2, false);
    } else {
        removeDislikeChannel(channelName);
        lookForLikeButton(2, true);
    }
}

function saveChannel(channelName: string) {
    if (arrChannels.indexOf(channelName) > -1) {
        return;
    }
    arrChannels.push(channelName);
    localStorage.setItem('channels', JSON.stringify(arrChannels));
}

function saveDislikeChannel(channelName: string) {
    if (arrDislikeChannels.indexOf(channelName) > -1) {
        return;
    }
    arrDislikeChannels.push(channelName);
    localStorage.setItem('dislikechannels', JSON.stringify(arrDislikeChannels));
}

function resetLikedChannels() {
    arrChannels.splice(0, arrChannels.length);
    localStorage.setItem('channels', JSON.stringify(arrChannels));
    saveChannel('@SedatKPunkt');
    saveChannel('@garipthecat2067');
}

function resetDislikedChannels() {
    arrDislikeChannels.splice(0, arrDislikeChannels.length);
    localStorage.setItem('dislikechannels', JSON.stringify(arrDislikeChannels));
}

function resetAllChannels() {
    resetLikedChannels();
    resetDislikedChannels();
}

function removeChannel(channelName: string) {
    if (arrChannels.indexOf(channelName) < 0) {
        return;
    }
    arrChannels.splice(arrChannels.indexOf(channelName), 1);
    localStorage.setItem('channels', JSON.stringify(arrChannels));
}

function removeDislikeChannel(channelName: string) {
    if (arrDislikeChannels.indexOf(channelName) < 0) {
        return;
    }
    arrDislikeChannels.splice(arrDislikeChannels.indexOf(channelName), 1);
    localStorage.setItem('dislikechannels', JSON.stringify(arrDislikeChannels));
}

function getTitle() {
    return document.title.replace(/^\(\d*\)\s/, '');
}

function saveTitle() {
    currentTitle = getTitle();
    logit(' saveTitle• CurrentTitle', currentTitle);
    return currentTitle;
}

/* function isNewVideo(): boolean {
    return (currentTitle !== getTitle());
}

function removeAdRenderer() {
    const adRenderer = $('#rendering-content');
    if (adRenderer != null) {
        adRenderer.remove();
    }
}
 */
function removeAdRendererAll() {
    const nlAdRenderer = $$('#rendering-content');
    nlAdRenderer.forEach(adRenderer => { adRenderer.remove() });
}

/* function ExecuteOnEachAdRenderer(onElementExecute: (element: Element) => void) {
    const nlAdRenderer = $$('#rendering-content');
    nlAdRenderer.forEach(onElementExecute);
} */