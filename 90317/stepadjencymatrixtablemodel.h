#ifndef STEPADJENCYMATRIXTABLEMODEL_H
#define STEPADJENCYMATRIXTABLEMODEL_H

#include <QAbstractTableModel>
#include "commondata.h"

class StepAdjencyMatrixTableModel : public QAbstractTableModel
{
    Q_OBJECT
public:
    StepAdjencyMatrixTableModel(CommonData *commonData, QObject *parent = nullptr);
    int rowCount(const QModelIndex &parent) const;
    int columnCount(const QModelIndex &parent) const;
    QVariant data(const QModelIndex &index, int role) const;
    bool setData(const QModelIndex &index, const QVariant &value, int role);
    Qt::ItemFlags flags(const QModelIndex &index) const;
public slots:
    void update();
private:
    CommonData *commonData;
};

#endif // STEPADJENCYMATRIXTABLEMODEL_H
