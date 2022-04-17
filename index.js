const JSON_TYPE = 'application/json';
const root = document.querySelector('body');
const main = createElement('main', { className: "container" });

//Routing
let nftRoute = [
    route({ url: '/:id', component: asset })
]

let routes = [
    route({ url: '/', component: assets }),
    route({ url: '/nft', component: routing, routes: nftRoute }),
]
index();


function index() {
    //Code
    const header = createElement('header', { className: "header" }, root);

    //Navbar
    const nav = createElement('div', {
        className: 'navbar',
        attributes: [{
            key: "style",
            value: "height:100px; width:100%"
        }]
    }, header)
    const ul = createElement('ul', {
        className: 'nav-list',
        attributes: ''
    }, nav)
    const homeLi = createElement('li', {
        className: 'nav-text',
        attributes: ''
    }, ul)
    const home = createElement('a', {
        className: 'text',
        text: 'Home',
        // href: '/NFT-mo3/index.html',
        attributes: [{
            key: 'href',
            value: ''
        }]
    }, homeLi)
    root.appendChild(main)

    //InitRouting
    let url = new URL(window.location.href);
    link({ to: url.pathname });
}






//Component

function assets() {

    //Const & let
    const rootUrl = 'https://awesome-nft-app.herokuapp.com';
    let search = false;
    let nfts = [];

    //Components
    const container = createElement('div', { className: "container list" }, main, true)
    const loading = createElement('div', { className: "ui loader active" });
    const list = createElement('div', { className: 'grid' })
    const separate = createElement('div', { className: "separate" })

    //Form
    const searchForm = createElement('input', {
        className: "form",
    }, document.querySelector('header'), true);

    searchForm.addEventListener("input", (e) => {
        handleLoading();
        search = true;
        execute({
            url: rootUrl + '/search?q=' + e.target.value,
        }, true);
    })


    const width = Math.floor(container.offsetWidth);
    const nbr = Math.floor(width / 350);
    const margin = (nbr - 1) * 40 / nbr;
    const columnSize = Math.floor((width / nbr) - 1 - margin);

    const handleLoading = () => {
        container.replaceChildren(loading);
    }

    const execute = (request, replace = false) => {
        useFetch(request).then((data) => {
            if (data) {
                nfts = nfts.concat(data.assets);
                if (loading) {
                    loading.remove();
                    if (replace) {
                        list.innerHTML = "";

                    }
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
                if (!search) {
                    execute({
                        url: rootUrl + '/?page' + section.getAttribute("data-url"),
                    });
                }

            }
        });
    }, { rootMargin: "500px" });

    handleLoading();
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
                        value: `height:${columnSize}px`
                    }],
                    className: "crop"
                }, nftElement)
                const imgCenter = createElement('div', {
                    className: "img-center",
                }, imgContainer)
                const img = createImg(nft.image_url, imgCenter);
                img.addEventListener('click', (e) => {
                    link({ to: '/nft/' + nft.id });
                })
                const name = createElement('p', {
                    className: "",
                    text: nft.name
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

function asset({ id }) {
    // console.log(id)
    console.log(id)
    const rootUrl = 'https://awesome-nft-app.herokuapp.com';
    //history.pushState({}, null, "nft/" + id)
    let nfts = [];

    //Components
    const container = createElement('div', { className: "container item" }, main, true)
    const loading = createElement('div', { className: "ui loader active" }, container, true);
    const item = createElement('div', { className: 'flex' })
    const back = createElement('div', { className: "back", text: 'back' }, container)
    back.addEventListener('click', () => {
        link({ to: '/' });
    })

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
                    container.appendChild(item);
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

    const listRender = (nft) => {
        //For each NFTS

        console.log(nft)
        if (nft) {
            const nftElement = createElement('div', {
                className: "column",
                attributes: [{
                    key: "style", value: `width:${columnSize}px`
                }]
            }, item)
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
                text: "<span>NFT name: </span>" + nft.name
            }, nftElement)
            const creator = createElement('p', {
                className: "",
                text: `par <a href="">${nft.collection.name}</a>`
            }, nftElement)
            const description = createElement('p', {
                className: "",
                text: `Description de la Collection:<br><p>${nft.collection.description}</p>`
            }, nftElement)
            const contractAdress = createElement('p', {
                className: "",
                text: `Contrat adress <p>${nft.contract.address}</p>`
            }, nftElement)
            const sales = createElement('p', {
                className: "",
                text: `Ventes : <p>${nft.sales}</p>`
            }, nftElement)
            //Observe with scroll
            lazyLoading.observe(img);
        }
    }

    execute({ url: rootUrl + "/nft/" + id })

}

//Function create

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

//Function fetch API

async function useFetch({
    url,
    method = 'GET',
    body,
}) {
    const params = {
        method,
        headers: {
            'Content-Type': JSON_TYPE
        },
        body: JSON.stringify(body),
    };
    try {
        const response = await fetching(url, params);
        return response;
    }
    catch (e) {
        console.log('test');
    }
}

async function fetching(url, params) {
    try {
        const response = await fetch(url, params);
        //API HEROKU
        const responseGood = await response.json();
        return responseGood;
    }

    catch (e) {
        console.error(e)
    }
}




//Routing

function link({ to }) {
    routing({ pathname: to })
}

function route({ url, component, routes = null }) {
    if (routes) {
        return {
            url, routing: ({ pathname, nextPathname }) => {
                component({ pathname: nextPathname, baseRoute: routes, prevUrl: pathname })
            }
        }
    }
    return {
        url, action: ({ pathname, ...props }) => {
            history.pushState({}, null, pathname)
            component({ ...props });
        }
    }
}

function routing({ pathname, baseRoute = routes, prevUrl = null }) {
    const result = [];
    const pathnameSplit = pathname.slice(1).split('/');
    if (pathname != '/') {
        const mathPow = (Math.pow(2, pathnameSplit.length));
        let matriceIndex = (mathPow) / 2;
        pathnameSplit.forEach((path, index) => {
            let insert = true;
            for (let j = 0; j < mathPow; j++) {
                if (!(j % matriceIndex) && j != 0) {
                    insert = !insert;
                }
                if (index === 0) {
                    result.push([insert ? ('/' + path) : '/&'])
                } else {
                    result[j].push('/' + (insert ? path : '&'));
                }
            }
            matriceIndex = matriceIndex / 2
        });

    } else {
        result.push(['/'])
        result[0].push('/&')
    }

    const props = {};
    for (const [index, path] of result.entries()) {
        const currentUrl = baseRoute.find(route => {
            const routeSplit = route.url.split('/');
            const universalRoute = routeSplit.map(el => el[0] == ':' ? '&' : el).join('/');
            if (universalRoute == path.slice(0, routeSplit.length - 1).join('')) {
                props.nextPathname = '/' + pathnameSplit.slice(routeSplit.length - 1).join('/');
                path.forEach((el, i) => {
                    if (el == '/&') {
                        if (routeSplit[i + 1]) {
                            props[routeSplit[i + 1].slice(1)] = pathnameSplit[i];
                        }
                    }
                })
                return true;
            }

        })
        console.log(prevUrl)
        if (currentUrl) {
            if (currentUrl.routing) {
                currentUrl.routing({ pathname: pathname.slice(1), ...props })
                break;
            }

            currentUrl.action({ pathname: (prevUrl || pathname), ...props });
            break;
        };
    }
}

