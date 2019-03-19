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
#include <QRegExp>
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

    addTab(wStepParams, QString::fromUtf8("1. Параметры"));
    addTab(wAdja, QString::fromUtf8("2. Матрица смежности"));
    addTab(wManual, QString::fromUtf8("3. Вручную"));
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
    int isScaningPopulation = 0;
    QString populationText, solution;
    while (ts.readLineInto(&text))
    {
        qDebug() << text;
        if (text.contains("Решение:"))
            solution = text;
        if (isScaningPopulation > 0)
        {
            populationText.append(text);
            if (--isScaningPopulation)
                populationText.append("\n");
            else
            {
                if (!solution.isEmpty())
                {
                    populationText.append("\n\n");
                    populationText.append(solution);
                }
                wManual->updatePopulationData(populationText);
            }
        }
        else {
            QRegExp re(QString::fromUtf8("Популяция состоит из (\\d+) особей"));
            if (re.indexIn(text) >= 0)
            {
                isScaningPopulation = re.cap(1).toInt();
            }
        }
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
        // записываем все наши настройки в settings.json: сейчас он будет считан python-ом
        QJsonObject jsonRoot;
        jsonRoot.insert("count", commonData.count);
        QJsonObject jsonDirection;
        jsonDirection.insert("from", commonData.startPoint);
        jsonDirection.insert("to", commonData.endPoint);
        jsonRoot.insert("direction", jsonDirection);
        QJsonArray jsonAdja;
        for (int row = 0 ; row < commonData.count ; ++row)
        {
            QJsonArray jsonAdjaRow;
            for (int i = 0 ; i < commonData.count ; ++i)
            {
                jsonAdjaRow.append(commonData.adjaMatrix[i * commonData.count + row]);
            }
            jsonAdja.append(jsonAdjaRow);
        }
        jsonRoot.insert("adja_matrix", jsonAdja);
        jsonRoot.insert("first_pop_count", commonData.firstPopulationCount);

        QJsonDocument doc;
        doc.setObject(jsonRoot);
        QByteArray baJson = doc.toJson();
        QFile fileSettings(CORE_DIR_PATH "settings.json");
        if (fileSettings.open(QIODevice::WriteOnly | QIODevice::Text))
        {
            fileSettings.write(baJson);
        }
        else
        {
            QMessageBox::warning(this, "", QString::fromUtf8("Ошибка записи в файл"));
        }

        process->write("with open(source_file_name) as json_data:\n");
        process->write("    settings = json.load(json_data)\n\n");
        process->write("engine = Genetic(settings)\n");
    }
    else if (command == "gen_first_population")
    {
        process->write("engine.generate_first_population()\nengine.show_population(True)\n");
        //process->write("engine.show_population(True)\n");
    }
    else if (command == "solve")
    {
        process->write("engine.solve()\nengine.show_population(True)\n");
    }
    else if (command == "cross")
    {
        process->write("engine.cross()\nengine.show_population(True)\n");
        //process->write("engine.show_population(True)\n");
    }
    else if (command == "mutate")
    {
        process->write("engine.mutate()\nengine.show_population(True)\n");
    }
    else if (command == "selection")
    {
        process->write("engine.selection()\nengine.show_population(True)\n");
    }
}
