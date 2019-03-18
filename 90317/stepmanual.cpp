#include "stepmanual.h"
#include <QBoxLayout>
#include <QPushButton>
#include <QDebug>

StepManual::StepManual(CommonData *commonData, QWidget *parent)
    : QWidget(parent), commonData(commonData)
{
    QPushButton *bnGenerateFirstPopulation = new QPushButton(QString::fromUtf8("Генерировать первую популяцию"), this);
    connect(bnGenerateFirstPopulation, SIGNAL(pressed()), this, SLOT(onBnGenerateFirstPopulationClicked()));

}

void StepManual::update()
{
    emit execCommand("init");
}

void StepManual::onBnGenerateFirstPopulationClicked()
{
    emit execCommand("gen_first_population");
}
