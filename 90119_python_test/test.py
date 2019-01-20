#!/usr/bin/python3

from prepa import prepa
import json

test_data = [
    {
        'name': 'bobrovsky',
        'data':(
            (1, 2, 3, 4),
            (5, 6, 7, 8),
            (9, 10, 11, 12),
            (13, 14, 15, 16),
        ),
        'expects':{
            'aa': 'aaa',
            'bb': '222',
            'cc':{
                'cc1': '123',
                '12': '456'
            }
        }
    },
    {
        'name': 'voronezhsky',
        'data':(
            (1, 2, 3, 4),
            (5, 6, 7, 8),
            (9, 10, 11, 12),
            (13, 14, 15, 16),
        ),
        'expects':{
            'aa': 'aaa',
            'bb': '222',
            'cc':{
                'cc1': '123',
                '12': '456'
            }
        }
    }
]

for test_case in test_data:
    #print('------ %s -------' % test_case['name'])
    o1 = prepa(test_case['data'])
    o2 = test_case['expects']
    o1s = json.dumps(o1, sort_keys=True)
    o2s = json.dumps(o2, sort_keys=True)
    print('%s: ------ %s -------' % ('OK' if o1s == o2s else 'ERROR', test_case['name']))

    if o1s != o2s:
        print('input data:')
        counter = 1
        for row in test_case['data']:
            print('\t%s' % str(row))
            counter += 1
        print('expected:')
        print(o2)
        print('taken:')
        print(o1)
    print('\n')
