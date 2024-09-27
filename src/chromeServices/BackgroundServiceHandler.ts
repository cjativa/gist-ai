import { ContextMenuHandler } from './ContextMenuHandler';

/** Perform generating of our context menu items  */
chrome.runtime.onInstalled.addListener(
  ContextMenuHandler.generateContextMenuItems
);

/** When using a service worker or background script, we can only use the generic
 * `chrome.contextMenus.onClicked.addListener` callback
 */
chrome.contextMenus.onClicked.addListener(
  ContextMenuHandler.handleContextMenuItemClick
);
