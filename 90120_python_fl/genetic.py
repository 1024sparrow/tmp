#!/usr/bin/env python3

import sys
from random import random

def rand(): # функция, дающая случайное целое число
    return int(32000 * random())

class Genetic:
    def __init__(this, p_sett):
        print('конструктор')
        this.sett = p_sett
        this.count = len(p_sett['adja_matrix']) # adja_matrix - матрица смежности, count - общее количество узлов в сети
        this.cross_point = p_sett['cross_point']
        print('число узлов в сети:', this.count)
        this.population = []

    def loop(this, p_n):
        if len(this.population) == 0:
            this.generate_first_population()
        for i in range(0, p_n):
            print('---- цикл %s ----' % (i + 1))
            this.cross()
            #this.show_population(True)
            this.selection()
            this.mutate()
            this.mutate()
            #this.show_population(True)
            this.selection()

    def solve(this):
        if len(this.population) == 0:
            this.generate_first_population()
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

    def chr_fitness(this, chr):
        # возвращает стоимость передачт сллбщения по указанному маршруту
        # особое значение: -1. Оно соответствует невозможности передачи пакета по этому маршруту (ввиду отсутствия связи между какой-то из задействованных пар узлов)
        adja = this.sett['adja_matrix']
        ret_val = 0
        prev_node = None
        for node in chr:
            if prev_node is not None:
                tmp = adja[prev_node][node]
                if tmp < 0:
                    return -1
                ret_val += tmp
            prev_node = node
        #print(ret_val)
        return ret_val
        #return len(chr)

    def selection(this):
        print('селекция')
        ret_val = None
        # сортируем нашу популяцию в порядке возрастания стоимости доставки пакета (в порядке возрастания fitness)
        fitness = [(this.chr_fitness(i), i) for i in this.population] # по популяции получаем список пар (стоимость_доставки, сам_маршрут)
        fitness = sorted(fitness, key = lambda pair: pair[0]) # сортируем список пар в порядке возрастания стоимости доставки
        #print(fitness)
        this.population = []
        count = 0
        # первые 'first_pop_count' маршрутов записываем в this.population, откидывая при этом в принципе непроходимые маршруты (их стоимость доставки имеет значение -1)
        for pair in fitness:
            if pair[0] < 0:
                continue # продолжаем цикл, пропустив текущую итерацию
            if count >= this.sett['first_pop_count']:
                break # выходим из цикла
            this.population.append(pair[1])
            if ret_val is None or pair[0] < ret_val[0]:
                ret_val = pair
            print(pair)
            count += 1
        return ret_val

    def mutate(this):
        # раз у нас в особи все узлы задействованы, то единственная возможная мутация - изменения порядка узлов
        # Коточе. Меняем любые два значения в массиве местами. Мутированную особь доюавляем в популяцию.
        # Не забываем только, что первя и последняя точка должны остаться неизменными
        init_popul_count = len(this.population)
        for i in range(0, init_popul_count):
            cand = this.population[i].copy()
            index1 = 1 + rand() % (this.count - 1)
            index2 = 1 + rand() % (this.count - 1)
            tmp = cand[index1]
            cand[index1] = cand[index2]
            cand[index2] = tmp
            this.population.append(cand)

    def cross(this):
        print('скрещивание')
        # 1. составляем пары, которые будем скрещивать
        # 2. путём перемены элементов местами, подгоняем особи так, чтобы в хвосте ....

        pairMap = [] # индексы партнёров для скрещивания. Получаются случайным образом
        #heads = []
        for i in range(0, len(this.population)):
            cand = rand() % len(this.population) # случайно выбранный индекс партнёра
            pairMap.append(cand)
            #heads.append(this.population[i][:this.cross_point])
        popul_init_count = len(this.population) # исходная численность популяции
        for i in range(0, popul_init_count):
            substIndex = 0 # из головы, если надо, будем брать элементы. После того как взяли, этот счётчик будет наращиваться на 1.
            head1 = this.population[i][:this.cross_point] # голова первого родителя
            tail1 = this.population[i][this.cross_point:] # хвост первого родителя, пользуемся тем обстоятельством, что здесь всё то, чего нет в голове
            child = this.population[pairMap[i]].copy() # копия второго родителя. Из неё будем делать ребёнка.
            tail2 = child[this.cross_point:] # хвост второго родителя
            # наш ребёнок (child) должен иметь голову (первую половину) от первого родителя и хвост (вторую половину) от второго родителя
            for j in range(0, this.count):
                if j < this.cross_point:
                    child[j] = head1[j]
                else:
                    if child[j] in head1:
                        cand = tail1[substIndex]
                        substIndex += 1
                        while cand in child:
                            cand = tail1[substIndex]
                            substIndex += 1
                        child[j] = cand
                    #else: оставляем без изменений
            this.population.append(child)

        
    def show_population(this, detailed = False):
        print('Популяция состоит из %s особей' % len(this.population))
        if detailed:
            for row in this.population:
                print(row)
