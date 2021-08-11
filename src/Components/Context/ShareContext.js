import React, { createContext, useState, useEffect } from 'react'
import { popupInitialState, shortcodeTypes } from '../../Data';
import fetchData from '../../HelperComponents/fetchData';

export function ShareContextProvider( props ) {
	const [popup, setPopup] = useState(popupInitialState);

	const handleDevicesChange = (id) => {
		let newPopup = JSON.parse(JSON.stringify(popup));
		let { targettingOptions } = newPopup;
		for( let i = 0 ; i < targettingOptions.devices.length ; i++ ) {
			if ( targettingOptions.devices[i].id === id ) {
				targettingOptions.devices[i].checked = ! targettingOptions.devices[i].checked;
				break;
			}
		}

		setPopup(newPopup);
	}

	const saveSettings = () => {
		const ajaxSecurity = document.getElementById('ajaxSecurity').value;
        const post_id = new URLSearchParams(window.location.search).get('post_id');
        const data = {
            security: ajaxSecurity,
            action: 'wpsf_save_share_data',
            post_id,
			share: JSON.stringify({popup})
        };
        const ajaxURL = document.getElementById('ajaxURL').value;
        fetchData( ajaxURL, data )
        .then(data => {
        })
	}

	const handleTriggerPageChange = (e) => {
		let newPopup = JSON.parse(JSON.stringify(popup));
		newPopup.triggerPage = e.target.value;
		setPopup(newPopup);
	}

	useEffect(() => {
		const ajaxSecurity = document.getElementById('ajaxSecurity').value;
        const post_id = new URLSearchParams(window.location.search).get('post_id');
        const data = {
            security: ajaxSecurity,
            action: 'wpsf_get_share_data',
            post_id,
        };
        const ajaxURL = document.getElementById('ajaxURL').value;
        fetchData( ajaxURL, data )
        .then(data => {
			console.log(data);
			if ( data.data.share === '' ) {
				return;
			}
			let share = JSON.parse(data.data.share);
			setPopup(share.popup);
        })
	}, [])

	let state = {
		popup,
		handleDevicesChange,
		saveSettings,
		handleTriggerPageChange
	}

	return (
		<ShareContext.Provider value={{...state}}>
			{props.children}
		</ShareContext.Provider>
	)
}

export const ShareContext = createContext();