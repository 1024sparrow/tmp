#ifndef STEPADJANCENCYMATRIXWIDGET_H
#define STEPADJANCENCYMATRIXWIDGET_H

#include <QWidget>
#include "commondata.h"

class QLineEdit;
class StepAdjencyMatrixTableModel;
class StepAdjancencyMatrixWidget : public QWidget
{
    Q_OBJECT
public:
    explicit StepAdjancencyMatrixWidget(CommonData *commonData, QWidget *parent = nullptr);
public slots:
    void update();
private:
    StepAdjencyMatrixTableModel *model;
    QLineEdit *leLength;

};

#endif // STEPADJANCENCYMATRIXWIDGET_H
