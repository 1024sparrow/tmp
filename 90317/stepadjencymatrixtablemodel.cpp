#include "stepadjencymatrixtablemodel.h"

StepAdjencyMatrixTableModel::StepAdjencyMatrixTableModel(CommonData *commonData, QObject *parent)
    :QAbstractTableModel(parent), commonData(commonData)
{

}

int StepAdjencyMatrixTableModel::rowCount(const QModelIndex &parent) const
{
    return commonData->count;
}

int StepAdjencyMatrixTableModel::columnCount(const QModelIndex &parent) const
{
    return commonData->count;
}

QVariant StepAdjencyMatrixTableModel::data(const QModelIndex &index, int role) const
{
    if (role == Qt::DisplayRole || role == Qt::EditRole)
    {
        return commonData->adjaMatrix[index.column() * commonData->count + index.row()];
    }
    return QVariant();
}

bool StepAdjencyMatrixTableModel::setData(const QModelIndex &pIndex, const QVariant &value, int role)
{
    if (role == Qt::EditRole)
    {
        double doubleValue = value.toDouble();
        commonData->adjaMatrix[pIndex.column() * commonData->count + pIndex.row()] = doubleValue;
        commonData->adjaMatrix[pIndex.row() * commonData->count + pIndex.column()] = doubleValue;
        emit dataChanged(index(pIndex.row(), pIndex.column()), index(pIndex.row(), pIndex.column()));
        emit dataChanged(index(pIndex.column(), pIndex.row()), index(pIndex.column(), pIndex.row()));
        return true;
    }
    return false;
}

Qt::ItemFlags StepAdjencyMatrixTableModel::flags(const QModelIndex &index) const
{
    Qt::ItemFlags retVal = Qt::ItemIsEnabled;
    if (index.column() != index.row())
        retVal |= Qt::ItemIsEditable;
    return retVal;
}

void StepAdjencyMatrixTableModel::update()
{
    //
}
