'use strict';

var initState = {
    par_0_0_1: '10', // размер особи
    par_0_0_2: '150',
    par_0_0_3: '50',
    par_0_0_4: '0', // начальная точка (с какого компьютера строим маршрут)
    par_0_0_5: '9', // конечная точка (до какого компьютера строим маршрут)
    par_0_0_1: '10',
    par_0_1_1:{
        current: 'betterWithBetter',
        variants:[
            {
                id: 'betterWithBetter',
                title: 'Лучшие с лучшими'
            },
            {
                id: 'random',
                title: 'Случайно'
            }
        ],
        variants_changed: true
    },
    par_0_2_1: '5',
    par_0_2_2: '3',
    par_0_3_1: '0.06',
    par_0_3_2: '1',
    par_0_3_3:{
        current: 'random',
        variants:[
            {
                id: 'random',
                title: 'Замена на случайный'
            },
            {
                id: 'neighbour',
                title: 'Замена на соседний'
            }
        ],
        variants_changed: true
    },
    par_0_4_1: '50',
    par_0_4_2: '10',
    par_1_1: '150', // размер первой популяции
    bnStage0: true,
    bnStage1: false,
    bnStage2: false,
    bnStage3: false,
    bnStage4: false,
    bnApplyParams: false,
    bnSexPoint1: true,
    bnSexPointN: false,
    bnSexPointRandom: false,
    bnGenerateFirstPopulation: true,
    //firstGeneration: undefined // первая популяция
    firstGenerationHtml: '<p>Ещё не сгенерировано</p>',
    adjacencyMatrix: {
        updateNeeded: true,
        multiplier: '1.0',
        breaksCount: '3',
        jointsCount: '3'
        //matrix: [ [..], [..] ]
    },
    par_3_1_1: '1',
    //bn_3_1: undefined,
    bn_3_2: true,
    curGenerationForOutput: '<не доступно>'
};
