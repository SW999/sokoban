document.addEventListener('DOMContentLoaded', function () {
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
    bgPos = -297,
    stepSize, // ширина одного элемента поля с отступами = шаг персонажа
    winComb = [], // массив с координатами "выигрышных" положений
    tmpStatus = {}, // сосояние поля на предыдущем ходе
    boss = {},
    isTouchDevice = document.documentElement.classList.contains('touch'),
    $undoBtn = document.getElementById('undoBtn'),
    $map = document.querySelector('.map'),
    $start = document.getElementById('start-game');

  function findPos(obj) {
    if (obj.offsetParent) {
      return [obj.offsetLeft, obj.offsetTop];
    }
  }

  function createMap() {
    var fragment = document.createDocumentFragment(),
      count = 0;

    world.map.forEach(function (v, i) {
      world.map.forEach(function (v1, j) {
        var block,
          mapEl = world.map[i][j],
          personStatus = world.person[i][j],
          blockPos = (topMarginMap + i) * playingFieldSize + leftMarginMap + j;

        if (mapEl === 1) {
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
          block.id = "boss";
          block.className = "person boss";
          block.style.top = findPos(mapBlocks[blockPos])[1] + 'px';
          block.style.left = findPos(mapBlocks[blockPos])[0] + 'px';
          fragment.appendChild(block);
          world.person[i][j] = 0;
          boss = {
            el: block,
            pos: [i, j]
          }
        }
      });
    });
    document.querySelector('.map').appendChild(fragment);
    return boss;
  }

  function checkGameStatus() {
    // После каждого хода проверяем на "выигрыш".
    // Если хоть в одной выигрышной позиции нет персонажа,
    // прерываем проверку. Иначе - уровень пройден.
    return winComb.some(function (v, i) {
      return world.person[winComb[i][0]][winComb[i][1]] === 0;
    }) ? false : levelComplete();
  }

  function levelComplete() {
    var kenny = document.getElementById('slacker2'),
      angel = document.querySelector('.angel');

    angel.style.top = kenny.offsetTop + 'px';
    angel.style.left = kenny.offsetLeft + 'px';
    kenny.classList.add('dead');

    angel.classList.add('show');
    document.querySelector('audio').play();

    console.log('You win!'); // TODO: добавить сообщение и возможность перехода на новый уровень
    stopEvents();
  }

  /* сосояние поля на предыдущем ходе */
  function prevStatus(obj) {
    return tmpStatus = {
      prevBoss: {
        left: boss.el.style.left,
        top: boss.el.style.top,
        pos: boss.pos.slice()
      },
      prevElem: obj === null ? false : {
        el: obj.id,
        left: obj.id.style.left,
        top: obj.id.style.top,
        pos1: [obj.prevPos[0], obj.prevPos[1]],
        pos2: [obj.curPos[0], obj.curPos[1]]
      }
    }
  }

  function finalizeStep(y, x) {
    world.person[y][x] = 0;
    checkGameStatus();
  }

  function stepLeft() {
    var newPos,
      y = boss.pos[0],
      x = boss.pos[1] - 1;

    if (world.map[y][x]) {
      var leftPos = world.person[y][x];
      newPos = parseInt(boss.el.style.left, 10) - stepSize + 'px';

      if (leftPos && world.map[y][x - 1] && !world.person[y][x - 1]) {
        prevStatus({ id: leftPos, prevPos: [y, x], curPos: [y, x - 1] });
        leftPos.style.left = (parseInt(leftPos.style.left, 10) - stepSize) + 'px';
        world.person[y][x - 1] = leftPos;
        boss.pos[1] = x;
        boss.el.style.left = newPos;
        finalizeStep(y, x);
      } else if (!leftPos) {
        prevStatus(null);
        boss.pos[1] = x;
        boss.el.style.left = newPos;
      }
    }
  }

  function stepUp() {
    var newPos,
      y = boss.pos[0] - 1,
      x = boss.pos[1];

    if (boss.pos[0] > 0 && world.map[y][x]) {
      var topPos = world.person[y][x];
      newPos = parseInt(boss.el.style.top, 10) - stepSize + 'px';

      if ((y + 1) > 1 && topPos && world.map[y - 1][x] && !world.person[y - 1][x]) {
        prevStatus({ id: topPos, prevPos: [y, x], curPos: [y - 1, x] });
        topPos.style.top = (parseInt(topPos.style.top, 10) - stepSize) + 'px';
        world.person[y - 1][x] = topPos;
        boss.pos[0] = y;
        boss.el.style.top = newPos;
        finalizeStep(y, x);
      } else if (!topPos) {
        prevStatus(null);
        boss.pos[0] = y;
        boss.el.style.top = newPos;
      }
    }
  }

  function stepRight() {
    var newPos,
    y = boss.pos[0],
    x = boss.pos[1] + 1;

    if (world.map[y][x]) {
      var rightPos = world.person[y][x];
      newPos = parseInt(boss.el.style.left, 10) + stepSize + 'px';

      if (rightPos && world.map[y][x + 1] && !world.person[y][x + 1]) {
        prevStatus({ id: rightPos, prevPos: [y, x], curPos: [y, x + 1] });
        rightPos.style.left = (parseInt(rightPos.style.left, 10) + stepSize) + 'px';
        world.person[y][x + 1] = rightPos;
        boss.pos[1] = x;
        boss.el.style.left = newPos;
        finalizeStep(y, x);
      } else if (!rightPos) {
        prevStatus(null);
        boss.el.style.left = newPos;
        boss.pos[1] = x;
      }
    }
  }

  function stepDown() {
    var newPos,
      y = boss.pos[0] + 1,
      x = boss.pos[1];

    if ((y - 1) < (mapHeight - 1) && world.map[y][x]) {
      var bottomPos = world.person[y][x];
      newPos = parseInt(boss.el.style.top, 10) + stepSize + 'px';

      if ((y - 1) < (mapHeight - 2) && bottomPos && world.map[y + 1][x] && !world.person[y + 1][x]) {
        prevStatus({ id: bottomPos, prevPos: [y, x], curPos: [y + 1, x] });
        bottomPos.style.top = (parseInt(bottomPos.style.top, 10) + stepSize) + 'px';
        world.person[y + 1][x] = bottomPos;
        boss.pos[0] = y;
        boss.el.style.top = newPos;
        finalizeStep(y, x);
      } else if (!bottomPos) {
        prevStatus(null);
        boss.pos[0] = y;
        boss.el.style.top = newPos;
      }
    }
  }

  function undo() {
    boss.pos = tmpStatus.prevBoss.pos.slice(); // Возвращаем "начальника" на предыдущее место
    boss.el.style.left = tmpStatus.prevBoss.left;
    boss.el.style.top = tmpStatus.prevBoss.top;

    if (tmpStatus.prevElem) { // Если перемещался персонаж, то возвращаем его на предыдущее место
      var el = tmpStatus.prevElem.el;

      el.style.left = tmpStatus.prevElem.left;
      el.style.top = tmpStatus.prevElem.top;
      world.person[tmpStatus.prevElem.pos1[0]][tmpStatus.prevElem.pos1[1]] = el;
      world.person[tmpStatus.prevElem.pos2[0]][tmpStatus.prevElem.pos2[1]] = 0;
    }
  }

  function moveBoss(e) {
    var code = e.which;

    switch (code) {
      case 37: //left
        stepLeft();
        break;

      case 38: //top
        stepUp();
        break;

      case 39: //right
        stepRight();
        break;

      case 40: // down
        stepDown();
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
      i = 256,
      angelBlock = document.createElement('div');

    angelBlock.className = 'angel';
    fragment.appendChild(angelBlock);

    while (i--) {
      var block = document.createElement('div');
      block.className = 'map-item';
      fragment.appendChild(block);
    }
    $map.appendChild(fragment);

    mapBlocks = document.querySelectorAll('.map-item');
    stepSize = document.querySelector('.map-item').clientWidth + 3;

    createMap();
    if (isTouchDevice) { // event listeners for touch devices
      document.getElementById('controls-definition').textContent = 'swipe gestures';
      document.getElementById('undo-definition').textContent = 'undo button';
      $map.addEventListener('swipeLeft', stepLeft);
      $map.addEventListener('swipeUp', stepUp);
      $map.addEventListener('swipeRight', stepRight);
      $map.addEventListener('swipeDown', stepDown);
      $start.addEventListener('click', function () {
        document.getElementById('dashboard').classList.add('hidden');
      });
      $undoBtn.addEventListener('click', undo);
    } else {
      document.addEventListener('keyup', moveBoss);
    }
  })();

  function stopEvents() {
    if (isTouchDevice) {
      $map.removeEventListener('swipeLeft', stepLeft);
      $map.removeEventListener('swipeUp', stepUp);
      $map.removeEventListener('swipeRight', stepRight);
      $map.removeEventListener('swipeDown', stepDown);
      $undoBtn.removeEventListener('click', undo);
    } else {
      document.removeEventListener('keyup', moveBoss);
    }
  }

});
