// @flow

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { getFeatureFlag, HELP_BUTTON_ENABLED } from '../../base/flags';
import { translate } from '../../base/i18n';
import { IconHelp } from '../../base/icons';
import { connect } from '../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../base/toolbox/components';
import { openURLInBrowser } from '../../base/util';
import { isVpaasMeeting } from '../../jaas/functions';
import { NOTIFY_CLICK_MODE } from '../constants';

type Props = AbstractButtonProps & {

    /**
     * The URL to the user documentation.
     */
    _userDocumentationURL: string
};

/**
 * Implements an {@link AbstractButton} to open the user documentation in a new window.
 */
class HelpButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.help';
    icon = IconHelp;
    label = 'toolbar.help';
    tooltip = 'toolbar.help';

    /**
     * Handles clicking / pressing the button, and opens a new window with the user documentation.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { _userDocumentationURL, handleClick, notifyMode } = this.props;

        if (handleClick) {
            handleClick();
        }

        if (notifyMode === NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            return;
        }

        sendAnalytics(createToolbarEvent('help.pressed'));
        openURLInBrowser(_userDocumentationURL);
    }
}


/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @returns {Object}
 */
function _mapStateToProps(state: Object) {
    const { userDocumentationURL } = state['features/base/config'].deploymentUrls || {};
    const enabled = getFeatureFlag(state, HELP_BUTTON_ENABLED, true);
    const visible = typeof userDocumentationURL === 'string' && enabled && !isVpaasMeeting(state);

    return {
        _userDocumentationURL: userDocumentationURL,
        visible
    };
}

export default translate(connect(_mapStateToProps)(HelpButton));
