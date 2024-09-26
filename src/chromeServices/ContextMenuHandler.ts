import { IntentTypes } from '../types';

type ContextTypeItem = {
  id: IntentTypes;
  type: chrome.contextMenus.ContextType;
  handler: (information: chrome.contextMenus.OnClickData) => void;
  label: string;
};

export class ContextMenuHandler {
  /** A map of the context type menu items this class generates */
  public static contextTypes: {
    [id: string]: ContextTypeItem;
  } = {
    [IntentTypes.summarizer]: {
      id: IntentTypes.summarizer,
      type: 'selection',
      handler: ContextMenuHandler.handleContextMenuItemClick,
      label: 'Summarize it',
    },
    [IntentTypes.explainer]: {
      id: IntentTypes.explainer,
      type: 'selection',
      handler: ContextMenuHandler.handleContextMenuItemClick,
      label: "Can you explain this to me like I'm 5?",
    },
    [IntentTypes.actioner]: {
      id: IntentTypes.actioner,
      type: 'selection',
      handler: ContextMenuHandler.handleContextMenuItemClick,
      label: 'Build me an action plan based off this',
    },
    [IntentTypes.rephraser]: {
      id: IntentTypes.rephraser,
      type: 'selection',
      handler: ContextMenuHandler.handleContextMenuItemClick,
      label: 'Rephrase this for me in a way I might say this',
    },
  };

  /** Create listener for the context item typex we want to handle */
  public static generateContextMenuItems() {
    Object.entries(ContextMenuHandler.contextTypes).forEach(
      ([, contextTypeItem]) => {
        chrome.contextMenus.create(
          {
            title: contextTypeItem.label,
            contexts: [contextTypeItem.type],
            id: contextTypeItem.id,
          },
          () => {
            // @ts-ignore chrome.runtime.lastError
            if (chrome.runtime.lastError) {
              console.error(
                // @ts-ignore chrome.runtime.lastError
                'Got expected error: ' + chrome.runtime.lastError.message
              );
            }
          }
        );
      }
    );
  }

  /** Generic handler for the click of a context menu item since we can't pass them
   * individually as part of `chrome.contextMenus.create` API call due to context script usage
   * @param information - Information about the on-click event for the menu item
   */
  public static handleContextMenuItemClick(
    information: chrome.contextMenus.OnClickData
  ) {
    const currentSelectionContent = information.selectionText || '';
    const contextItemId = information.menuItemId.toString();
    const contextItem =
      ContextMenuHandler.getContextItemForIdentifier(contextItemId);
  }

  /** Type-safe way of retrieving the associated ContextTypeItem for a given identifier
   * @param id - The identifier for the item to retrieve
   */
  private static getContextItemForIdentifier(id: string): ContextTypeItem {
    const contextItem = ContextMenuHandler.contextTypes[id];
    if (contextItem === undefined) {
      throw new Error(`No context menu item defined for ID "${id}"`);
    }

    return contextItem;
  }
}

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
