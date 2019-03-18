#include "stepadjancencymatrixwidget.h"
#include "stepadjencymatrixtablemodel.h"
#include <QVBoxLayout>
#include <QFormLayout>
#include <QLabel>
#include <QTableView>
#include <QLineEdit>
#include <QPushButton>

StepAdjancencyMatrixWidget::StepAdjancencyMatrixWidget(CommonData *commonData, QWidget *parent) : QWidget(parent)
{
    model = new StepAdjencyMatrixTableModel(commonData, this);
    QWidget *wParams = new QWidget(this);
    {
        //connect(lay)
    }
    QLabel *wTitle = new QLabel(QString::fromUtf8("Матрица смежности"), this);
    QTableView *wTable = new QTableView(this);
    wTable->setModel(model);
    QPushButton *bnApply = new QPushButton(QString::fromUtf8("Применить"), this);
    connect(bnApply, SIGNAL(pressed()), this, SLOT(onBnApplyClicked()));

    QVBoxLayout *lay = new QVBoxLayout(this);
    lay->addWidget(wParams);
    lay->addWidget(wTitle);
    lay->addWidget(wTable, 1);
    lay->addWidget(bnApply);

}

void StepAdjancencyMatrixWidget::update()
{
    model->update();
}

void StepAdjancencyMatrixWidget::onBnApplyClicked()
{
    emit finished();
}
