#ifndef STEPPARAMS_H
#define STEPPARAMS_H

#include <QWidget>
#include "commondata.h"

class QLineEdit;
class StepParams : public QWidget
{
    Q_OBJECT
public:
    explicit StepParams(CommonData *commonData, QWidget *parent = nullptr);
signals:
    void finished(bool lengthChanged);
private slots:
    void onBnApplyClicked();
    void onBnRevertClicked();
private:
    CommonData *commonData;
    QLineEdit *leLength,
              *leStartPoint,
              *leEndPoint;
};

#endif // STEPPARAMS_H
