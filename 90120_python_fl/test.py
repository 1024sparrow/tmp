#!/usr/bin/env python3

#from prepa import prepa
from genetic import Genetic
import json

source_file_name = 'settings.json'
#source_file_name = 'settings_2.json'

with open(source_file_name) as json_data:
    settings = json.load(json_data)
    print(settings)
engine = Genetic(settings)

engine.generate_first_population()
engine.show_population(True)

engine.cross()
engine.show_population()

#engine.mutate()

#engine.selection()
#engine.show_population(True)

#engine.loop(15)

#engine.solve()















# То, что мы называем особью, ещё называют хромосомой.

# скрещивание. p_n - общее количество узлов в сети.
# Одна особь - это массив чисел, который определяет маршрут передачи пакета от узла к узлу
# Пусть у нас 10 узлов в сети, ищем наиболее быстрый маршут для передачи пакета из узла с индексом 5 в узел с индексом 2.
#
# Никакой узел сети не может получать пакет более одного раза (так называемая "петля"). Поэтому маршрут мы кодируем набором смещений относительно предыдущего узла,
# Массив чисел - это массив смещений индексов узлов. В нашем случае сумма должна равняться -3 (2-5).
# Первое число - смещение индекса узла. Это число от 0 до 8 (считаем от нуля, число узлов в сети минус 1 - мы не ищем маршрут передачи самому себе).
# Второе число - это смещение индекса узла от 0 до 7 (из набора доступных индексов исключили также и индекс предыдущего узла).

"""
Генетический алгоритм сам по себе простой. Теоретически. Сложности заключаются в подборе параметров. При неудачных параметрах алгоритм будет либо не работать (так и не будет находить решение), либо слишком быстро найдёт решение, которое нас не устраивает.
Параметры генетического алгоритма, помимо численности популяции, процента выживаемости и прочих, следующие:

- способ кодирования. Какой набор чисел(геном) должен кодировать вариант решения задачи (т.н. особь, или хромосома). При выборе способа кодирования необходимо выбрать:
    - способ скрещивания. Полученная путём скрещивания особь должны быть, пусть и плохим, но решением задачи. Например, в алгоритме поиска маршрута из 2-го узла в 5-ый мы не должны путём скрещивания особей получать особей, который описывают маршрут не из 2-й в 5-ю точку. 
    - способ мутации. Мы должны дать возможность особям случайным образом получить лучший кусок генома (фрагмент наиболее эффективного маршрута), чем у родителей. Но при этом не надо бы, чтобы особь вся радикально случайным образом поменялась (тогда эта особь не выдержит отбора даже с удачным кусочком маршрута, так как сам маршрут весь "от балды").
- способ отбора. Мы должны оценить каждую особь - определить величину применимости особи к решению задачи. При отборе мы оставляем только тех особей, которые наиболее хорошо решают поставленную задачу.

Скрещивание называется ещё кросовером (crossover), или кроссинговером. Кросовер может быть
- одноточечным (левая половинка особи берётся от одного родителя, а правая - от другого)
- многоточечным (фрагменты берутся поочерёдно то от одного, то от другого родителя)
- по маске. Это самый общий случай, включающий в себя и одноточечный, и многоточечный. Случайным или фиксированным образом выбирается маска - последовательность бит. 0 означает одного родителя, 1 - другого.
Способ скрещивания тесно связан со способом кодирования (!!!!). В скрещивании может участвовать и более двух родителей - в таком случае значения в маске для кросовера будут не битами(0 или 1), а числами (0, 1 или 2, если три родителя), само число родителей может быть случайным числом.
Ещё одна сложность, которая может обнаружиться при скрещивании - скрещивание особей с геномом разной длины.



На какой-то итерации у нас есть некая популяция особей. Все они прошли отбор лучших - значит у каждой особи случайным образом выпала пусть не искомая комбинация, но её часть. Только эта часть, за счёт которой особь прошла отбор, у каждой особи разная. Поэтому мы попробуем добавить в нашу популяцию особей, полученных путём скрещивания двух родителей: от одного родителя мы берём начало маршрута (до некой случайной точки), а от второго - конец маршрута.

    Узлы сети мы представим в виде набора индексов (на тот или иной узел сети мы будем ссылаться по индексу) и матрицы смежности.
    Матрица смежности - это симметричная матрица... Это таблица, в которой в ячейке [i, j] лежит стоимость (например, временная задержка) пересылки пакета из узла с индексом i в узел с индексом j. Если связи между двумя узлами нет, то в соответствующей ячейке матрицы будет находиться (бесконечность...) большое число. Можно поступить по-другому: в матрице смежности хранить не стоимость, а величину, обратную стоимости перехода (1/бесконечнсть = 0). Давай поступать так.

    Пусть у нас 10 узлов сети.
    0   1   2   3   4   5   6   7   8   9
    Пусть мы ищем наиболее быстрый маршрут передачи пакета из узла (5) в узел (2).

Мы должны выбрать способ кодирования так, чтобы при кросовере происходила склейка маршрутов, но без потери целостность маршрута...
Какие у нас есть варианты?

1. Набор индексов, по которым будет передаваться пакет
    При скрещивании и мутации мы должны иметь в виду то обстоятельство, что каждый индекс в цепочке может использоваться только один раз. Иначе у нас будет петля. Если мы не будем отсевать петли, наш генетический алгоритм долго будет долго сходиться (в смысле ооочень долго).
    При скрещивании и мутациях у нас должны оставаться неизменными (одинаковыми для всех особей) первое и последнее числа генома - они определяют начальную и конечную точки маршрута (а это исходные данные поставленной задачи).

2. Массив смещений
    Прямая передача пакета из 5-го во 2-й узел будет представлена особью с единственным числом: -3. Это смещение индекса узла.
    Передача по цепочке (5-6-9-3-1-2) будет представлена массивом [1, 3, -6, -2, 1]
    Недостатки такого кодирования: если мы 
"""



#def cross(p_n):
#    sd

#with open('strings.json') as json_data:
#    d = json.load(json_data)
#    print(d)

