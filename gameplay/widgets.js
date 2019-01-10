'use strict';

var widgets = {
    tab_0: {
        constructor: TralivaKit.Button,
        options:{
            title: 'Начальная настройка',
            activeVarName: 'bnStage0'
        }
    },
    tab_1: {
        constructor: TralivaKit.Button,
        options:{
            title: 'Генерация первой популяции',
            activeVarName: 'bnStage1'
        }
    },
    tab_2: {
        constructor: TralivaKit.Button,
        options:{
            title: 'Настройки матрицы смежности',
            activeVarName: 'bnStage2'
        }
    },
    tab_3: {
        constructor: TralivaKit.Button,
        options:{
            title: 'Автоматическое вычисление',
            activeVarName: 'bnStage3'
        }
    },
    tab_4: {
        constructor: TralivaKit.Button,
        options:{
            title: 'Пошаговое вычисление',
            activeVarName: 'bnStage4'
        }
    },
    title_0_0:{ constructor: TralivaKit.Label, options:{ bg: '#aaa', color: '#800', text: 'Базовые настройки' } },
    title_0_0_1:{ constructor: TralivaKit.Label, options:{ text: 'Размер особи:' } },
    item_0_0_1:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_0_1' } },
    title_0_0_2:{ constructor: TralivaKit.Label, options:{ text: 'Количество циклов:' } },
    item_0_0_2:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_0_2' } },
    title_0_0_3:{ constructor: TralivaKit.Label, options:{ text: 'Размер популяции:' } },
    item_0_0_3:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_0_3' } },
    title_0_0_4:{ constructor: TralivaKit.Label, options:{ text: 'Начальная точка:' } },
    item_0_0_4:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_0_4' } },
    title_0_0_5:{ constructor: TralivaKit.Label, options:{ text: 'Конечная точка:' } },
    item_0_0_5:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_0_5' } },
    title_0_1:{ constructor: TralivaKit.Label, options:{ bg: '#aaa', color: '#800', text: 'Настройка селекции' } },
    title_0_1_1:{ constructor: TralivaKit.Label, options:{ text: 'Тип селекции:' } },
    item_0_1_1:{ constructor: TralivaKit.ComboBox, options:{}, substate: 'par_0_1_1' },
    title_0_2:{ constructor: TralivaKit.Label, options:{ bg: '#aaa', color: '#800', text: 'Настройка скрещивания' } },
    radio_0_2_1:{ constructor: TralivaKit.Button, options:{ title: 'Использовать одну фикс. точку:', activeVarName: 'bnSexPoint1' } },
    item_0_2_1:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_2_1' } },
    radio_0_2_2:{ constructor: TralivaKit.Button, options:{ title: 'Использовать N случайных точек:', activeVarName: 'bnSexPointN' } },
    item_0_2_2:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_2_2' } },
    radio_0_2_3:{ constructor: TralivaKit.Button, options:{ title: 'Использовать произв. кол.-во фикс. точек', activeVarName: 'bnSexPointRandom' } },
    title_0_3:{ constructor: TralivaKit.Label, options:{ bg: '#aaa', color: '#800', text: 'Настройка мутации' } },
    title_0_3_1:{ constructor: TralivaKit.Label, options:{ text: 'Вероятность мутации:' } },
    item_0_3_1:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_3_1' } },
    title_0_3_2:{ constructor: TralivaKit.Label, options:{ text: 'Кол.во возм. мутации у одной особи:' } },
    item_0_3_2:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_3_2' } },
    title_0_3_3:{ constructor: TralivaKit.Label, options:{ text: 'Способ мутации:' } },
    item_0_3_3:{ constructor: TralivaKit.ComboBox, options:{}, substate: 'par_0_3_3' },
    title_0_4:{ constructor: TralivaKit.Label, options:{ bg: '#aaa', color: '#800', text: 'Настройка редукции' } },
    title_0_4_1:{ constructor: TralivaKit.Label, options:{ text: 'Количество особей в популяции:' } },
    item_0_4_1:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_4_1' } },
    title_0_4_2:{ constructor: TralivaKit.Label, options:{ text: 'Процент элитных особей:' } },
    item_0_4_2:{ constructor: TralivaKit.LineEdit, options:{ textVarName: 'par_0_4_2' } },
    button_0_1:{
        constructor: TralivaKit.Button,
        options: {
            title: 'Сохранить изменения',
            activeVarName: 'bnApplyParams'
        }
    },
    title_1:{
        constructor: TralivaKit.Label,
        options:{
            text: 'Генерация первой популяции'
        }
    },
    button_1_generate:{
        constructor: TralivaKit.Button,
        options:{
            title: 'Сгенерировать',
            activeVarName: 'bnGenerateFirstPopulation'
        }
    },
    matrix_1:{
        constructor: TralivaKit.StaticHtml,
        options:{
            htmlVarName: 'firstGenerationHtml',
            scroll: 'v'
            //bg: 'red'
        }
    },
    title_1_1:{
        constructor: TralivaKit.Label,
        options:{
            text: 'Размер первой популяции'
        }
    },
    item_1_1:{
        constructor: TralivaKit.LineEdit,
        options:{
            textVarName: 'par_1_1'
        }
    },
    title_3_1_1:{
        constructor: TralivaKit.Label,
        options:{
            text: 'Выполнить сразу'
        }
    },
    title_3_1_2:{
        constructor: TralivaKit.Label,
        options:{
            text: 'цикл(ов).'
        }
    },
    item_3_1_1:{
        constructor: TralivaKit.LineEdit,
        options:{
            textVarName: 'par_3_1_1'
        }
    },
    button_3_1:{
        constructor: TralivaKit.Button,
        options:{
            title: 'генерировать далее',
            activeVarName: 'bn_3_1'
        }
    },
    title_3_2:{
        constructor: TralivaKit.Label,
        options:{
            text: 'Текущая генерация:'
        }
    },
    item_3_2:{
        constructor: TralivaKit.Label,
        options:{
            color: '#800',
            textVarName: 'curGenerationForOutput'
        }
    },
    button_3_3:{
        constructor: TralivaKit.Button,
        options:{
            title: 'Сбросить',
            activeVarName: 'bn_3_2'
        }
    },
    bn_4_selection:{
        constructor: TralivaKit.Button,
        options:{
            title: 'Селекция [0]',
            activeVarName: 'bn_4_selection'
        }
    },
    bn_4_crossing:{
        constructor: TralivaKit.Button,
        options:{
            title: 'Скрещивание [0]',
            activeVarName: 'bn_4_crossing'
        }
    },
    bn_4_mutation:{
        constructor: TralivaKit.Button,
        options:{
            title: 'Мутация [0]',
            activeVarName: 'bn_4_mutation'
        }
    },
    bn_4_reduction:{
        constructor: TralivaKit.Button,
        options:{
            title: 'Редукция [0]',
            activeVarName: 'bn_4_reduction'
        }
    }
};
