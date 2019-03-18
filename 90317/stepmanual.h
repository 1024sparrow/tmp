#ifndef STEPMANUAL_H
#define STEPMANUAL_H

#include <QWidget>
#include "commondata.h"

class StepManual : public QWidget
{
    Q_OBJECT
public:
    explicit StepManual(CommonData *commonData, QWidget *parent = nullptr);
signals:
    void execCommand(const QString &);
public slots:
    void update();
private slots:
    void onBnGenerateFirstPopulationClicked();
private:
    CommonData *commonData;
};

#endif // STEPMANUAL_H
