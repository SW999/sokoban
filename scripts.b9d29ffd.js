parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"VJtr":[function(require,module,exports) {
document.addEventListener("DOMContentLoaded",function(){var e,t,s={map:[[2,2,1,2,2],[2,2,0,2,2],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,0,1,1]],person:[[0,0,1,0,0],[0,0,0,0,0],[0,1,1,1,0],[0,0,1,0,0],[0,1,1,1,0],[0,0,0,2,0]]},o=16,n=s.map[0].length,p=s.map.length,l=~~((o-n)/2),r=~~((o-p)/2),a=-297,i=[],d={},c={},m=document.documentElement.classList.contains("touch"),u=document.getElementById("undoBtn"),f=document.querySelector(".map"),v=document.getElementById("start-game");function y(e){if(e.offsetParent)return[e.offsetLeft,e.offsetTop]}function E(){return!i.some(function(e,t){return 0===s.person[i[t][0]][i[t][1]]})&&(e=document.getElementById("slacker2"),(t=document.querySelector(".angel")).style.top=e.offsetTop+"px",t.style.left=e.offsetLeft+"px",e.classList.add("dead"),t.classList.add("show"),document.querySelector("audio").play(),console.log("You win!"),void(m?(f.removeEventListener("swipeLeft",g),f.removeEventListener("swipeUp",x),f.removeEventListener("swipeRight",w),f.removeEventListener("swipeDown",k),u.removeEventListener("click",I)):document.removeEventListener("keyup",P)));var e,t}function L(e){return d={prevBoss:{left:c.el.style.left,top:c.el.style.top,pos:c.pos.slice()},prevElem:null!==e&&{el:e.id,left:e.id.style.left,top:e.id.style.top,pos1:[e.prevPos[0],e.prevPos[1]],pos2:[e.curPos[0],e.curPos[1]]}}}function h(e,t){s.person[e][t]=0,E()}function g(){var e,o=c.pos[0],n=c.pos[1]-1;if(s.map[o][n]){var p=s.person[o][n];e=parseInt(c.el.style.left,10)-t+"px",p&&s.map[o][n-1]&&!s.person[o][n-1]?(L({id:p,prevPos:[o,n],curPos:[o,n-1]}),p.style.left=parseInt(p.style.left,10)-t+"px",s.person[o][n-1]=p,c.pos[1]=n,c.el.style.left=e,h(o,n)):p||(L(null),c.pos[1]=n,c.el.style.left=e)}}function x(){var e,o=c.pos[0]-1,n=c.pos[1];if(c.pos[0]>0&&s.map[o][n]){var p=s.person[o][n];e=parseInt(c.el.style.top,10)-t+"px",o+1>1&&p&&s.map[o-1][n]&&!s.person[o-1][n]?(L({id:p,prevPos:[o,n],curPos:[o-1,n]}),p.style.top=parseInt(p.style.top,10)-t+"px",s.person[o-1][n]=p,c.pos[0]=o,c.el.style.top=e,h(o,n)):p||(L(null),c.pos[0]=o,c.el.style.top=e)}}function w(){var e,o=c.pos[0],n=c.pos[1]+1;if(s.map[o][n]){var p=s.person[o][n];e=parseInt(c.el.style.left,10)+t+"px",p&&s.map[o][n+1]&&!s.person[o][n+1]?(L({id:p,prevPos:[o,n],curPos:[o,n+1]}),p.style.left=parseInt(p.style.left,10)+t+"px",s.person[o][n+1]=p,c.pos[1]=n,c.el.style.left=e,h(o,n)):p||(L(null),c.el.style.left=e,c.pos[1]=n)}}function k(){var e,o=c.pos[0]+1,n=c.pos[1];if(o-1<p-1&&s.map[o][n]){var l=s.person[o][n];e=parseInt(c.el.style.top,10)+t+"px",o-1<p-2&&l&&s.map[o+1][n]&&!s.person[o+1][n]?(L({id:l,prevPos:[o,n],curPos:[o+1,n]}),l.style.top=parseInt(l.style.top,10)+t+"px",s.person[o+1][n]=l,c.pos[0]=o,c.el.style.top=e,h(o,n)):l||(L(null),c.pos[0]=o,c.el.style.top=e)}}function I(){if(c.pos=d.prevBoss.pos.slice(),c.el.style.left=d.prevBoss.left,c.el.style.top=d.prevBoss.top,d.prevElem){var e=d.prevElem.el;e.style.left=d.prevElem.left,e.style.top=d.prevElem.top,s.person[d.prevElem.pos1[0]][d.prevElem.pos1[1]]=e,s.person[d.prevElem.pos2[0]][d.prevElem.pos2[1]]=0}}function P(e){switch(e.which){case 37:g();break;case 38:x();break;case 39:w();break;case 40:k();break;case 32:I();break;default:return!1}}!function(){var n=document.createDocumentFragment(),p=256,d=document.createElement("div");for(d.className="angel",n.appendChild(d);p--;){var E=document.createElement("div");E.className="map-item",n.appendChild(E)}f.appendChild(n),e=document.querySelectorAll(".map-item"),t=document.querySelector(".map-item").clientWidth+3,function(){var n=document.createDocumentFragment(),p=0;s.map.forEach(function(d,m){s.map.forEach(function(d,u){var f,v=s.map[m][u],E=s.person[m][u],L=(r+m)*o+l+u;if(1===v&&e[L].classList.add("passage"),2===v&&(e[L].classList.add("workplace"),i.push([m,u])),1===E){var h="slacker"+p++;f=document.createElement("div"),a+=t-3,f.className="person employee",f.id=h,f.style.top=y(e[L])[1]+"px",f.style.left=y(e[L])[0]+"px",f.style.backgroundPosition=a+"px 0",n.appendChild(f),s.person[m][u]=f}2===E&&((f=document.createElement("div")).id="boss",f.className="person boss",f.style.top=y(e[L])[1]+"px",f.style.left=y(e[L])[0]+"px",n.appendChild(f),s.person[m][u]=0,c={el:f,pos:[m,u]})})}),document.querySelector(".map").appendChild(n)}(),m?(document.getElementById("controls-definition").textContent="swipe gestures",document.getElementById("undo-definition").textContent="undo button",f.addEventListener("swipeLeft",g),f.addEventListener("swipeUp",x),f.addEventListener("swipeRight",w),f.addEventListener("swipeDown",k),v.addEventListener("click",function(){document.getElementById("dashboard").classList.add("hidden")}),u.addEventListener("click",I)):document.addEventListener("keyup",P)}()});
},{}]},{},["VJtr"], null)