#!/usr/bin/env python3

# массив[x:y] - эта конструкция даёт нам подмассив (от x до y исключительно)
# массив[x:] - подмассив от x-го элемента (включительно) и до конца
# массив[:y] - подмассив от начала до y-го элемента (исключительно)

import sys
from random import random

def rand(): # функция, дающая случайное целое число
    return int(32000 * random())

# Класс Genetic.
class Genetic:
    # Конструктор класса. Когда будет создаваться экземпляр этого класса, конструктор будет вызываться для инициализации создаваемого экземпляра.
    def __init__(this, p_sett): # Конструктор принимает один параметр - объект с настройками (в любой метод, в том числе и конструктор, перед параметрами явно передаётся this - указатель на экземпляр класса)
        print('конструктор') # Вывод в консоль
        this.sett = p_sett # заводим поле класса sett
        this.count = len(p_sett['adja_matrix']) # adja_matrix - матрица смежности (массив массивов, т.е. массив строк, где каждая строка представлена массивом), count - общее количество узлов в сети
        this.cross_point = p_sett['cross_point']
        print('число узлов в сети:', this.count) #  вывод в консоль
        this.population = [] # Исходная популяция - пустой массив

    # Запустить заданное количество циклов (в графическом интерфейсе не используется)
    def loop(this, p_n):
        # Если первая популяция ещё не была сгенерирована (пустой массив), то сгенерировать первую популяцию
        if len(this.population) == 0:
            this.generate_first_population()
        # Для i от 0 до p_n (не включая сам p_n)
        for i in range(0, p_n):
            print('---- цикл %s ----' % (i + 1))
            this.cross()
            #this.show_population(True)
            this.selection()
            this.mutate()
            this.mutate()
            #this.show_population(True)
            this.selection()

    # Автоматическое решение (кнопка "Автоматически решить задачу")
    def solve(this):
        # Если первая популяция ещё не была сгенерирована (пустой массив), то сгенерировать первую популяцию
        if len(this.population) == 0:
            this.generate_first_population()
        # В результате каждого цикла (завершается операцией отбора)
        # получаем некоторую популяция
        min_val = None
        counter = 0
        loop_counter = 0
        while counter < 20:
            print('---- цикл %s ----' % (loop_counter + 1))
            this.cross()
            this.selection()
            this.mutate()
            this.mutate()
            tmp = this.selection()
            if not min_val is None and tmp[0] < min_val:
                counter = 0
            else:
                counter += 1
            loop_counter += 1
        print('Задача решена за %s циклов' % loop_counter)
        print('Решение: %s' % tmp[1])


    # Генерация первой популяции
    def generate_first_population(this):
        print('генерирование первой популяции')
        this.population = []
        # особи в популяции могут быть и одинаковыми
        for i1 in range(0, this.sett['first_pop_count']):
            cand_len = this.count # rand() % (this.count - 2)
            chromosome = [this.sett['direction']['from']]
            used = {
                this.sett['direction']['from'],
                this.sett['direction']['to']
            }
            while len(used) < cand_len:
                cand = rand() % this.count
                if not cand in used:
                    used.add(cand)
                    chromosome.append(cand)
            chromosome.append(this.sett['direction']['to'])
            this.population.append(chromosome)
        pass

    # Фитнес-функция
    # Эта функция количественно характеризует, насколько хорошо подходит особь chr в качестве решения задачи
    def chr_fitness(this, chr):
        # возвращает стоимость передачт сллбщения по указанному маршруту
        # особое значение: -1. Оно соответствует невозможности передачи пакета по этому маршруту (ввиду отсутствия связи между какой-то из задействованных пар узлов)
        # мы считаем возвращаемое значение ret_val как сумму значений из матрицы смежности. Значения из матрицы смежности берутся для пар индексов узлов: предыдущего и текущего. Поэтому у нас prev_node присвается пустое значение (None), по которому мы в цикле определяем, что предыдущего узла нет, и мы не пытаемся брать значение из матрицы смежности.
        adja = this.sett['adja_matrix'] # матрица смежности (массив строк, т.е. массив массивов)
        ret_val = 0
        prev_node = None
        for node in chr: # цикл по индексам узлов в особи chr
            if prev_node is not None:
                tmp = adja[prev_node][node]
                if tmp < 0: # если в матрице смежности встретилось значение -1 (меньше нуля), то такой маршрут является непроходимым, и мы возвращаем -1 (такая особь категорически не подходит нам в качестве решения задачи).
                    return -1
                ret_val += tmp # в ret_val накапливаем значения из матрицы смежности
            prev_node = node # тот узел, что сейчас текущий, в следущем проходе цикла будет предыдущим
        return ret_val

    # Отбор. Оставляет только исходное количество особей (т.е. как при первой генерации) самых лучших - у которых fitness (стоимость доставки) меньше
    # Возвращаемое значение (ret_val) - пара (кортеж (т.е. неизменяемый массив), состоящий из двух элементов) <значение fitness-функции> - <особь (массив)>
    def selection(this):
        print('селекция')
        ret_val = None
        # (this.chr_fitness(i), i) - пара, пр которую писал выше. У нас в переменной fitness образуется массив таких пар - для каждой особи в популяции.
        fitness = [(this.chr_fitness(i), i) for i in this.population] # по популяции получаем список пар (стоимость_доставки, сам_маршрут)
        # Фунция sorted() возвращает отсортированную копию передаемого параметром массива. key - функция, которая для элемента массива (у нас это пара) возвращает то число, по которому такие элементы массива должны быть отсортированы. Мы сортируем по значению фитнеса, то есть по первому элементу пары (pair[0])
        fitness = sorted(fitness, key = lambda pair: pair[0]) # сортируем список пар в порядке возрастания стоимости доставки
        # обнуляем популяцию. Теперь текущая популяция - пустой массив.
        this.population = []
        count = 0 # счётчик элементов, которые попали в текущую популяцию
        # первые 'first_pop_count' маршрутов записываем в this.population, откидывая при этом в принципе непроходимые маршруты (их стоимость доставки имеет значение -1)
        for pair in fitness:
            # если фитнес отрицательный, то не не оставляем такую особь - продолжаем выполнение цикла, но уже со следующей итерации (continue)
            if pair[0] < 0:
                continue # продолжаем цикл, пропустив текущую итерацию
            if count >= this.sett['first_pop_count']:
                break # выходим из цикла
            this.population.append(pair[1]) # добавляем особь в нашу популяцию
            if ret_val is None or pair[0] < ret_val[0]: # если возвращаемое значение ещё не определено или мы нашли более подходящую кандидатуру, то присваем пару ret_val-у
                ret_val = pair
            print(pair) # выводим в консоль
            count += 1 # наращиваем счётчик
        return ret_val

    # Мутация
    def mutate(this):
        # раз у нас в особи все узлы задействованы, то единственная возможная мутация - изменения порядка узлов
        # Коточе. Меняем любые два значения в массиве местами. Мутированную особь доюавляем в популяцию.
        # Не забываем только, что первя и последняя точка должны остаться неизменными
        init_popul_count = len(this.population) # численность популяции на момент начала мутации
        for i in range(0, init_popul_count):
            cand = this.population[i].copy() # копируем особь
            index1 = 1 + rand() % (this.count - 2) # случайное число от 1 до (<число_узлов> - 1). Два - это один с начала плюс один с конца.
            index2 = 1 + rand() % (this.count - 2)
            # меняем два числа местами
            tmp = cand[index1]
            cand[index1] = cand[index2]
            cand[index2] = tmp
            # добавляем нашу копию к популяции
            this.population.append(cand)

    # Скрещивание
    def cross(this):
        print('скрещивание')
        # 1. составляем пары (pairMap), которые будем скрещивать
        # 2. путём перемены элементов местами, подгоняем особи так, чтобы в хвосте не было таких узлов, как уже получилось в голове.
        # 3. добавляем ребёнка в популяцию

        pairMap = [] # индексы партнёров для скрещивания. Получаются случайным образом
        #heads = []
        for i in range(0, len(this.population)):
            cand = rand() % len(this.population) # случайно выбранный индекс партнёра
            pairMap.append(cand)
            #heads.append(this.population[i][:this.cross_point])
        popul_init_count = len(this.population) # исходная численность популяции
        for i in range(0, popul_init_count):
            substIndex = 0 # из хвоста, если надо, будем брать элементы. После того как взяли, этот счётчик будет наращиваться на 1.
            head1 = this.population[i][:this.cross_point] # голова первого родителя
            tail1 = this.population[i][this.cross_point:] # хвост первого родителя, пользуемся тем обстоятельством, что здесь всё то, чего нет в голове
            child = this.population[pairMap[i]].copy() # копия второго родителя. Из неё будем делать ребёнка.
            tail2 = child[this.cross_point:] # хвост второго родителя
            # наш ребёнок (child) должен иметь голову (первую половину) от первого родителя и хвост (вторую половину) от второго родителя
            for j in range(0, this.count):
                if j < this.cross_point:
                    child[j] = head1[j]
                else:
                    if child[j] in head1: # если индекс узла (child[j]) есть в head1
                        cand = tail1[substIndex]
                        substIndex += 1
                        while cand in child:
                            cand = tail1[substIndex]
                            substIndex += 1
                        child[j] = cand
                    #else: оставляем без изменений
            this.population.append(child)

    # Отображение текущей популяции
    def show_population(this, detailed = False):
        print('Популяция состоит из %s особей' % len(this.population))
        if detailed:
            for row in this.population:
                print(row)
