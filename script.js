'use strict';

(function(){
    var taskname = window.location.href;
    var startMarker, a, b;
    startMarker = '/80911_script_for_job/'; // '/user/'
    a = taskname.indexOf(startMarker) + startMarker.length;
    b = taskname.indexOf('/index.html', a); // '/front/'
    taskname = taskname.slice(a, b);
    console.log('taskname:', taskname);
    var figPathPrefix = ''; // '/.../user/' + tsakname + '/front/html/index.html';

    var list = document.getElementsByTagName('fig');

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
        eimg.src = figPathPrefix + 'fig/' + (i + 1) + '.png';
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
