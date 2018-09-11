'use strict';

var list = document.getElementsByTagName('fig');
console.log('list:', list);

var epTitle, eimg, edivImg, i, c, e;
for (i = 0, c = list.length ; i < c ; i++)
{
    e = list[i];
    epTitle = document.createElement('p');
    epTitle.innerText = e.title;
    e.appendChild(epTitle);

    edivImg = document.createElement('div');
    eimg = document.createElement('img');
    eimg.src = 'fig/' + (i + 1) + '.png';
    eimg.alt = 'Нет картинки...';
    edivImg.appendChild(eimg);
    e.appendChild(edivImg);
}
