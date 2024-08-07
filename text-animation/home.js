// this is your frontend code - it is page code in your studio site. 

import { titleAnimation, animateText } from 'public/text-animation.js'

function initTextAnimations() {
    titleAnimation($w('#heroTextAnimation'));
    $w("#buildSitesHeader").onViewportEnter(() => {
        if (!isQueryPlayed) {
            setTimeout(() => {
                animateText($w("#buildSitesHeader"));
                isQueryPlayed = true;
            }, 0);
        }
    })
}
