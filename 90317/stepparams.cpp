#include "stepparams.h"
#include <QFormLayout>
#include <QBoxLayout>
#include <QLineEdit>
#include <QPushButton>
#include <QDebug>//

StepParams::StepParams(CommonData *commonData, QWidget *parent)
    : QWidget(parent), commonData(commonData)
{
    leLength = new QLineEdit(this);
    leStartPoint = new QLineEdit(this);
    leEndPoint = new QLineEdit(this);
    leCrossPoint = new QLineEdit(this);
    onBnRevertClicked();

    QPushButton *bnApply = new QPushButton(QString::fromUtf8("Применить"), this);
    connect(bnApply, SIGNAL(pressed()), this, SLOT(onBnApplyClicked()));
    QPushButton *bnRevert = new QPushButton(QString::fromUtf8("Откатить"), this);
    connect(bnRevert, SIGNAL(pressed()), this, SLOT(onBnRevertClicked()));

    QVBoxLayout *mainLay = new QVBoxLayout(this);
    QWidget *content = new QWidget(this);
    QFormLayout *lay = new QFormLayout(content);
    lay->addRow(QString::fromUtf8("Длина последовательности"), leLength);
    lay->addRow(QString::fromUtf8("Индекс отправления"), leStartPoint);
    lay->addRow(QString::fromUtf8("Индекс назначения"), leEndPoint);
    lay->addRow(QString::fromUtf8("Точка скрещивания"), leCrossPoint);
    mainLay->addWidget(content);
    mainLay->addStretch();
    mainLay->addWidget(bnApply);
    mainLay->addWidget(bnRevert);
}

void StepParams::onBnApplyClicked()
{
    qDebug()<<"void StepParams::onBnApplyClicked()";
    int count = leLength->text().toInt();
    qDebug() << count << commonData->count;
    bool countChanged = false;
    if (count != commonData->count)
    {
        countChanged = true;
        delete[] commonData->adjaMatrix;
        commonData->adjaMatrix = new double[count * count];
        for (int i = 0, c = count * count ; i < c ; ++i)
        {
            commonData->adjaMatrix[i] = 0;
        }
    }
    commonData->count = count;
    commonData->startPoint = leStartPoint->text().toInt();
    commonData->endPoint = leEndPoint->text().toInt();
    commonData->crossPoint = leCrossPoint->text().toInt();
    emit finished(countChanged);
}

void StepParams::onBnRevertClicked()
{
    leLength->setText(QString::number(commonData->count));
    leStartPoint->setText(QString::number(commonData->startPoint));
    leEndPoint->setText(QString::number(commonData->endPoint));
    leCrossPoint->setText(QString::number(commonData->crossPoint));
}
