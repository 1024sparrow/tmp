#include "mainwindow.h"
#include "commondata.h"
#include "stepparams.h"
#include "stepadjancencymatrixwidget.h"
#include "stepmanual.h"
#include <QMessageBox>
#include <QFile>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QTextStream>
#include <QDebug>//

#define PYTHON_PATH "/usr/bin/python3"
#define CORE_DIR_PATH "/home/boris/da/pro/fl/tmp/90120_python_fl/"
#define PYTHON_ENCODING "utf8" // В Винде это будет "cp1251"

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

    process = new QProcess(this);
    process->setWorkingDirectory(CORE_DIR_PATH);
    connect(process, SIGNAL(error(QProcess::ProcessError)), this, SLOT(onProcessError(QProcess::ProcessError)));
    connect(process, SIGNAL(finished(int)), this, SLOT(onFinished(int)));
    connect(process, SIGNAL(readyRead()), this, SLOT(onReadyRead()));

    //connect(process, SIGNAL(), this, SLOT(onDebug()));
    connect(process, SIGNAL(readyReadStandardOutput()), this, SLOT(onDebug()));
    connect(process, SIGNAL(readyReadStandardError()), this, SLOT(onDebug()));

    //process->start(PYTHON_PATH, QStringList() << "test.py");
    process->start(PYTHON_PATH, QStringList() << "-i"); // Ключ "-i" - интерактивный режим.
        //Т.е. мы не за раз питоновский код пишем, а писнули-читаем, писнули-читаем.
        // Так мы можем вручную запускать отдельные методы класса Genetic
    process->waitForStarted();
    process->write("from genetic import Genetic\n"); // пишем в Python
    process->write("import json\n");
    process->write("source_file_name = 'settings.json'\n");

    wAdja = new StepAdjancencyMatrixWidget(&commonData, this);
    connect(wAdja, SIGNAL(finished()), this, SLOT(onAdjaFinished()));
    StepParams *wStepParams = new StepParams(&commonData, this);
    connect(wStepParams, SIGNAL(finished(bool)), this, SLOT(onSettingFinished(bool)));
    wManual = new StepManual(&commonData, this);
    connect(wManual, SIGNAL(execCommand(QString)), this, SLOT(execCommand(QString)));

    addTab(wStepParams, QString::fromUtf8("1. параметры"));
    addTab(wAdja, QString::fromUtf8("2. adja"));
    addTab(wManual, QString::fromUtf8("3. вручную"));
}

void MainWindow::closeEvent(QCloseEvent *event)
{
    //process->close();
    process->write("quit()\n");
    process->closeWriteChannel();
}

void MainWindow::onDebug()
{
}

void MainWindow::onReadyRead()
{
    QByteArray ba = process->readAll();
    QTextStream ts(&ba);
    ts.setCodec(PYTHON_ENCODING);
    QString text;
    while (ts.readLineInto(&text))
    {
        qDebug() << text;
    }
}

void MainWindow::onFinished(int status)
{
    qDebug()<<"void MainWindow::onFinished()" << status;
}

void MainWindow::onProcessError(QProcess::ProcessError pe)
{
    if (pe == QProcess::FailedToStart)
    {
        QMessageBox::warning(this, "", QString::fromUtf8("Не удалось запустить интерпретатор python. Проверьте указанный путь."));
    }
    qDebug()<<"process error:"<<pe;
}

void MainWindow::onSettingFinished(bool countChanged)
{
    if (countChanged)
        wAdja->update();
    setCurrentWidget(wAdja);
}

void MainWindow::onAdjaFinished()
{
    wManual->update();
    setCurrentWidget(wManual);
}

void MainWindow::execCommand(const QString &command)
{
    processCurrentCommand = command;
    qDebug() << "Поступила команда " << command;
    if (command == "init")
    {
        // TODO: записываем все наши настройки в settings.json: сейчас он будет считан python-ом
        // ...

        process->write("with open(source_file_name) as json_data:\n");
        process->write("    settings = json.load(json_data)\n\n");
        process->write("engine = Genetic(settings)\n");
    }
    else if (command == "gen_first_population")
    {
        process->write("engine.generate_first_population()\n");
    }
}
