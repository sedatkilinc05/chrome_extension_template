export default chrome.runtime.onInstalled.addListener((...args) => {
    console.log('onInstalled', ...args);

});
