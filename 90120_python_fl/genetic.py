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

    def generate_first_population(this):
        print('генерирование первой популяции')
        this.population = [
            #[this.sett['direction']['from'], this.sett['direction']['to']]
        ]
        # особи в популяции могут быть и одинаковыми
        for i1 in range(0, this.sett['first_pop_count'] - 1):
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

    def selection(this):
        pass

    def mutate(this):
        pass

    def cross(this):
        print('скрещивание')
        # Скрещивание у нас будет по одной точке - по одной случайной точке
        # Сначала случайным образом поделим каждую хромосому на две части, а затем для каждой головы случайным образом подберём такой хвост, чтобы в хвосте ни один узел не был задействован в голове
        heads = [] # Оторванные по случайному индексу головы хромосом. Храним кортежи (first, second) из 1.самого фрагмента хромосомы и 2.множества задействованных узлов
        tails = [] # Оторванные по случайному индексу хвосты хромосом. Храним сами фрагменты хромосом
        children = []
        #print(this.population)
        for chr in this.population:
            if len(chr) == 2:
                heads.append(([], set()))
                tails.append([])
            else:
                index = (rand() % (len(chr) - 2)) + 1
                tmp = chr[1:index]
                heads.append((tmp, set(tmp)))
                tmp = chr[index:len(chr) - 1]
                tails.append(tmp)

        #print('heads:')
        #print('======')
        #print(heads)
        #print('tails:')
        #print('======')
        #print(tails)

        while heads:
            head = heads.pop() # извлекаем последний элемент из списка голов. Это кортеж из списка и множества.
            tmp = tails.copy()
            ok = False
            while tmp and not ok:
                index = rand() % len(tmp)
                tail = tmp[index]
                ok = True
                for i in tail:
                    if i in head[1]: # Если в хвосте попался индекс узла, который есть в голове, то такой хвост нам не подходит
                        ok = False
                        tmp = tmp[:index] + tmp[index + 1:] # из массива хвостов-кандидатов убрали этого неудачника
                        break
                if ok: # склеиваем голову и хвост, добавляем в список детей, убираем этот хвост и эту голову из дальнейшего рассмотрения - они больше не будут участвовать в скрещивании
                    children.append([this.sett['direction']['from']] + head[0] + tail + [this.sett['direction']['to']])
                #else:
                #    print('для головы ', head[0], 'не нашлось подходящего хвоста')
        #print('children:')
        #print('=========')
        #print(children)
        this.population += children
        
