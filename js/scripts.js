(function () {

  var mapBlocks, // массив элементов игрового поля по классу
    world = {
      map: [ // 1 - возможно перемещение, 2 - выигрышное положение
        [2, 2, 1, 2, 2],
        [2, 2, 0, 2, 2],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 0, 1, 1]
      ],

      person: [ // 1 - начальное положение персонажа, 2 - положение "начальника"
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 2, 0]
      ]
    },
    playingFieldSize = 16,
    mapWidth = world.map[0].length,
    mapHeight = world.map.length,
    leftMarginMap = ~~((playingFieldSize - mapWidth) / 2),
    topMarginMap = ~~((playingFieldSize - mapHeight) / 2),
    blockPos,
    bgPos = -297,
    stepSize, // ширина одного элемента поля с отступами = шаг персонажа
    winComb = [], // массив с координатами "выигрышных" положений
    tmpStatus = {}, // сосояние поля на предыдущем ходе
    manager = {};

  function findPos(obj) {
    if (obj.offsetParent) {
      return [obj.offsetLeft, obj.offsetTop];
    } else {
      return false;
    }
  }

  function createMap() {
    var fragment = document.createDocumentFragment(),
      count = 0;
    world.map.forEach(function(v,i) {
      world.map.forEach(function(v1,j) {
        var block,
          mapEl = world.map[i][j],
          personStatus = world.person[i][j];

        blockPos = (topMarginMap + i) * playingFieldSize + leftMarginMap + j;
        if (mapEl > 0) {
          mapBlocks[blockPos].classList.add('passage');
        }
        if (mapEl === 2) {
          mapBlocks[blockPos].classList.add('workplace');
          winComb.push([i, j]);
        }

        if (personStatus === 1) {
          var thisId = "slacker" + count++;
          block = document.createElement('div');
          bgPos += stepSize - 3;
          block.className = "person employee";
          block.id = thisId;
          block.style.top = findPos(mapBlocks[blockPos])[1] + 'px';
          block.style.left = findPos(mapBlocks[blockPos])[0] + 'px';
          block.style.backgroundPosition = bgPos + 'px 0';
          fragment.appendChild(block);
          world.person[i][j] = block;
        }
        if (personStatus === 2) {
          block = document.createElement('div');
          block.id = "manager";
          block.className = "person manager";
          block.style.top = findPos(mapBlocks[blockPos])[1] + 'px';
          block.style.left = findPos(mapBlocks[blockPos])[0] + 'px';
          fragment.appendChild(block);
          world.person[i][j] = 0;
          manager = {
            el: block,
            pos: [i, j]
          }
        }
      });
    });
    document.querySelector('.map').appendChild(fragment);
    return manager;
  }

  function gameStatus() {
    // После каждого хода проверяем на "выигрыш".
    // Если хоть в одной выигрышной позиции нет персонажа,
    // прерываем проверку. Иначе - уровень пройден.
    return winComb.some(function(v,i) {
      return world.person[winComb[i][0]][winComb[i][1]] === 0;
    }) ? false : levelComplete();
  }

  function levelComplete() {
    console.log('You win!'); // TODO: добавить сообщение и возможность перехода на новый уровень
    var kenny = document.querySelector('#slacker2');
    kenny.classList.add('dead');
    document.querySelector('audio').play();
  }

  /* сосояние поля на предыдущем ходе */
  function prevStatus(obj) {
    return tmpStatus = {
      lastManager: {
        left: manager.el.style.left,
        top: manager.el.style.top,
        pos: manager.pos.slice()
      },
      lastElem: (function () {
        if (obj !== null) {
          return {
            el: obj.id,
            left: obj.id.style.left,
            top: obj.id.style.top,
            pos1: [obj.prevPos[0], obj.prevPos[1]],
            pos2: [obj.curPos[0], obj.curPos[1]]
          }
        } else {
          return false;
        }
      })()
    }
  }

  function undo() {
    manager.pos = tmpStatus.lastManager.pos.slice(); // Возвращаем "начальника" на предыдущее место
    manager.el.style.left = tmpStatus.lastManager.left;
    manager.el.style.top = tmpStatus.lastManager.top;

    if (tmpStatus.lastElem) { // Если перемещался персонаж, то возвращаем его на предыдущее место
      var el = tmpStatus.lastElem.el;
      el.style.left = tmpStatus.lastElem.left;
      el.style.top = tmpStatus.lastElem.top;
      world.person[tmpStatus.lastElem.pos1[0]][tmpStatus.lastElem.pos1[1]] = el;
      world.person[tmpStatus.lastElem.pos2[0]][tmpStatus.lastElem.pos2[1]] = 0;
    }
  }

  function moveManager(e) {
    var code = e.which,
      newPos,
      x, y,
      auxiliaryFunc = function() {
        world.person[y][x] = 0;
        gameStatus();
      },
      param = {};// параметры для отмены хода

    switch (code) {
      case 37: //left
        y = manager.pos[0];
        x = manager.pos[1] - 1;
        if (world.map[y][x]) {
          var leftPos = world.person[y][x];
          newPos = parseInt(manager.el.style.left, 10) - stepSize + 'px';
          if (leftPos && world.map[y][x - 1] && !world.person[y][x - 1]) {
            param = {id: leftPos, prevPos: [y, x], curPos: [y, x - 1]};
            prevStatus(param);
            leftPos.style.left = (parseInt(leftPos.style.left, 10) - stepSize) + 'px';
            world.person[y][x - 1] = leftPos;
            manager.pos[1] = x;
            manager.el.style.left = newPos;
            auxiliaryFunc();
          } else if (!leftPos) {
            prevStatus(null);
            manager.pos[1] = x;
            manager.el.style.left = newPos;
          }
        }
        break;
      case 38: //top
        y = manager.pos[0] - 1;
        x = manager.pos[1];
        if (manager.pos[0] > 0 && world.map[y][x]) {
          var topPos = world.person[y][x];
          newPos = parseInt(manager.el.style.top, 10) - stepSize + 'px';
          if ((y + 1) > 1 && topPos && world.map[y - 1][x] && !world.person[y - 1][x]) {
            param = {id: topPos, prevPos: [y, x], curPos: [y - 1, x]};
            prevStatus(param);
            topPos.style.top = (parseInt(topPos.style.top, 10) - stepSize) + 'px';
            world.person[y - 1][x] = topPos;
            manager.pos[0] = y;
            manager.el.style.top = newPos;
            auxiliaryFunc();
          } else if (!topPos) {
            prevStatus(null);
            manager.pos[0] = y;
            manager.el.style.top = newPos;
          }
        }
        break;
      case 39: //right
        y = manager.pos[0];
        x = manager.pos[1] + 1;
        if (world.map[y][x]) {
          var rightPos = world.person[y][x];
          newPos = parseInt(manager.el.style.left, 10) + stepSize + 'px';
          if (rightPos && world.map[y][x + 1] && !world.person[y][x + 1]) {
            param = {id: rightPos, prevPos: [y, x], curPos: [y, x + 1]};
            prevStatus(param);
            rightPos.style.left = (parseInt(rightPos.style.left, 10) + stepSize) + 'px';
            world.person[y][x + 1] = rightPos;
            manager.pos[1] = x;
            manager.el.style.left = newPos;
            auxiliaryFunc();
          } else if (!rightPos) {
            prevStatus(null);
            manager.el.style.left = newPos;
            manager.pos[1] = x;
          }
        }
        break;
      case 40: // down
        y = manager.pos[0] + 1;
        x = manager.pos[1];
        if ((y - 1) < (mapHeight - 1) && world.map[y][x]) {
          var bottomPos = world.person[y][x];
          newPos = parseInt(manager.el.style.top, 10) + stepSize + 'px';
          if ((y - 1) < (mapHeight - 2) && bottomPos && world.map[y + 1][x] && !world.person[y + 1][x]) {
            param = {id: bottomPos, prevPos: [y, x], curPos: [y + 1, x]};
            prevStatus(param);
            bottomPos.style.top = (parseInt(bottomPos.style.top, 10) + stepSize) + 'px';
            world.person[y + 1][x] = bottomPos;
            manager.pos[0] = y;
            manager.el.style.top = newPos;
            auxiliaryFunc();
          } else if (!bottomPos) {
            prevStatus(null);
            manager.pos[0] = y;
            manager.el.style.top = newPos;
          }
        }
        break;
      case 32: // undo клавиша "space"
        undo();
        break;
      default:
        return false;
    }
  }

  (function init() {
    // Строим игровое поле.
    var fragment = document.createDocumentFragment(),
      i = 256;
    while (i--) {
      var block = document.createElement('div');
      block.className = "map-item";
      fragment.appendChild(block);
    }
    document.querySelector('.map').appendChild(fragment);

    mapBlocks = document.querySelectorAll('.map-item');
    stepSize = document.querySelector('.map-item').clientWidth + 3;

    createMap();
    document.addEventListener('keyup', moveManager, false);
  })();

})();
