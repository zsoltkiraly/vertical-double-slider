/*
Vertical double slider - Code by Zsolt Király
v1.0.2 - 2018-08-30
*/

'use strict';
var verticalDoubleSlider = function() {

    function signatura() {
        if (window['console']) {
            const text = {
                black: '%c     ',
                blue: '%c   ',
                author: '%c  Zsolt Király  ',
                github: '%c  https://zsoltkiraly.com/'
            }

            const style = {
                black: 'background: #282c34',
                blue: 'background: #61dafb',
                author: 'background: black; color: white',
                github: ''
            }

            console.log(text.black + text.blue + text.author + text.github, style.black, style.blue, style.author, style.github);
        }
    }

    signatura();

    function hasTouch() {
        return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
    
    if (hasTouch()) {
        try {
            for (var si in document.styleSheets) {
                var styleSheet = document.styleSheets[si];
                if (!styleSheet.rules) continue;
    
                for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                    if (!styleSheet.rules[ri].selectorText) continue;
    
                    if (styleSheet.rules[ri].selectorText.match(':hover')) {
                        styleSheet.deleteRule(ri);
                    }
                }
            }
        } catch (ex) {}
    }

    function onTransition(el) {
        el.classList.remove('notransition');
    }

    function disabled(el, c) {
        el.classList.add('disabled-click');

        setTimeout(function() {
            el.classList.remove('disabled-click');
        }, c.transition + 100);
    }

    function dotsDOM(s) {
        var handLen = s.querySelectorAll('.vertical-slider-hand-image ul li').length,
            backgroundLen = s.querySelectorAll('.vertical-slider-background ul li').length,
            dynamic = s.querySelector('.dynamic');

        //Create Dots
        var dotsUlCreate = document.createElement('UL');
        dotsUlCreate.setAttribute('class', 'dots');

        dynamic.insertBefore(dotsUlCreate, dynamic.lastChild);

        if(handLen > 1 && backgroundLen > 1 && handLen == backgroundLen) {
            var stop = 0;
            dotsUlCreate.innerHTML = '';
            while (stop < handLen) {
                dotsUlCreate.innerHTML += '<li></li>';
                stop++;
            }
        }

        //Find dots and set first active
        var dotsUl = s.querySelector('ul.dots');

        if(dotsUl) {
            dotsUl.querySelectorAll('li')[0].classList.add('active');
        }
    }

    function setId(s) {
        var dots = s.querySelectorAll('ul.dots li'),
            hand = s.querySelectorAll('.vertical-slider-hand-image ul li'),
            background = s.querySelectorAll('.vertical-slider-background ul li');

        if((dots.length == hand.length) && (dots.length == background.length)) {
            for(var i = 0; i < dots.length; i++) {
                dots[i].setAttribute('data-id', i + 1);
                hand[i].setAttribute('data-id', i + 1);
                background[i].setAttribute('data-id', i + 1);
            }
        }
    }

    function cloneDOM(s, c) {
        var sH = s.querySelector('.vertical-slider-hand-image'),
            sB = s.querySelector('.vertical-slider-background');

        if(sH && sB) {
            var sliderHandUl = sH.querySelector('.vertical-slider-hand-image ul'),
                sliderBackgroundUl = sB.querySelector('.vertical-slider-background ul');

            sliderHandUl.style.transition = 'transform ' + c.transition + 'ms cubic-bezier(0,0,0.58,1)';
            sliderBackgroundUl.style.transition = 'transform ' + c.transition + 'ms cubic-bezier(0,0,0.58,1)';

            if(sliderHandUl && sliderBackgroundUl) {
                var sliderHandLi = sliderHandUl.querySelectorAll('.vertical-slider-hand-image ul li'),
                    sliderBackgroundLi = sliderBackgroundUl.querySelectorAll('.vertical-slider-background ul li');

                if(sliderHandLi.length > 1 && sliderBackgroundLi.length > 1 && sliderHandLi.length == sliderBackgroundLi.length) {
                    var sliderHandLiFirst = sliderHandLi[0],
                        sliderHandLiLast = sliderHandLi[sliderHandLi.length - 1],
                        sliderBackgroundLiFirst = sliderBackgroundLi[0],
                        sliderBackgroundLiLast = sliderBackgroundLi[sliderBackgroundLi.length - 1];

                    sliderHandLiFirst.classList.add('active');
                    sliderBackgroundLiFirst.classList.add('active');

                    function cloneElement(pos, el, op) {
                        var cloneLiFirst = document.createElement('LI');
                        if(op) {
                            cloneLiFirst.setAttribute('class', 'clone-last');
                        } else {
                            cloneLiFirst.setAttribute('class', 'clone-first');
                        }

                        cloneLiFirst.innerHTML = el.innerHTML;
                        if(op) {
                            pos.insertBefore(cloneLiFirst, pos.firstChild);
                        } else {
                            pos.insertBefore(cloneLiFirst, pos.lastChild);
                        }
                    }

                    cloneElement(sliderHandUl, sliderHandLiLast, true);
                    cloneElement(sliderHandUl, sliderHandLiFirst, false);
                    cloneElement(sliderBackgroundUl, sliderBackgroundLiLast, true);
                    cloneElement(sliderBackgroundUl, sliderBackgroundLiFirst, false);

                    sliderHandUl.style.transform = 'translateY(-' + sH.offsetHeight + 'px)';
                    sliderBackgroundUl.style.transform = 'translateY(-' + sB.offsetHeight + 'px)';

                    setTimeout(function() {
                        onTransition(sliderHandUl);
                        onTransition(sliderBackgroundUl);
                    }, 50)
                }
            }
        }
    }

    function movements(s, c) {
        var sH = s.querySelector('.vertical-slider-hand-image'),
            sB = s.querySelector('.vertical-slider-background'),
            dots = s.querySelectorAll('ul.dots li');

        if(sH && sB && dots) {
            var sliderHandUl = sH.querySelector('.vertical-slider-hand-image ul'),
                sliderBackgroundUl = sB.querySelector('.vertical-slider-background ul');

            if(sliderHandUl && sliderBackgroundUl) {
                var sliderHandLi = sliderHandUl.querySelectorAll('.vertical-slider-hand-image ul li'),
                    sliderBackgroundLi = sliderBackgroundUl.querySelectorAll('.vertical-slider-background ul li');

                var autoplay;

                dots.forEach(function(item, index) {
                    item.addEventListener('click', function() {

                        disabled(s, c);

                        var obj = this;

                        //Set active
                        dots.forEach(function(item, index) {
                            if(item == obj) {
                                item.classList.add('active');
                            } else {
                                item.classList.remove('active');
                            }
                        });

                        function setActiveImages(el, ul) {
                            el.forEach(function(item, index) {
                                if(parseFloat(obj.getAttribute('data-id')) == parseFloat(item.getAttribute('data-id'))) {

                                    ul.style.transform = 'translateY(-' + parseFloat(item.getAttribute('data-id')) * item.offsetHeight + 'px)';
                                    item.classList.add('active');
                                } else {
                                    item.classList.remove('active');
                                }
                            }); 
                        }

                        setActiveImages(sliderHandLi, sliderHandUl);
                        setActiveImages(sliderBackgroundLi, sliderBackgroundUl);

                        if(c.autoplay) { 
                            clearInterval(autoplay);
                            autoplay = setInterval(function() {
                                moveDown(s);
                            }, c.slideTime);
                        }

                    }, false);
                });

                function moveDown(s, dI) {

                    disabled(s, c);

                    if (dI === undefined) {
                        dI = 0;
                    }

                    var activeHand = s.querySelector('.vertical-slider-hand-image ul li.active'),
                        activeBackground = s.querySelector('.vertical-slider-background ul li.active');

                    var transYRegex = /\.*translateY\((.*)px\)/i;

                    var getUlHandTransform = parseFloat(transYRegex.exec(sliderHandUl.getAttribute('style'))[1]) * -1;
                    var getUlBackgroundTransform = parseFloat(transYRegex.exec(sliderBackgroundUl.getAttribute('style'))[1]) * -1;

                    if(sliderBackgroundUl.offsetHeight >= getUlBackgroundTransform - Math.abs(dI) + sliderBackgroundLi[0].offsetHeight * 2) {
                        activeHand.classList.remove('active');
                        activeBackground.classList.remove('active');

                        var nextElementHand = activeHand.nextElementSibling,
                            nextElementBackground = activeBackground.nextElementSibling;

                        if(!nextElementHand.classList.contains('clone-first')) {
                            nextElementHand.classList.add('active');
                            nextElementBackground.classList.add('active');

                        } else {
                            sliderHandLi[1].classList.add('active');
                            sliderBackgroundLi[1].classList.add('active');
                        }

                        sliderHandUl.style.transform = 'translateY(-' + (getUlHandTransform + sliderHandLi[0].offsetHeight - Math.abs(dI)) + 'px)';
                        sliderBackgroundUl.style.transform = 'translateY(-' + (getUlBackgroundTransform + sliderBackgroundLi[0].offsetHeight - Math.abs(dI)) + 'px)';
                    }

                    //Background
                    if(sliderBackgroundUl.offsetHeight == getUlBackgroundTransform - Math.abs(dI) + sliderBackgroundLi[0].offsetHeight * 2) {
                        setTimeout(function() {

                            //Off transition
                            sliderHandUl.classList.add('notransition');
                            sliderBackgroundUl.classList.add('notransition');

                            sliderHandUl.style.transform = 'translateY(-' + sH.offsetHeight + 'px)';
                            sliderBackgroundUl.style.transform = 'translateY(-' + sB.offsetHeight + 'px)';

                            setTimeout(function() {
                                //On transition
                                sliderHandUl.classList.remove('notransition');
                                sliderBackgroundUl.classList.remove('notransition');
                            }, 50);

                        }, c.transition + 50);
                    }

                    setTimeout(function() {
                        activeHand = s.querySelector('.vertical-slider-hand-image ul li.active');

                        dots.forEach(function(item, index) {
                            if(parseFloat(item.getAttribute('data-id')) == parseFloat(activeHand.getAttribute('data-id'))) {
                                item.classList.add('active');
                            } else {
                                item.classList.remove('active');
                            }
                        });
                    }, 50);
                }

                function moveUp(s, dI) {

                    disabled(s, c);

                    if (dI === undefined) {
                        dI = 0;
                    }

                    var activeHand = s.querySelector('.vertical-slider-hand-image ul li.active'),
                        activeBackground = s.querySelector('.vertical-slider-background ul li.active');

                    var transYRegex = /\.*translateY\((.*)px\)/i;

                    var getUlHandTransform = parseFloat(transYRegex.exec(sliderHandUl.getAttribute('style'))[1]) * -1;
                    var getUlBackgroundTransform = parseFloat(transYRegex.exec(sliderBackgroundUl.getAttribute('style'))[1]) * -1;

                    if(sliderBackgroundLi[0].offsetHeight <= getUlBackgroundTransform + Math.abs(dI)) {
                        activeHand.classList.remove('active');
                        activeBackground.classList.remove('active');

                        var previousElementHand = activeHand.previousElementSibling,
                            previousElementBackground = activeBackground.previousElementSibling;

                        if(!previousElementHand.classList.contains('clone-last')) {
                            previousElementHand.classList.add('active');
                            previousElementBackground.classList.add('active');

                            sliderHandUl.style.transform = 'translateY(-' + (getUlHandTransform - sliderHandLi[0].offsetHeight + Math.abs(dI)) + 'px)';
                            sliderBackgroundUl.style.transform = 'translateY(-' + (getUlBackgroundTransform - sliderBackgroundLi[0].offsetHeight + Math.abs(dI)) + 'px)';

                        } else {
                            sliderHandLi[sliderHandLi.length - 2].classList.add('active');
                            sliderBackgroundLi[sliderBackgroundLi.length - 2].classList.add('active');

                            sliderHandUl.style.transform = 'translateY(0px)';
                            sliderBackgroundUl.style.transform = 'translateY(0px)'; 
                        }
                    }

                    //Background
                    if(sliderBackgroundLi[0].offsetHeight == getUlBackgroundTransform + Math.abs(dI)) {
                        setTimeout(function() {

                            //Off transition
                            sliderHandUl.classList.add('notransition');
                            sliderBackgroundUl.classList.add('notransition');

                            sliderHandUl.style.transform = 'translateY(-' + sH.offsetHeight * dots.length + 'px)';
                            sliderBackgroundUl.style.transform = 'translateY(-' + sB.offsetHeight * dots.length + 'px)';

                            setTimeout(function() {
                                //On transition
                                sliderHandUl.classList.remove('notransition');
                                sliderBackgroundUl.classList.remove('notransition');
                            }, 50);

                        }, c.transition + 50);
                    }

                    setTimeout(function() {
                        activeHand = s.querySelector('.vertical-slider-hand-image ul li.active');

                        dots.forEach(function(item, index) {
                            if(parseFloat(item.getAttribute('data-id')) == parseFloat(activeHand.getAttribute('data-id'))) {
                                item.classList.add('active');
                            } else {
                                item.classList.remove('active');
                            }
                        });
                    }, 50);
                }

                if(c.autoplay) {
                    autoplay = setInterval(function() {
                        moveDown(s);
                    }, c.slideTime);
                }

                //Mouse events
                var startY = 0;
                var dist = 0;
                var getUlHandTransform;
                var getUlBackgroundTransform;

                var moveArea = s.querySelector('.dynamic .touch-area');

                var mouseDown = false,
                    mouseMove = false,
                    mouseUp = false;

                moveArea.addEventListener('mousedown', function(event) {
                    mouseDown = true;

                    var transYRegex = /\.*translateY\((.*)px\)/i;

                    getUlHandTransform = parseFloat(transYRegex.exec(sliderHandUl.getAttribute('style'))[1]) * -1;
                    getUlBackgroundTransform = parseFloat(transYRegex.exec(sliderBackgroundUl.getAttribute('style'))[1]) * -1;

                    s.classList.add('catch');

                    startY = event.clientY;

                    clearInterval(autoplay);

                    event.preventDefault();

                    window.addEventListener('mousemove', function(event) {
                        if(mouseDown) {

                            if(event.target.classList.contains('touch-area')) {
                                if(s.classList.contains('catch')) {

                                    mouseMove = true;

                                    dist = startY - event.clientY;

                                    sliderHandUl.style.transform = 'translateY(-' + (getUlHandTransform + dist) + 'px)';
                                    sliderBackgroundUl.style.transform = 'translateY(-' + (getUlBackgroundTransform + dist) + 'px)';
                                }
                            } else {
                                mouseDown = false;

                                sliderHandUl.style.transform = 'translateY(-' + getUlHandTransform + 'px)';
                                sliderBackgroundUl.style.transform = 'translateY(-' + getUlBackgroundTransform + 'px)';
                            }

                            event.preventDefault();
                        }
                    }, false);

                    window.addEventListener('mouseup', function(event) {
                        if(mouseDown && mouseMove) {
                                s.classList.remove('catch');

                                if(c.autoplay) {
                                    clearInterval(autoplay);
                                    autoplay = setInterval(function() {
                                        moveDown(s);
                                    }, c.slideTime);
                                }

                                if(Math.abs(dist) > 100) {

                                    if(c.autoplay) {
                                        clearInterval(autoplay);
                                        autoplay = setInterval(function() {
                                            moveDown(s);
                                        }, c.slideTime);
                                    }

                                    if(dist < 0) {
                                        moveUp(s, dist);

                                    } else {
                                        moveDown(s, dist);
                                    }

                                } else {
                                    disabled(s, c);

                                    sliderHandUl.style.transform = 'translateY(-' + getUlHandTransform + 'px)';
                                    sliderBackgroundUl.style.transform = 'translateY(-' + getUlBackgroundTransform + 'px)';
                                }

                                mouseDown = false,
                                mouseMove = false,
                                mouseUp = false;

                                event.preventDefault();
                            }
                    }, false);
                }, false);
            }
        }
    }

    function loading(container) {
        setTimeout(function() {
            container.classList.remove('show');

            setTimeout(function() {
                container.classList.remove('loading');
            }, 1000);

        }, 1000);
    }

    function app(id) {

        var slider = document.querySelector('#' + config.id +'');

        if(slider) {
            dotsDOM(slider);
            setId(slider);
            cloneDOM(slider, config);

            movements(slider, config);

            loading(slider);
        }
    }

    return {
        app: app
    }
}();