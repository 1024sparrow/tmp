'use strict';

function _getHtml(p){
    if (p.table){
        if (!p.table.header){
            console.error('header must be!');
            return retVal;
        }
        var retVal = '<table>';
        if (p.table.content){
            let rsc = {};
            for (let row of p.table.content){
                let csc = 1;
                retVal += '<tr>';
                for (let iCol = 0 ; iCol < row.length ; iCol++){
                    //console.log(`(${iCol}) csc=${csc} rsc=${JSON.stringify(rsc)}`);
                    if (csc > 1){
                        csc--;
                        if ((rsc[iCol] || 1) > 1){
                            rsc[iCol]--;
                        }
                        continue;
                    }
                    if ((rsc[iCol] || 1) > 1){
                        rsc[iCol]--;
                        continue;
                    }
                    //console.log('insert td');
                    retVal += '<td';
                    let cs = 1;
                    let rs = 1;
                    let text = row[iCol];
                    if (typeof text !== 'string'){
                        cs = text.colspan || 1;
                        rs = text.rowspan || 1;
                        text = text.text;
                    }
                    if (cs > 1){
                        csc = cs;
                        retVal += ` colspan=${cs}`;
                    }
                    if (rs > 1){
                        for (let i = 0 ; i < cs ; i++){
                            rsc[iCol + i] = rs;
                        }
                        retVal += ` rowspan=${rs}`;
                    }
                    retVal += '>';
                    retVal += text;
                    retVal += '</td>';
                }
                retVal += '</tr>';
            }
        }
        retVal += '</table>';
    }
    return retVal;
}

var o1 = {
    table:{
        header:['h1', 'h2', 'h3'],
        content: [
            ['e11', 'e12', 'e13'],
            ['e21', 'e22', 'e23'],
            ['e31', 'e32', 'e33'],
            ['e41', 'e42', 'e43']
        ]
    }
};
var o2 = {
    table:{
        header:['h1', 'h2', 'h3'],
        content: [
            [{rowspan:2, text:'e11rowspan'}, {rowspan:2, text:'e12rowspan'}, 'e13'],
            ['e21', 'e22', 'e23'],
            ['e31', {colspan:2, text:'e32colspan'}, 'e33'],
            ['e41', 'e42', 'e43']
        ]
    }
};

var html = _getHtml(o2);
document.getElementById('slot').innerHTML = html;

console.log('===========');
console.log(html);
