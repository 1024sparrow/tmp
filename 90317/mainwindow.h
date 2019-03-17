#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QTableWidget>
#include <QProcess>

class QProcess;
class StepParams;
class StepAdjancencyMatrixWidget;
class MainWindow : public QTabWidget
{
    Q_OBJECT
public:
    MainWindow();
protected:
    void closeEvent(QCloseEvent *event);
private slots:
    void onDebug();
    void onProcessError(QProcess::ProcessError);
    void onSettingFinished(bool countChanged);
private:
    QProcess *process; // процесс с python-ом
    StepAdjancencyMatrixWidget *wAdja;
};

#endif // MAINWINDOW_H
