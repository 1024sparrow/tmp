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
        print('число узлов в сети:', this.count)
        this.population = []

    def loop(this, p_n):
        if len(this.population) == 0:
            this.generate_first_population()
        for i in range(0, p_n):
            print('---- цикл %s ----' % i)
            this.cross()
            this.show_population(True)
            this.selection()
            this.mutate()
            this.mutate()
            this.show_population(True)
            this.selection()


    def generate_first_population(this):
        print('генерирование первой популяции')
        this.population = [
            #[this.sett['direction']['from'], this.sett['direction']['to']]
        ]
        # особи в популяции могут быть и одинаковыми
        for i1 in range(0, this.sett['first_pop_count']):
            #print(i1)
            cand_len = rand() % (this.count - 2)
            #print('cand_len:', cand_len)
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
            #print(chromosome)
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
            print(pair)
            count += 1

    def mutate(this):
        # при мутации мы не видоизменяем всех особей
        # мы делаем копию всей популяции, всех в копии популяции мутируем, и затем эту копию добавляем в нашу популяцию. Таким образом, в результате такой мутации численность популяции должна удвоиться
        print('Мутация. Текущую популяцию дополняем мутированными копиями')
        mutated_copy = this.population.copy()
        for chr in mutated_copy:
            #chr_orig = chr.copy()
            if len(chr) == this.count:
                if_delete = True
            elif len(chr) == 2:
                if_delete = False
            else:
                if_delete = rand() % 2 == 0
            if if_delete:
                index = rand() % (len(chr) - 2) + 1
                chr = chr[:index] + chr[index + 1:]
            else:
                index = rand() % (len(chr) - 1)
                a = set(chr)
                cand = rand() % this.count
                while cand in a: # подбираем такой узел, какой ещё не был использован в особи
                    cand = rand() % this.count
                chr = chr[:index + 1] + [cand] + chr[index + 1:]
            #print('%s\t-->\t%s' % (chr_orig, chr))
            this.population.append(chr)

    def cross(this):
        print('скрещивание')
        # Скрещивание у нас будет по одной точке - по одной случайной точке
        # Сначала случайным образом поделим каждую хромосому на две части, а затем для каждой головы случайным образом подберём такой хвост, чтобы в хвосте ни один узел не был задействован в голове
        heads = [] # Оторванные по случайному индексу головы хромосом.
        tails = [] # Оторванные по случайному индексу хвосты хромосом.
        children = []
        #print(this.population)
        for chr in this.population:
            if len(chr) == 2:
                heads.append([])
                tails.append([])
            else:
                index = (rand() % (len(chr) - 2)) + 1
                heads.append(chr[1:index])
                tails.append(chr[index:len(chr) - 1])

        #print('heads:')
        #print('======')
        #print(heads)
        #print('tails:')
        #print('======')
        #print(tails)

        while heads:
            head = heads.pop() # извлекаем последний элемент из списка голов. Это кортеж из списка и множества.
            head_set = set(head)
            tmp = tails.copy()
            ok = False
            while tmp and not ok:
                index = rand() % len(tmp)
                tail = tmp[index]
                ok = True
                for i in tail:
                    if i in head_set: # Если в хвосте попался индекс узла, который есть в голове, то такой хвост нам не подходит
                        ok = False
                        tmp = tmp[:index] + tmp[index + 1:] # из массива хвостов-кандидатов убрали этого неудачника
                        break
                if ok: # склеиваем голову и хвост, добавляем в список детей, убираем этот хвост и эту голову из дальнейшего рассмотрения - они больше не будут участвовать в скрещивании
                    children.append([this.sett['direction']['from']] + head + tail + [this.sett['direction']['to']])
                #else:
                #    print('для головы ', head, 'не нашлось подходящего хвоста')
        #print('children:')
        #print('=========')
        #print(children)
        this.population += children
        
    def show_population(this, detailed = False):
        print('Популяция состоит из %s особей' % len(this.population))
        if detailed:
            for row in this.population:
                print(row)
