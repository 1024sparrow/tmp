class GuiLogics extends Traliva.LogicsStateSubscriber {

    constructor() {
        super();
        //this._isInitialized = undefined;
        //this.bnSexPoint1 =  undefined
        //this.bnSexPointN =  undefined
        //this.bnSexPointRandom =  undefined

        //this.bnStage0 = undefined;
        //this.bnStage1 = undefined;
        //this.bnStage2 = undefined;
        //this.bnStage3 = undefined;
        //this.bnStage4 = undefined;
    }

    initializeGui() {
        Traliva.widgets.tab0.setVisible(this.bnStage0);
        Traliva.widgets.tab1.setVisible(this.bnStage1);
        Traliva.widgets.tab2.setVisible(this.bnStage2);
        Traliva.widgets.tab3.setVisible(this.bnStage3);
        Traliva.widgets.tab4.setVisible(this.bnStage4);
        if (Traliva.widgets.matrix_1){
            Traliva.widgets.matrix_1._div.style.overflow = 'auto';
            Traliva.widgets.matrix_1._content.style.overflow = 'auto';
        }
    }

    processStateChanges(s) {
        this._checkSexPointCurrent(s);
        this._updateForTab(s);
        this._isInitialized = true;
    }

    _updateForTab(s){
        if (this._isInitialized){
            if (this.bnStage0 !== s.bnStage0){
                if (this.bnStage1 || this.bnStage2 || this.bnStage3 || this.bnStage4){
                    Traliva.widgets.tab0.setVisible(this.bnStage0 = s.bnStage0);
                    Traliva.widgets.tab1.setVisible(this.bnStage1 = s.bnStage1 = false);
                    Traliva.widgets.tab2.setVisible(this.bnStage2 = s.bnStage2 = false);
                    Traliva.widgets.tab3.setVisible(this.bnStage3 = s.bnStage3 = false);
                    Traliva.widgets.tab4.setVisible(this.bnStage4 = s.bnStage4 = false);
                }
                else
                    s.bnStage0 = this.bnStage0;
            }
            else if (this.bnStage1 !== s.bnStage1){
                if (this.bnStage0 || this.bnStage2 || this.bnStage3 || this.bnStage4){
                    Traliva.widgets.tab1.setVisible(this.bnStage1 = s.bnStage1);
                    Traliva.widgets.tab0.setVisible(this.bnStage0 = s.bnStage0 = false);
                    Traliva.widgets.tab2.setVisible(this.bnStage2 = s.bnStage2 = false);
                    Traliva.widgets.tab3.setVisible(this.bnStage3 = s.bnStage3 = false);
                    Traliva.widgets.tab4.setVisible(this.bnStage4 = s.bnStage4 = false);
                }
                else
                    s.bnStage1 = this.bnStage1;
            }
            else if (this.bnStage2 !== s.bnStage2){
                if (this.bnStage1 || this.bnStage0 || this.bnStage3 || this.bnStage4){
                    Traliva.widgets.tab2.setVisible(this.bnStage2 = s.bnStage2);
                    Traliva.widgets.tab1.setVisible(this.bnStage1 = s.bnStage1 = false);
                    Traliva.widgets.tab0.setVisible(this.bnStage0 = s.bnStage0 = false);
                    Traliva.widgets.tab3.setVisible(this.bnStage3 = s.bnStage3 = false);
                    Traliva.widgets.tab4.setVisible(this.bnStage4 = s.bnStage4 = false);
                }
                else
                    s.bnStage2 = this.bnStage2;
            }
            else if (this.bnStage3 !== s.bnStage3){
                if (this.bnStage1 || this.bnStage2 || this.bnStage0 || this.bnStage4){
                    Traliva.widgets.tab3.setVisible(this.bnStage3 = s.bnStage3);
                    Traliva.widgets.tab1.setVisible(this.bnStage1 = s.bnStage1 = false);
                    Traliva.widgets.tab2.setVisible(this.bnStage2 = s.bnStage2 = false);
                    Traliva.widgets.tab0.setVisible(this.bnStage0 = s.bnStage0 = false);
                    Traliva.widgets.tab4.setVisible(this.bnStage4 = s.bnStage4 = false);
                }
                else
                    s.bnStage3 = this.bnStage3;
            }
            else if (this.bnStage4 !== s.bnStage4){
                if (this.bnStage1 || this.bnStage2 || this.bnStage3 || this.bnStage0){
                    Traliva.widgets.tab4.setVisible(this.bnStage4 = s.bnStage4);
                    Traliva.widgets.tab1.setVisible(this.bnStage1 = s.bnStage1 = false);
                    Traliva.widgets.tab2.setVisible(this.bnStage2 = s.bnStage2 = false);
                    Traliva.widgets.tab3.setVisible(this.bnStage3 = s.bnStage3 = false);
                    Traliva.widgets.tab0.setVisible(this.bnStage0 = s.bnStage0 = false);
                }
                else
                    s.bnStage4 = this.bnStage4;
            }
            else
                return;
            this._registerStateChanges();
        }
        else {
            this.bnStage0 = s.bnStage0;
            this.bnStage1 = s.bnStage1;
            this.bnStage2 = s.bnStage2;
            this.bnStage3 = s.bnStage3;
            this.bnStage4 = s.bnStage4;
        }
    }

    _checkSexPointCurrent(s){
        if (this._isInitialized) {
            if (this.bnSexPoint1 !== s.bnSexPoint1){
                if (this.bnSexPointN || this.bnSexPointRandom){ // пользователь нажал не на активную кнопку
                    this.bnSexPoint1 = s.bnSexPoint1;
                    this.bnSexPointN = s.bnSexPointN = false;
                    this.bnSexPointRandom = s.bnSexPointRandom = false;
                }
                else {
                    // откатываю д оисходного значения
                    s.bnSexPoint1 = this.bnSexPoint1;
                }
            }
            else if (this.bnSexPointN !== s.bnSexPointN){
                if (this.bnSexPoint1 || this.bnSexPointRandom){ // пользователь нажал не на активную кнопку
                    this.bnSexPointN = s.bnSexPointN;
                    this.bnSexPoint1 = s.bnSexPoint1 = false;
                    this.bnSexPointRandom = s.bnSexPointRandom = false;
                }
                else {
                    s.bnSexPointN = this.bnSexPointN;
                }
            }
            else if (this.bnSexPointRandom !== s.bnSexPointRandom){
                if (this.bnSexPoint1 || this.bnSexPointN){ // пользователь нажал не на активную кнопку
                    this.bnSexPointRandom = s.bnSexPointRandom;
                    this.bnSexPoint1 = s.bnSexPoint1 = false;
                    this.bnSexPointN = s.bnSexPointN = false;
                }
                else {
                    s.bnSexPointRandom = this.bnSexPointRandom;
                }
            }
            else
                return;
            this._registerStateChanges();
        }
        else {
            this.bnSexPoint1 = s.bnSexPoint1;
            this.bnSexPointN = s.bnSexPointN;
            this.bnSexPointRandom = s.bnSexPointRandom;
            this._registerStateChanges();
        }
    }
}
