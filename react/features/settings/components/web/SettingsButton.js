// @flow

import { createToolbarEvent, sendAnalytics } from '../../../analytics';
import { translate } from '../../../base/i18n';
import { IconSettings } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox/components';
import { NOTIFY_CLICK_MODE } from '../../../toolbox/constants';
import { openSettingsDialog } from '../../actions';
import { SETTINGS_TABS } from '../../constants';

/**
 * The type of the React {@code Component} props of {@link SettingsButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The default tab at which the settings dialog will be opened.
     */
    defaultTab: string,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * An abstract implementation of a button for accessing settings.
 */
class SettingsButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.Settings';
    icon = IconSettings;
    label = 'toolbar.Settings';
    tooltip = 'toolbar.Settings';

    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const {
            defaultTab = SETTINGS_TABS.DEVICES,
            dispatch,
            handleClick,
            notifyMode
        } = this.props;

        if (handleClick) {
            handleClick();
        }

        if (notifyMode === NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            return;
        }

        sendAnalytics(createToolbarEvent('settings'));
        dispatch(openSettingsDialog(defaultTab));
    }
}

export default translate(connect()(SettingsButton));
