#include "stepadjancencymatrixwidget.h"
#include "stepadjencymatrixtablemodel.h"
#include <QVBoxLayout>
#include <QFormLayout>
#include <QLabel>
#include <QTableView>
#include <QLineEdit>

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

    QVBoxLayout *lay = new QVBoxLayout(this);
    lay->addWidget(wParams);
    lay->addWidget(wTitle);
    lay->addWidget(wTable, 1);

}

void StepAdjancencyMatrixWidget::update()
{
    model->update();
}
