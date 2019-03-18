#include "stepmanual.h"
#include <QDebug>

StepManual::StepManual(CommonData *commonData, QWidget *parent)
    : QWidget(parent), commonData(commonData)
{

}

void StepManual::update()
{
    qDebug() << "void StepManual::update()";
    emit execCommand("init");
}
