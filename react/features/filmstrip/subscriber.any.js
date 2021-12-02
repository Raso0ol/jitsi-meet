// @flow

import logger from '../analytics/logger';
import { StateListenerRegistry } from '../base/redux';

import { updateRemoteParticipants } from './functions';
import { setVisibleRemoteParticipants } from './actions.any';

/**
 * Listens for changes to the screensharing status of the remote participants to recompute the reordered list of the
 * remote endpoints.
 */
StateListenerRegistry.register(
    /* selector */ state => state['features/video-layout'].remoteScreenShares,
    /* listener */ (remoteScreenShares, store) => updateRemoteParticipants(store));

/**
 * Listens for changes to the dominant speaker to recompute the reordered list of the remote endpoints.
 * ...TODO DOC NEEDED
 */
StateListenerRegistry.register(
    /* selector */ state => state['features/base/participants'].dominantSpeaker,
    /* listener */ (dominantSpeaker, store) => {
        updateRemoteParticipants(store);

        const {reducedUI} = store.getState()['features/base/responsive-ui'];

        if(reducedUI){
            _updateSpeakerVisibilityInReducedMode(store,dominantSpeaker);
        }       
    });

///// Working_Area
/**
 * TODO DOC NEEDED
 *  */
StateListenerRegistry.register(
    /* selector */ state => state['features/base/responsive-ui'].reducedUI,
    /* listener */ (reducedUI, store) => {

        if(reducedUI){
            const {dominantSpeaker} = store.getState()['features/base/participants'];

            _updateSpeakerVisibilityInReducedMode(store,dominantSpeaker);
        }
    });


//TODO be more js style
const _updateSpeakerVisibilityInReducedMode = (store,participantId)=>{
    const state = store.getState();
    const { visibleRemoteParticipants, remoteParticipants } = state['features/filmstrip'];

    //Temporary for testing, This is for the sake of handling corner cases like, 
    //speaker suddenly left or all participants have entered mutely
    if(participantId == undefined){
        //TODO
        store.dispatch(setVisibleRemoteParticipants(1,1));
        return;
    }

    const isInTheRange = Array.from(visibleRemoteParticipants).includes(participantId);

    if(!isInTheRange){
        logger.debug("issue10261 dominant speaker is out of range: "+ participantId);
        let speakerIndex = Array.from(remoteParticipants).indexOf(participantId);
        logger.debug("issue10261 index: "+ speakerIndex);
        if(speakerIndex!==-1){
           store.dispatch(setVisibleRemoteParticipants(speakerIndex,speakerIndex));
           logger.debug("issue10261 dominant speaker is updated");
        }            
    }
}
