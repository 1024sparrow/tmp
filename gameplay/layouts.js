'use strict';

var layouts = {
    type:'strip',
    orient:'v',
    items: [
        { // панель с кнопками переключения вкладок
            widget:{
                bg: '#fed',
                type: 'strip',
                orient: 'h',
                items: [
                    'tab_0',
                    'tab_1',
                    'tab_2',
                    'tab_3',
                    'tab_4'
                ]
            },
            size: '48px'
        },
        { // Рабочая область: здесь одно над другим располагается содержимое разных вкладок
            widget:{
                type: 'stack',
                items:[
                    { // Содержимое первой вкладки
                        id: 'tab0',
                        type: 'strip',
                        orient: 'v',
                        items:[
                            {
                                widget:{
                                    id: 'itemsFromTab0',
                                    type: 'strip',
                                    orient: 'v',
                                    scroll: 'v',
                                    items:[
                                        { widget: 'title_0_0', size: '48px' }, // title: индекс вкладки, индекс раздела
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_0_1', size: '400px' }, 'item_0_0_1' ], }, size: '48px' },
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_0_2', size: '400px' }, 'item_0_0_2' ], }, size: '48px' },
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_0_3', size: '400px' }, 'item_0_0_3' ], }, size: '48px' },
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_0_4', size: '400px' }, 'item_0_0_4' ], }, size: '48px' },
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_0_5', size: '400px' }, 'item_0_0_5' ], }, size: '48px' },
                                        { widget: 'title_0_1', size: '48px' }, // title: индекс вкладки, индекс раздела
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_1_1', size: '400px' }, 'item_0_1_1' ], }, size: '48px' },
                                        { widget: 'title_0_2', size: '48px' }, // title: индекс вкладки, индекс раздела
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'radio_0_2_1', size: '400px' }, 'item_0_2_1' ], }, size: '48px' },
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'radio_0_2_2', size: '400px' }, 'item_0_2_2' ], }, size: '48px' },
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'radio_0_2_3', size: '400px' }, {type: 'stack', items:[]} ], }, size: '48px' },
                                        { widget: 'title_0_3', size: '48px' }, // title: индекс вкладки, индекс раздела
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_3_1', size: '400px' }, 'item_0_3_1' ], }, size: '48px' },
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_3_2', size: '400px' }, 'item_0_3_2' ], }, size: '48px' },
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_3_3', size: '400px' }, 'item_0_3_3' ], }, size: '48px' },
                                        { widget: 'title_0_4', size: '48px' }, // title: индекс вкладки, индекс раздела
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_4_1', size: '400px' }, 'item_0_4_1' ], }, size: '48px' },
                                        { widget:{ type: 'strip', orient: 'h', items:[ { widget: 'title_0_4_2', size: '400px' }, 'item_0_4_2' ], }, size: '48px' },
                                    ]
                                }
                            },
                            {
                                widget:{
                                    type: 'strip',
                                    orient: 'h',
                                    items:[
                                        {
                                            widget: 'button_0_1',
                                            size: '256px'
                                        }
                                    ]
                                },
                                size: '48px'
                            }
                        ]
                    },
                    { // Содержимое второй вкладки
                        id: 'tab1',
                        type: 'strip',
                        bg: 'rgba(255,255,255,0.2)',
                        orient: 'h',
                        items: [
                            //'left_1',
                            { widget:{ type: 'stack', items:[] }},
                            {
                                widget:{
                                    type: 'strip',
                                    orient: 'v',
                                    items: [
                                        {
                                            widget: 'title_1',
                                            size: '48px'
                                        },
                                        {
                                            widget:{
                                                type: 'strip',
                                                orient: 'h',
                                                items:[
                                                    'title_1_1',
                                                    'item_1_1'
                                                ]
                                            },
                                            size: '48px'
                                        },
                                        {
                                            widget: 'button_1_generate',
                                            size: '48px'
                                        },
                                        {
                                            widget: 'matrix_1'
                                        }
                                    ]
                                },
                                size: '800px'
                            },
                            { widget:{ type: 'stack', items:[] }},
                            //'right_1'
                        ]
                    },
                    {
                        id: 'tab2',
                        type: 'strip',
                        bg: 'rgba(255,255,255,0.2)',
                        orient: 'v',
                        items: []
                    },
                    {// Содержимое четвёртой вкладки (Автоматическое вычисление)
                        id: 'tab3',
                        type: 'strip',
                        bg: 'rgba(255,255,255,0.2)',
                        orient: 'h',
                        items: [
                            { widget:{ type: 'stack', items:[] }},
                            {
                                widget:{
                                    type: 'strip',
                                    orient: 'v',
                                    items: [
                                        {
                                            widget:{
                                                type: 'strip',
                                                orient: 'h',
                                                items: [
                                                    'title_3_1_1', 'item_3_1_1', 'title_3_1_2', 'button_3_1'
                                                ]
                                            },
                                            size: '48px'
                                        },
                                        {
                                            widget: 'title_3_2',
                                            size: '48px'
                                        },
                                        {
                                            widget: 'item_3_2',
                                            size: '48px'
                                        },
                                        {
                                            widget: 'button_3_3',
                                            size: '48px'
                                        },
                                    ]
                                },
                                size: '800px'
                            },
                            { widget:{ type: 'stack', items:[] }}
                        ]
                    },
                    {
                        id: 'tab4',
                        type: 'strip',
                        bg: 'rgba(255,255,255,0.2)',
                        orient: 'v',
                        items: []
                    },
                ]
            }
        }
    ]
};
