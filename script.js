'use strict';

(function(){
    var list = document.getElementsByTagName('fig');
    console.log('list:', list);

    var epTitle, eimg, edivImg, i, c, e;
    var imagesNormal = [], imagesFs = [];
    for (i = 0, c = list.length ; i < c ; i++)
    {
        e = list[i];
        epTitle = document.createElement('p');
        epTitle.innerText = 'Рисунок ' + (i+1) + ' - ' + e.title;
        e.appendChild(epTitle);

        edivImg = document.createElement('div');
        eimg = document.createElement('img');
        eimg.src = 'fig/' + (i + 1) + '.png';
        eimg.alt = '';
        eimg.width = 50;
        eimg.height = 50;
        (e.hasAttribute('fs') ? imagesFs : imagesNormal).push(eimg);
        edivImg.appendChild(eimg);
        e.appendChild(edivImg);
    }
    function f(){
        var w = window.innerWidth;
        var h = window.innerHeight;
        var wOwn, hOwn, aspectRatio, tmp;
        for (i = 0, c = imagesNormal.length ; i < c ; i++){
            var e = imagesNormal[i];
            if (!e.naturalHeight)
                continue;
            wOwn = e.naturalWidth;
            hOwn = e.naturalHeight;
            aspectRatio = wOwn / hOwn;
            console.log('aspect ratio: ', aspectRatio);

            if (w > h * aspectRatio){
                e.height = 0.7 * hOwn;
                e.width = 0.7 * hOwn / aspectRatio;
            }
            else{
                e.width = 0.7 * wOwn;
                e.height = 0.7 * wOwn * aspectRatio;
            }
        }
        for (i = 0, c = imagesFs.length ; i < c ; i++){
            var e = imagesFs[i];
            if (!e.naturalHeight)
                continue;
            wOwn = e.naturalWidth;
            hOwn = e.naturalHeight;
            aspectRatio = wOwn / hOwn;
            console.log('aspect ratio: ', aspectRatio);

            if (w > h * aspectRatio){
                tmp = 0.7 * h;
                e.height = tmp;
                e.width = tmp / aspectRatio;
            }
            else{
                tmp = 0.7 * w;
                e.width = tmp;
                e.height = tmp * aspectRatio;
            }
        }
    }
    window.addEventListener('load', f, true);
    window.addEventListener('resize', f, true);
})();
