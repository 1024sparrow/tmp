#!/usr/bin/env python3

import sys
from random import random

def rand(): # функция, дающая случайное целое число
    return int(32000 * random())

class Genetic:
    def __init__(this, p_sett):
        print('конструктор')
        this.sett = p_sett
        this.count = len(p_sett['adja_matrix'])
        print('число узлов в сети:', this.count)
        this.population = []

    def generate_first_population(this):
        print('generate_first_population')
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
            print(chromosome)
        pass

    def selection(this):
        pass
