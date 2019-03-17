#include "mainwindow.h"
#include "commondata.h"
#include "stepparams.h"
#include "stepadjancencymatrixwidget.h"
#include <QMessageBox>
#include <QFile>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QDebug>//

#define PYTHON_PATH "/usr/bin/python3"
#define CORE_DIR_PATH "/home/boris/da/pro/fl/tmp/90120_python_fl/"

CommonData commonData;

MainWindow::MainWindow()
    :QTabWidget()
{
    //QJsonObject
    QFile fileSettings(CORE_DIR_PATH "settings.json");
    QString settStr;
    if (fileSettings.open(QIODevice::ReadOnly | QIODevice::Text))
    {
        settStr = fileSettings.readAll();
        fileSettings.close();
    }
    else
    {
        QMessageBox::warning(this, "", QString::fromUtf8("Не удалось прочитать файл настроек"));
    }

    QJsonDocument jsonDocument = QJsonDocument::fromJson(settStr.toUtf8());
    QJsonObject settObj = jsonDocument.object();
    commonData.count = settObj.value("count").toInt();
    commonData.adjaMatrix = new double[commonData.count * commonData.count];
    int x, y(0);
    foreach (QJsonValue row, settObj.value("adja_matrix").toArray())
    {
        x = 0;
        foreach (QJsonValue i, row.toArray())
        {
            commonData.adjaMatrix[y + x * commonData.count] = i.toDouble();
            ++x;
        }
        ++y;
    }
    QJsonObject oDirection = settObj.value("direction").toObject();
    commonData.startPoint = oDirection.value("from").toInt();
    commonData.endPoint = oDirection.value("to").toInt();
    commonData.firstPopulationCount = settObj.value("first_pop_count").toInt();
    qDebug() << settObj.value("adja_matrix");

    process = new QProcess(this);
    connect(process, SIGNAL(error(QProcess::ProcessError)), this, SLOT(onProcessError(QProcess::ProcessError)));
    connect(process, SIGNAL(readyRead()), this, SLOT(onDebug()));
    process->start(PYTHON_PATH, QStringList() << CORE_DIR_PATH "test.py");

    wAdja = new StepAdjancencyMatrixWidget(&commonData, this);
    StepParams *wStepParams = new StepParams(&commonData, this);
    connect(wStepParams, SIGNAL(finished(bool)), this, SLOT(onSettingFinished(bool)));
    addTab(wStepParams, QString::fromUtf8("1. параметры"));
    addTab(wAdja, QString::fromUtf8("2. adja"));
}

void MainWindow::closeEvent(QCloseEvent *)
{
    process->close();
}

void MainWindow::onDebug()
{
    qDebug()<<"321";
    qDebug()<<process->readAll();
}

void MainWindow::onProcessError(QProcess::ProcessError pe)
{
    if (pe == QProcess::FailedToStart)
    {
        QMessageBox::warning(this, "", QString::fromUtf8("Не удалось запустить интерпретатор python. Проверьте указанный путь."));
    }
}

void MainWindow::onSettingFinished(bool countChanged)
{
    this->setCurrentWidget(wAdja);
}
