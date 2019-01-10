'use strict';

class GeneticEngineSubscriber extends Traliva.LogicsStateSubscriber {
    constructor() {
        super(); // вызов конструктора родительского класса
        this.ge = new GeneticEngine();
    }
    processStateChanges(s) {
        console.log('%%%%%%%%');
        this._applyParams(s);
        this._generateFirstPopulation(s);
        this._adjacencyMatrix(s);
        this._automaticCalc(s);
    }

    _applyParams(s){
        if (s.bnApplyParams){
            s.bnApplyParams = false;
            this.ge.setChromosomeLength(parseInt(s.par_0_0_1));
            this.ge.setMaxGeneration(parseInt(s.par_0_0_2));
            this.ge.setMaxIndividualsCap(parseInt(s.par_0_0_3));

            //Настройка селекции
            this.ge.setCrosstype(s.par_0_1_1.current);

            //Настройка кроссинга
            if (s.bnSexPoint1) {
                this.ge.setUseFixPoint(true);
                this.ge.setFixPointValue(parseInt(s.par_0_2_1));
            }
            else {
                this.ge.setUseFixPoint(false);
            }

            if (s.bnSexPointRandom) {
                let max = this.ge.getChromosomeLength();
                this.ge.setPointsNumber(parseInt(Math.random() * max));
            }
            else {
                this.ge.setPointsNumber(parseInt(s.par_0_2_2));
            }

            //Настройка мутации
            this.ge.setMutateChance(parseFloat(s.par_0_3_1));
            this.ge.setMutateCount(parseInt(s.par_0_3_2));
            this.ge.setMutateType(s.par_0_3_3.current);

            //Настройка редукции
            this.ge.setMaxIndividualsCap(parseInt(s.par_4_1));
            this.ge.setFirstBestIndividualsPercent(parseInt(s.par_0_4_2));
            this._registerStateChanges();
        }
    }

    _adjacencyMatrix(s){
        if (s.adjacencyMatrix.updateNeeded){
            s.adjacencyMatrix.matrix = GAAdditions.generateAdjacencyMatrix(parseInt(s.par_0_0_1), parseFloat(s.adjacencyMatrix.multiplier));
            GAAdditions.generateAdjacencyMatrixBreaks(s.adjacencyMatrix.matrix, parseInt(s.adjacencyMatrix.breaksCount));
            GAAdditions.generateAdjacencyMatrixJoints(s.adjacencyMatrix.matrix, parseInt(s.adjacencyMatrix.jointsCount));
            s.adjacencyMatrix.updateNeeded = false;
            this._registerStateChanges();
        }
    }

    _generateFirstPopulation(s){
        let ar, i1, i2, htmlTable;
        if (s.bnGenerateFirstPopulation){
            s.bnGenerateFirstPopulation = false;

            //firstGenerationGrid.removeAllRows();

            ar = GAAdditions.generateFirstGeneration(s.par_0_0_1, s.par_1_1, s.par_0_0_4, s.par_0_0_5);
            s.firstGeneration = GAAdditions.arrayListToSimpleChromoList(ar, s.adjacencyMatrix.matrix);
            htmlTable = '<table>'
            for (i1 = 0 ; i1 < ar.length ; i1++){
                htmlTable += '<tr>';
                for (i2 = 0 ; i2 < ar[i1].length ; i2++){
                    htmlTable += ('<td>' + ar[i1][i2] + '</td>');
                }
                htmlTable += '</tr>';
            }
            htmlTable += '</table>';
            s.firstGenerationHtml = htmlTable;
            this._registerStateChanges();
        }
    }

    _automaticCalc(s){
        console.log('55555555555555:', s.bn_3_1);
        let i, arr;
        if (s.bn_3_1 === undefined){
            console.log('1');
            s.bn_3_1 = false;
            s.curGenerationForOutput = '' + this.ge.getCurGeneration();
            console.log('set current generation for output: ', s.curGenerationForOutput);
            this._registerStateChanges();
        }
        else if (s.bn_3_1){ // нажата кнопка "Генерировать далее"
            console.log('2');
            s.bn_3_1 = false;

            for (i = 0 ; i < (parseInt(s.par_3_1_1) - 1) ; i++) {
                this.ge.processOneCycle();
            }
            arr = this.ge.processOneCycle();

                /*for (int i = 0; i < Integer.parseInt(cyclesCount.getValue()) - 1; i++) {
                    gaui.getGeneticEngine().processOneCycle();
                }

                ArrayList<Chromosomal> arr = gaui.getGeneticEngine().processOneCycle();

                //for (int i = 0; i < arr.size(); i++) {
                    //individualsGrid.getGrid().setWidget(i, arr.get(i).getGens().size(), new Label(Double.toString(arr.get(i).getFFValue())));
                //}

                individualsGrid.setArr(arr);*/

            s.curGenerationForOutput = '' + this.ge.getCurGeneration();
            this._registerStateChanges();
        }
        if (s.bn_3_2){ // нажата кнопка "Сбросить"
            console.log('3');
            s.bn_3_2 = false;

            /*gaui.getGeneticEngine().setCurGeneration(0);
            gaui.getGeneticEngine().setIndividualsList(gaui.firstGeneration.getFirstGeneration());

            individualsGrid.setArr(gaui.getGeneticEngine().getIndividualsList());

            ((Label) grid.getWidget(1, 0)).setText("Текущая генерация: " + gaui.getGeneticEngine().getCurGeneration() + ". ");*/

            this.ge.setCurGeneration(0);
            this.ge.setIndividualsList(s.firstGeneration);
            s.curGenerationForOutput = '' + this.ge.getCurGeneration();
            this._registerStateChanges();
        }
    }
}

var GAAdditions = {
    arrayListToSimpleChromoList: function(p_chromosomeIntegerList, p_adjMatrix){
        var retVal = [], i, tmp; // return value
        for (i = 0; i < p_chromosomeIntegerList.length ; i++) {
            tmp = new SimpleChrormosome(p_adjMatrix);
            tmp.setGens(p_chromosomeIntegerList[i]);
            retVal.push(tmp);
        }
        return retVal;
    },
    
    arrayListToTSPChromoList: function(p_chromosomeIntegerList, p_adjMatrix) {
        var retVal = [], i, tmp;
        for (i = 0; i < p_chromosomeIntegerList.length ;  i++) {
            tmp = new TspChromosome(p_adjMatrix);
            tmp.setGens(p_chromosomeIntegerList[i]);
            retVal.add(tmp);
        }
        return retVal;
    },
    
    distinctValues: function(p_arr){
        let i, found = new Set();
        for (i of p_arr){
            if (found.has(i))
                return false;
            found.add(i);
        }
        return true;          
    },

    generateAdjacencyMatrixBreaks: function(p_a, p_s1, p_s2) {
        const n = p_a.length;
        let size, r1, r2, i;
        if (p_s2 === undefined){
            for (i = 0; i < p_s1; i++) {
                r1 = parseInt(Math.random() * n);
                r2 = parseInt(Math.random() * n);
                p_a[r1][r2] = 9999.0;
                p_a[r2][r1] = 9999.0;
            }
        }
        else {
            if (p_s1 != p_s2) {
                size = parseInt(Math.random() * p_s2 + p_s1);
                size *= 2;
            }
            else
                size = p_s1 * 2;
            for (i = 0; i < size; i++) {
                r1 = parseInt(Math.random() * n);//qrand() % ((n) - 0) + 0;
                r2 = parseInt(Math.random() * n);
                if (r1 != r2) {
                    p_a[r1][r2] = 9999.0;
                    p_a[r2][r1] = 9999.0;
                }
            }
        }
    },

    generateAdjacencyMatrixJoints: function(p_a, p_s1, p_s2) {
        const n = p_a.length;
        let size, r1, r2, i;
        if (p_s2 === undefined){
            for (i = 0; i < p_s1; i++) {
                r1 = parseInt(Math.random() * n);
                r2 = parseInt(Math.random() * n);
                p_a[r1][r2] = 0.0;
                p_a[r2][r1] = 0.0;
            }
        }
        else{
            if (p_s1 != p_s2) {
                size = parseInt(Math.random() * p_s2 + p_s1);
                size *= 2;
            }
            else
                size = p_s1 * 2;
            for (i = 0; i < size; i++) {
                r1 = parseInt(Math.random() * n);//qrand() % ((n) - 0) + 0;
                r2 = parseInt(Math.random() * n);
                if (r1 != r2) {
                    p_a[r1][r2] = 0.0;
                    p_a[r2][r1] = 0.0;
                }
            }
        }
    },

    generateFirstGeneration: function(p_individualSize, p_generationSize, p_s1, p_s2) {
        let a = [], i, j;
        for (i = 0; i < p_generationSize; i++) {
            a.push(new Array(p_individualSize));
            for (j = 0; j < p_individualSize; j++)
                a[i].push(-0xffffffff);
            a[i][0] = p_s1;
            a[i][p_individualSize - 1] = p_s2;
            for (j = 1; j < p_individualSize - 1; j++)
                a[i][j] = parseInt(Math.random() * p_individualSize);
        }
        return a;
    },
    
    generateFirstGenerationTSP: function(p_generationSize, p_generationsCount, p_s1, p_s2, multiplayer) {
        let a = new Array(p_generationsCount),
            n = p_generationSize,
            i, j, k, counter, r1, alreadyExist;
        for (i = 0; i < p_generationsCount; i++) {
            a.push(new Array(n));
            for (j = 0; j < n; j++)
                a[i].push(-9999);
            a[i][0] = p_s1;
            a[i][n-1] = p_s2;
            counter = 1;
            while(counter < n-1) {
                r1 = parseInt(Math.random() * n);
                alreadyExist = false;
                for (k = 0; k < n; k++){
                    if (r1 === a[i][k])
                        alreadyExist = true;
                }
                if (!alreadyExist){
                    a[i][counter] = r1;
                    counter++;
                }
            }
        }
        for (i = 0; i < a.length; i++) {
            if (!this.distinctValues(a[i])) {
                console.log(i + ' : ');
                for (j = 0; j < a[i].length; j++){
                    console.log(' ' + a[i][j]);
                }
            }
        }
        return a;
    },

    generateAdjacencyMatrix: function(p_n, p_multiplayer) {
        console.log('generate adjacency matrix: ', p_n, p_multiplayer);
        let a = new Array(p_n),
            i, j;
        for (i = 0; i < p_n; i++) {
            a[i] = new Array(p_n);
            for (j = 0; j < p_n; j++) {
                if (i === j)
                    a[i].push(0.0);
                else
                    a[i].push(Math.random() * p_multiplayer);
            }
        }
        for (i = 0; i < p_n; i++) {
            for (j = 0; j < p_n; j++) {
                if (i > j)
                    a[i][j] = a[j][i];
            }
        }
        return a;
    }
}

/*
Базовый класс для всех хромосом
*/
class Chromosomal {
    constructor(p_aadjacencyMatrix) {
        this.gens = [];
        this.childs = []; // список хромосом после размножения
        this.aadjacencyMatrix = p_aadjacencyMatrix; // массив массивов чисел с плавающей точкой
    }
    // срещивание с такой особью по таким точкам
    //void cross(Chromosomal ch, ArrayList<Integer> points);
    cross(p_ch, p_points){console.log('must be implemented!');}

    //void mutate(int alghorithm);
    mutate(p_alghorithm){console.log('must be implemented!');}

    //double getFFValue();
    getFFValue(){console.log('must be implemented!');}

    //ArrayList<Chromosomal> getChilds();
    getChilds(){return this.childs;}

    //ArrayList<Integer> getGens();
    getGens(){return this.gens;}

    //void setGens(ArrayList<Integer> gensArray);
    setGens(p_gensArray){this.gens = p_gensArray;}

    //String toString();
    toString() {
        let returnValue = '', i;
        for (i = 0; i < this.gens.length; i++)
            returnValue += this.gens[i] + ' ';
        return returnValue;
    }

    setAadjacencyMatrix(p_aadjacencyMatrix){this.aadjacencyMatrix = p_aadjacencyMatrix;}
}

/*
Простая реализация хромосомы
*/
class SimpleChrormosome extends Chromosomal {
    constructor(p_aadjacencyMatrix) {
        super(p_aadjacencyMatrix);
    }

    //cross(Chromosomal g, ArrayList<Integer> points) {
    cross(p_partner, p_points) {
        if (!p_points){
            console.error('epic fail');
            return;
        }

        // создаём дочерние хромосомы (такого же класса, как мы сами)
        let ch1 = new SimpleChrormosome(aadjacencyMatrix),
            ch2 = new SimpleChrormosome(aadjacencyMatrix),
            tmp, tmp2, i, i2, isSwap,
            partnerGens = p_partner.gens;

        ch1.gens.push(this.gens[0]);
        ch2.gens.push(this.gens[0]);

        // скрещивание по одной фиксированной точке
        if (p_points.length === 1) {
            tmp = p_points[0];
            for (i = 1; i < tmp; i++) {
                ch1.gens.push(this.gens[i]);
                ch2.gens.push(p_partner.gens[i]);
            }

            for (i = tmp; i < this.gens.length - 1; i++) {
                ch1.gens.push(p_partner.gens[i]);
                ch2.gens.push(this.gens[i]);
            }
        }
        else { // скрещивание по нескольким точкам
            tmp = 1;
            tmp2 = p_points[0];
            isSwap = false;

            for (i = tmp; i < tmp2; i++) {
                ch1.gens.push(this.gens[i]);
                ch2.gens.push(p_partner.gens[i]);
            }

            for (i = 1; i < p_points.length; i++) {
                tmp = p_points[i - 1];
                tmp2 = p_points[i];

                for (i2 = tmp; i2 < tmp2; i2++) {
                    if (isSwap) {
                        ch1.gens.push(this.gens[i2]);
                        ch2.gens.push(p_partner.gens[i2]);
                    }
                    else {
                        ch1.gens.push(p_partner.gens[i2]);
                        ch2.gens.push(this.gens[i2]);
                    }
                }

                isSwap = !isSwap; // инвертируем
            }

            tmp = tmp2; //последние от p_points.get(послед.) до gens.size-2
            tmp2 = this.gens.size() - 1;

            for (i2 = t1; i2 < tmp2; i2++) {
                if (isSwap) {
                    ch1.gens.push(this.gens[i2]);
                    ch2.gens.push(p_partner.gens[i2]);
                } else {
                    ch1.gens.push(p_partner.gens[i2]);
                    ch2.gens.push(this.gens[i2]);
                }
            }
        }

        ch1.gens.push(this.gens[this.gens.length - 1]);
        ch2.gens.push(this.gens[this.gens.length - 1]);

        childs.push(ch1);
        childs.push(ch2);
    } // end of SimpleChromosome::cross

    mutate(p_alghorithm) {
        let r1, r2;
        if (p_alghorithm == 0) { // способ мутации: замена на случайный
            r1 = parseInt(Math.random() * (this.gens.length - 1) + 1);
            r2 = parseInt(Math.random() * this.gens.length);

            this.gens[r1] = r2;
        }
        else if (p_alghorithm == 1) { // способ мутации: замена на соседний
            r1 = parseInt(Math.random() * (this.gens.length - 1-1-1) + 1+1);
            if (Math.random() > 0.5)
                r2 = 1;
            else
                r2 = -1;

            this.gens[r1] = r1+r2;
        }
    } // end of SimpleChromosome::mutate

    getFFValue() {
        let path = 0,
            comp1, comp2, i;
        for (i = 1; i < this.gens.length; i++) {
            comp1 = this.gens[i - 1];
            comp2 = this.gens[i];
            path += this.aadjacencyMatrix[comp1][comp2];
        }
        return path;
    }

} // class SimpleChromosome

class TspChromosome extends Chromosomal{
    constructor(p_aadjacencyMatrix) {
        super(p_aadjacencyMatrix);
    }

    //cross(Chromosomal g, ArrayList<Integer> points) {
    cross(p_partner, p_points) {
        let ch1 = new TspChromosome(aadjacencyMatrix),
            ch2 = new TspChromosome(aadjacencyMatrix),
            i, i2, edge, index,
            flag = true, alreadyExists = false;
        ch1.gens = this.gens;
        ch2.gens = p_partner.gens;

        edge = parseInt(1 + Math.random() * (this.gens.length - 1 - 1));
        index = edge;
        i = edge;
        while (i != edge || flag)
        {
            flag = false;
            alreadyExists = false;
            for (i2 = 0; i2 < index; i2++)
            {
                if (JSON.stringify(ch2.gens[i]) === JSON.stringify(ch1.gens[i2]))
                    alreadyExists = true;
            }
            if (!alreadyExists)
            {
                ch1.gens[index] = ch2.gens[i];
                index++;
            }
            i++;
            if (i > (this.gens.length - 1))
                i = 0;
        }
        this.childs.push(ch1);
        
        ch1.gens = this.gens;
        ch2.gens = p_partner.gens;
        
        index = edge;
        i = edge;
        flag = true;
        while (i != edge || flag)
        {
            flag = false;
            alreadyExists = false;
            for (i2 = 0; i2 < index; i2++)
            {
                if (JSON.stringify(ch1.gens[i]) === JSON.stringify(ch2.gens[i2]))
                    alreadyExists = true;
            }
            if (!alreadyExists)
            {
                ch2.gens[index] = ch1.gens[i];
                index++;
            }
            i++;
            if (i > (this.gens.length - 1))
                i = 0;
        }
        childs.add(ch2);
        //console.log(this.childs[0].toString());
        //console.log(this.childs[1].toString());
    } // end of TspChromosome::cross

    mutate(p_alghorithm) {
        //int r1 = (int) (Math.random() * (gens.size() - 1) + 1);
        //int r2 = (int) (Math.random() * (gens.size() - 1) + 1);

        //Collections.swap(gens, r1, r2);
    }

    getFFValue() {
        let path, comp1, comp2, i;
        for (i = 1; i < this.gens.length; i++) {
            comp1 = this.gens[i - 1];
            comp2 = this.gens[i];
            path += this.aadjacencyMatrix[comp1][comp2];
        }
        return path;
    }

} // class TspChromosome

class GeneticEngine {

    constructor() {
        this.individualsList = [];
        //this.chromosomeLength = undefined;

        this.usePercentCap = false;
        this.useMutation = true;
        this.curGeneration = 0;
        this.maxGeneration = 150;
        this.maxIndividualsCap = 50; // либо до макс. количества элементов
        this.maxIndividualsPercentCap = 50; // либо до % от максимального количества в популяции
        this.mutateChance = 0.06;
        this.firstBestIndividualsPercent = 10; // сколько лучших особей точно не удалятся
        this.crosstype = 'betterWithBetter';
        this.useFixPoint = false;
        this.fixPointValue = 5;
        this.pointsNumber = 2;

        this.mutateType = 'random';
        this.mutateCount = 1;
    }

    processing() {
        while (this.curGeneration < this.maxGeneration) {
            this.selection();
            this.crossing();
            if (this.useMutation)
                this.mutation();
            this.reduction();
            this.printOneGenerationInfo();
            this.curGeneration++;
        }
    }

    //public ArrayList<Chromosomal> processOneCycle() {
    processOneCycle() {
        this.selection();
        this.crossing();
        if (this.useMutation) {
            this.mutation();
        }
        this.reduction();
        //this.printOneGenerationInfo();
        this.curGeneration++;
        return this.individualsList;
    }

    selection() {
        if (this.crosstype === 'betterWithBetter') {
            this.sortByFFValue();
        }
        else if (this.crosstype === 'random') {
            this.individualsList.shuffle(); // да, мы добавили метод перетасовки элементов массива
        }
    }

    crossing() {
        let points = [], i;
        if (this.useFixPoint) {
            points.push(this.fixPointValue);
        }
        else {
            if (this.pointsNumber === 0)
                return;
            for (i = 0; i < this.pointsNumber; i++) {
                points.push(parseInt(Math.random() * (chromosomeLength - 1 - 1) + 1));
            }
        }
        points.sort();

        for (i = 0; i < this.individualsList.length - 2; i += 2) {
            this.individualsList[i].cross(this.individualsList[i + 1], points);
        }

        //добавляем всех детей к родителям и удаляем
        for (i = 0; i < this.individualsList.length; i++) {
            this.individualsList = this.individualsList.concat(this.individualsList[i].childs);
            this.individualsList[i].childs = [];
        }
    }

    mutation() {
        let i1, i2, tmp;
        for (i1 = 0; i1 < this.mutateCount; i1++) {
            for (i2 = 0; i2 < this.individualsList.length; i2++) {
                tmp = Math.random(); //0-0.999
                if (tmp < this.mutateChance) {
                    if (this.mutateType === 'random')
                        this.individualsList[i2].mutate(0);
                    else if (mutateType === 'neighbour')
                        this.individualsList[i2].mutate(1);
                }
            }
        }
    }

    reduction() {
        if (this.crosstype === 'betterWithBetter') {
            this.sortByFFValue();
        }
        else if (this.crosstype === 'random') {
            this.individualsList.shuffle();
        }
        if (this.maxIndividualsCap < (this.individualsList.length - 1)) {
            //individualsList.subList(maxIndividualsCap, individualsList.size() - 1).clear();
            this.individualsList.splice(this.maxIndividualsCap, this.individualsList.length - 2); // удаляем элементы массива
        }
    }

    printOneGenerationInfo() {
        let avg = 0,
            min = 999999,
            max = -999999,
            minIndex = 0,
            i, ffValue;
        console.log(curGeneration + ':');
        for (i = 0; i < this.individualsList.length; i++) {
            ffValue = this.individualsList[i].getFFValue();
            avg += ffValue;
            if (max < ffValue)
                max = ffValue;
            if (min > ffValue) {
                min = ffValue;
                minIndex = i;
            }
        }
        avg /= this.individualsList.length;
        console.log('' + min + '   ' + avg + '     ' + max + '');
        //console.log(' Min: ' + min + ' Avg: ' + avg + ' Max: ' + max + ' ::: ');
        //console.log(this.individualsList[minIndex].toString());
        //console.log(' Count: ' + this.individualsList.length);

    }

    sortByFFValue() {
        let i, i2, swapped;
        for (i = 0; i < this.individualsList.length; ++i) {
            swapped = false;
            for (i2 = 0; i2 < (this.individualsList.length - (i + 1)); ++i2) {
                if (this.individualsList[i2].getFFValue() > this.individualsList[i2 + 1].getFFValue()) {
                    this.individualsList.swap(i2, i2 + 1); // этот метод перемены элементов местами мы добавили в стандартный список
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
    }

    setCurGeneration(p_curGeneration) {
        this.curGeneration = p_curGeneration;
    }

    getIndividualsList() {
        return this.individualsList;
    }

    //setIndividualsList(ArrayList<Chromosomal> individualsList) {
    setIndividualsList(p_individualsList) {
        this.individualsList = p_individualsList.slice(); // не копируем не ссылку на массив, а честно копируем поэлементно методом slice()
        this.setChromosomeLength(this.individualsList[0].gens.length);
    }

    getMutateType() {
        return this.mutateType;
    }

    setMutateType(p_mutateType) {
        this.mutateType = p_mutateType;
    }

    getMutateCount() {
        return mutateCount;
    }

    setMutateCount(p_mutateCount) {
        this.mutateCount = p_mutateCount;
    }

    getCurGeneration() {
        return this.curGeneration;
    }

    getMaxGeneration() {
        return this.maxGeneration;
    }

    setMaxGeneration(p_maxGeneration) {
        this.maxGeneration = p_maxGeneration;
    }

    isUsePercentCap() {
        return this.usePercentCap;
    }

    setUsePercentCap(p_usePercentCap) {
        this.usePercentCap = p_usePercentCap;
    }

    getMaxIndividualsCap() {
        return this.maxIndividualsCap;
    }

    setMaxIndividualsCap(p_maxIndividualsCap) {
        this.maxIndividualsCap = p_maxIndividualsCap;
    }

    getMaxIndividualsPercentCap() {
        return this.maxIndividualsPercentCap;
    }

    setMaxIndividualsPercentCap(p_maxIndividualsPercentCap) {
        this.maxIndividualsPercentCap = p_maxIndividualsPercentCap;
    }

    getFirstBestIndividualsPercent() {
        return this.firstBestIndividualsPercent;
    }

    setFirstBestIndividualsPercent(p_firstBestIndividualsPercent) {
        this.firstBestIndividualsPercent = p_firstBestIndividualsPercent;
    }

    isUseFixPoint() {
        return this.useFixPoint;
    }

    setUseFixPoint(p_useFixPoint) {
        this.useFixPoint = p_useFixPoint;
    }

    getFixPointValue() {
        return this.fixPointValue;
    }

    setFixPointValue(p_fixPointValue) {
        this.fixPointValue = p_fixPointValue;
    }

    getPointsNumber() {
        return this.pointsNumber;
    }

    setPointsNumber(p_pointsNumber) {
        this.pointsNumber = p_pointsNumber;
    }

    getCrosstype() {
        return this.crosstype;
    }

    setCrosstype(p_crosstype) {
        this.crosstype = p_crosstype;
    }

    isUseMutation() {
        return this.useMutation;
    }

    setUseMutation(p_useMutation) {
        this.useMutation = p_useMutation;
    }

    getMutateChance() {
        return this.mutateChance;
    }

    setMutateChance(p_mutateChance) {
        this.mutateChance = p_mutateChance;
    }

    getChromosomeLength() {
        return this.chromosomeLength;
    }

    setChromosomeLength(p_chromosomeLength) {
        this.chromosomeLength = p_chromosomeLength;
    }
} // end of class GeneticEngine
