#include "stepmanual.h"
#include <QBoxLayout>
#include <QPushButton>
#include <QLabel>
#include <QDebug>

StepManual::StepManual(CommonData *commonData, QWidget *parent)
    : QWidget(parent), commonData(commonData)
{
    QPushButton *bnGenerateFirstPopulation = new QPushButton(QString::fromUtf8("Генерировать первую популяцию"), this);
    connect(bnGenerateFirstPopulation, SIGNAL(pressed()), this, SLOT(onBnGenerateFirstPopulationClicked()));

    QWidget *wControls = new QWidget(this);
    {
        QBoxLayout *lay = new QVBoxLayout(wControls);
        lay->addWidget(bnGenerateFirstPopulation);
        lay->addStretch();
    }

    wPopulation = new QLabel(this);

    QBoxLayout *lay = new QHBoxLayout(this);
    lay->addWidget(wControls);
    lay->addWidget(wPopulation, 1);

}

void StepManual::update()
{
    emit execCommand("init");
}

void StepManual::updatePopulationData(const QString &p)
{
    wPopulation->setText(p);
}

void StepManual::onBnGenerateFirstPopulationClicked()
{
    emit execCommand("gen_first_population");
}
