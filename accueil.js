

function createElement(tag, config, parent = null, replace = false) {
    const { text, color, className, attributes } = config || {};

    const element = document.createElement(tag);

    if (color) {
        element.style.color = color;
    }

    if (className) {
        element.classList.add(...className.split(' '));
    }

    if (attributes) {
        attributes.forEach(attribute => {
            element.setAttribute(attribute.key, attribute.value)
        })
    }

    if (text) {
        element.innerHTML = text;
    }

    if (parent) {
        if (replace) {
            parent.replaceChildren(element);
        } else {
            parent.appendChild(element);
        }

    }
    return element;
}
const div = createElement('div', { className: 'container_accueil' }, document.body);
const link = createElement('a', {  attributes: [{key: "href",value: 'index.html '}], }, div);
const h1 = createElement('H1', { className: 'title_accueil', text : 'Infinity NFT' }, link);
document.body.style.backgroundImage= "url('assets/img3.jpg')";
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
async function launch(){
    while (true) {

        

        const randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
        document.getElementsByClassName("title_accueil")[0].style.color=randomColor;
        console.log( randomColor);
        await delay(500);
    }
}
launch()

