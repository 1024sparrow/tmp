'use strict';

Traliva.debug = {
    state: true
};
Traliva.init({
    layouts: layouts, // gameplay/layouts.js
    widgets: widgets, // gameplay/widgets.js
    states:{
        initState: initState, // gameplay/init_state.js
        stateSubscribers: [
            GeneticEngineSubscriber,
            GuiLogics
        ]
    }

});
