#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QTableWidget>
#include <QProcess>

class QProcess;
class StepParams;
class StepAdjancencyMatrixWidget;
class StepManual;
class MainWindow : public QTabWidget
{
    Q_OBJECT
public:
    MainWindow();
protected:
    void closeEvent(QCloseEvent *event) override;
private slots:
    void onDebug();
    void onReadyRead();
    void onFinished(int);
    void onProcessError(QProcess::ProcessError);
    void onSettingFinished(bool countChanged);
    void onAdjaFinished();
    void execCommand(const QString &);
private:
    QString processCurrentCommand; // меняется в слоте execCommand
    QProcess *process; // процесс с python-ом
    StepAdjancencyMatrixWidget *wAdja;
    StepManual *wManual;
};

#endif // MAINWINDOW_H
