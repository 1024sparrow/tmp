#ifndef STEPMANUAL_H
#define STEPMANUAL_H

#include <QWidget>
#include "commondata.h"

class QLabel;
class StepManual : public QWidget
{
    Q_OBJECT
public:
    explicit StepManual(CommonData *commonData, QWidget *parent = nullptr);
signals:
    void execCommand(const QString &);
public slots:
    void update(); // изменились общие настройки: надо перезапустить движок (пересоздать экземпляр Genetic)
    void updatePopulationData(const QString &p); // Обновить отображение популяции
private slots:
    void onBnGenerateFirstPopulationClicked();
    void onBnAutoClicked();
    void onBnCrossClicked();
    void onBnMutateClicked();
    void onBnSelectionClicked();
private:
    CommonData *commonData;
    QLabel *wPopulation;
};

#endif // STEPMANUAL_H
