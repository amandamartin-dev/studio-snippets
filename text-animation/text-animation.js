//this code should go in your "public" files

import { rendering } from 'wix-window'

const TITLE_ANIMATION_PHRASES = ['SITE DEVELOPERS', 'APP CREATORS', 'WEB AGENCIES' , 'ENTERPRISES'];
const TITLE_ANIMATION_PHRASE_TO_REPLACE = TITLE_ANIMATION_PHRASES[0]
const TITLE_ANIMATION_LINE_BREAK_BEFORE_PHRASE = false
const TITLE_ANIMATION_TEXT_MARKER = '|'
const TITLE_ANIMATION_TEXT_MARKER_BLINK_RATE = 530
const TITLE_ANIMATION_TYPING_DELAY_MIN = 50 //The minimum time of the random time range it takes to write each letter 50-120
const TITLE_ANIMATION_TYPING_DELAY_MAX = 50 //The maximum time of the random time range it takes to write each letter
const TITLE_ANIMATION_PHRASE_SLEEP = 1500 // The time the phrase is presented
const TITLE_ANIMATION_DELETEING_DELAY = 50 // The time it takes to erase the letters
const TITLE_ANIMATION_SLEEP_BETWEEN_PHRASES = 1000 // The time it takes until the function is starting to write (1 second)

export const titleAnimation = async ($titleElement) => {
    if (rendering.env !== 'browser') return

    addSrOnlyPharsesToTitle($titleElement)
    const phrasePlaceHolder = '${pharse}'
    const markerPlaceHolder = '${marker}'
    const animationTitleTemplate = createAnimationTitleTemplate($titleElement, phrasePlaceHolder, markerPlaceHolder)

    let textMarkerIsVisible = true
    let textToDisplay = ''

    initPause()

    const updateTitle = (newTextToDisplay) => {
        if (typeof newTextToDisplay === 'string') {
            textToDisplay = newTextToDisplay
            textMarkerIsVisible = true
            startNewBlinkMarker()
        }

        const markerToDisplay = (textMarkerIsVisible) ? '|' : '&nbsp;'

        if (pause) return

        $titleElement.html = animationTitleTemplate
            .replace(markerPlaceHolder, markerToDisplay)
            .replace(phrasePlaceHolder, textToDisplay)
    }

    let intervalId = null

    const startNewBlinkMarker = () => {
        clearInterval(intervalId)

        intervalId = setInterval(async () => {
            textMarkerIsVisible = !textMarkerIsVisible
            updateTitle()
        }, TITLE_ANIMATION_TEXT_MARKER_BLINK_RATE)
    }

    while (true) {
        for (const phrase of TITLE_ANIMATION_PHRASES) {
            await writePhrase(phrase, updateTitle)
            await sleep(TITLE_ANIMATION_PHRASE_SLEEP)
            await deletePhrase(phrase, updateTitle)
            await sleep(TITLE_ANIMATION_SLEEP_BETWEEN_PHRASES)
        }
    }
}

let pause = false

const initPause = () => {
    $w('#a11yCover').onClick(() => { pause = !pause })
}

const waitForPlay = () => new Promise((resolve) => {
    $w('#a11yCover').onClick(resolve)
})

const addSrOnlyPharsesToTitle = ($titleElement) => {
    const titleClosingTag = '</h'
    const srOnlyStyle = 'overflow: hidden; height: 1px; width: 1px; position: absolute;'
    const phrasesForScreenReaders = `<span style="${srOnlyStyle}">${TITLE_ANIMATION_PHRASES.join(', ')}</span>`
    $titleElement.html = $titleElement.html.replace(titleClosingTag, ` ${phrasesForScreenReaders}${titleClosingTag}`)
}

const createAnimationTitleTemplate = ($titleElement, phrasePlaceHolder, markerPlaceHolder) => {
    const lineBreak = (TITLE_ANIMATION_LINE_BREAK_BEFORE_PHRASE) ? '</br>' : ''
    const phrasePlaceHolderHiddenFromScreenReaders = `${lineBreak}<span aria-hidden="true">${phrasePlaceHolder}</span>`
    const textMarkerPlaceHolderHiddenFromScreenReaders = `<span aria-hidden="true">${markerPlaceHolder}</span>`
    return $titleElement.html
        .replace(TITLE_ANIMATION_PHRASE_TO_REPLACE, phrasePlaceHolderHiddenFromScreenReaders)
        .replace(TITLE_ANIMATION_TEXT_MARKER, textMarkerPlaceHolderHiddenFromScreenReaders)
}

const writePhrase = async (phrase, updateTitle) => {
    let textToDisplay = ''
    for (const charachter of phrase) {
        textToDisplay += charachter
        updateTitle(textToDisplay)
        await sleep(randBetween(TITLE_ANIMATION_TYPING_DELAY_MIN, TITLE_ANIMATION_TYPING_DELAY_MAX))
        if (pause) await waitForPlay()
    }
}

const deletePhrase = async (phrase, updateTitle) => {
    let textToDisplay = phrase
    for (let i = 1; i <= phrase.length; i++) {
        textToDisplay = textToDisplay.slice(0, -1) || ''
        updateTitle(textToDisplay)
        await sleep(TITLE_ANIMATION_DELETEING_DELAY)
        if (pause) await waitForPlay()
    }
}

const sleep = (miliseconds) => new Promise(resolve => setTimeout(resolve, miliseconds))

const randBetween = (min, max) => Math.floor(Math.random() * max + min)

export function animateText(textElement) {
    let interval
    let timeInterval = 30;
    let typeStrings = ["Build sites. Launch apps. Sell at scale. Repeat."]
    let stringStart = "" //<-- if you don't want a starting string just set this to ""
    let wordIdx = 0
    let typeIdx = 0
    let displayStr = stringStart
    let endingString = "|";
    let wordPause = 500;

    function typeNextCharacter() {
        if (typeIdx < typeStrings[wordIdx].length) {
            displayStr += typeStrings[wordIdx][typeIdx];
            textElement.text = displayStr + endingString;
            typeIdx++;

            if (typeStrings[wordIdx][typeIdx - 1] === ".") { // Check if it's a period
                setTimeout(() => {
                    typeNextCharacter();
                }, wordPause);
            } else {
                setTimeout(() => {
                    typeNextCharacter();
                }, timeInterval);
            }
        } else if (wordIdx < typeStrings.length - 1) {
            // Move to the next word after typing is finished
            wordIdx++;
            typeIdx = 0;
            displayStr = stringStart;
            setTimeout(() => {
                typeNextCharacter();
            }, wordPause); // Pause between words
        }
    }

    textElement.text = "";
    typeNextCharacter();
}
