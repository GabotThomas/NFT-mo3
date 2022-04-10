const JSON_TYPE = 'application/json';
const root = document.querySelector('body');
let token = localStorage.getItem("token");

//Prompt
while (!token) {
    token = prompt('Token:');
    if (token) {
        localStorage.setItem("token", token);
        index();
    }
}
if (token) {
    index();
}



//functions 
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

async function useFetch({
    url,
    method = 'GET',
    body,
}) {
    const params = {
        method,
        headers: {
            'Content-Type': JSON_TYPE,
            Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(body),
    };
    try {
        const response = await fetching(url, params);
        return response;
    }
    catch (e) {
        console.error(e)
    }
}

async function fetching(url, params) {
    try {
        const response = await fetch(url, params);
        if (response.ok) {
            if (response.headers.get('Content-Type') === JSON_TYPE) {
                const responseJson = await response.json();
                return responseJson;
            }
        }
    }
    catch (e) {
        console.error(e);
    }
}

function createImg(url, parent, props = {}) {
    return createElement('img', {
        attributes: [
            { key: 'src', value: 'https://i.ibb.co/nbvWJW9/image-placeholder-for-lazy-loading.png' },
            { key: 'data-src', value: url },
        ],
        className: "lazy-loading",
        ...props
    }, parent)

}


function index() {
    //Code
    const textHeader = `<ul></ul>`;
    const header = createElement('header', { className: "header" }, root);

    const main = createElement('main', { className: "container" }, root);

    //components

    const assets = () => {

        //Const & let
        const rootUrl = 'https://api.m3o.com/v1/nft/Assets';
        let nfts = [];

        //Components
        const container = createElement('div', { className: "container list" }, main, true)
        const loading = createElement('div', { className: "ui loader active" }, container, true);
        const list = createElement('div', { className: 'grid' })
        const separate = createElement('div', { className: "separate" })

        const width = Math.floor(container.offsetWidth);
        const nbr = Math.floor(width / 350);
        const margin = (nbr - 1) * 40 / nbr;
        const columnSize = Math.floor((width / nbr) - 1 - margin);

        const execute = (request) => {
            useFetch(request).then((data) => {
                if (data) {
                    nfts = nfts.concat(data.assets);
                    if (loading) {
                        loading.remove();
                        container.appendChild(list);
                        container.appendChild(separate);
                    }
                    listRender(data);
                }
            })
        }

        const lazyLoading = new IntersectionObserver((elements) => {
            elements.forEach((element) => {
                if (element.isIntersecting) {
                    const img = element.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove("lazy-loading");
                    lazyLoading.unobserve(img);
                }
            });
        });

        const preLoading = new IntersectionObserver((elements) => {
            elements.forEach((element) => {
                if (element.isIntersecting) {
                    const section = element.target;
                    execute({
                        url: rootUrl,
                        method: 'POST',
                        body: {
                            cursor: section.getAttribute("data-url")
                        }
                    });
                }
            });
        }, { rootMargin: "500px" });

        execute({ url: rootUrl });

        const listRender = (nftList) => {
            //For each NFTS
            nftList.assets.forEach(nft => {
                if (nft.image_url) {
                    const nftElement = createElement('div', {
                        className: "column",
                        attributes: [{
                            key: "style", value: `width:${columnSize}px`
                        }]
                    }, list)
                    //Create Img with lazyLoading
                    const imgContainer = createElement('div', {
                        attributes: [{
                            key: "style",
                            value: `height:${columnSize}px;background-image:url(${nft.image_url})`
                        }],
                        className: "crop"
                    }, nftElement)
                    const imgCenter = createElement('div', {
                        className: "img-center"
                    }, imgContainer)
                    const img = createImg(nft.image_url, imgCenter);
                    const name = createElement('p', {
                        className: "",
                        text: nft.name
                    }, nftElement)
                    const creator = createElement('p', {
                        className: "",
                        text: `par <a href="">${nft.collection.slug}</a>`
                    }, nftElement)
                    //Observe with scroll
                    lazyLoading.observe(img);
                }
            })
            if (nftList.next) {
                separate.setAttribute("data-url", nftList.next)
                preLoading.observe(separate);
            }
        }
    }

    assets();
}





