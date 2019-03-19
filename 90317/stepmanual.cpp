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
    QPushButton *bnAutoSolve = new QPushButton(QString::fromUtf8("Автоматически решить задачу"), this);
    connect(bnAutoSolve, SIGNAL(pressed()), this, SLOT(onBnAutoClicked()));
    QPushButton *bnCross = new QPushButton(QString::fromUtf8("Скрещивание"), this);
    connect(bnCross, SIGNAL(pressed()), this, SLOT(onBnCrossClicked()));
    QPushButton *bnMutate = new QPushButton(QString::fromUtf8("Мутация"), this);
    connect(bnMutate, SIGNAL(pressed()), this, SLOT(onBnMutateClicked()));
    QPushButton *bnSelection = new QPushButton(QString::fromUtf8("Отбор"), this);
    connect(bnSelection, SIGNAL(pressed()), this, SLOT(onBnSelectionClicked()));

    QWidget *wControls = new QWidget(this);
    {
        QBoxLayout *lay = new QVBoxLayout(wControls);
        lay->addWidget(bnGenerateFirstPopulation);
        lay->addWidget(bnAutoSolve);
        lay->addWidget(bnCross);
        lay->addWidget(bnMutate);
        lay->addWidget(bnSelection);
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

void StepManual::onBnAutoClicked()
{
    emit execCommand("solve");
}

void StepManual::onBnCrossClicked()
{
    emit execCommand("cross");
}

void StepManual::onBnMutateClicked()
{
    emit execCommand("mutate");
}

void StepManual::onBnSelectionClicked()
{
    emit execCommand("selection");
}
