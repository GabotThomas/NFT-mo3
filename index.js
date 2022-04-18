const JSON_TYPE = 'application/json';
const root = document.querySelector('body');
const header = createElement('header', { className: "header" }, root);
const main = createElement('main', { className: "container" });
let historyPushAvailable = window.location.origin.slice(0, 4) != 'file';

//Routing
let nftRoute = [
    //: /nft
    route({ url: '/:id', component: asset })
    
]

let collectionRoute = [
    route({ url: '/', component: collections }),
    route({ url: '/:slug', component: collection })
    
]


let routes = [
    route({ url: '/', component: assets }),
    route({ url: '/nft', component: routing, routes: nftRoute }),
    route({ url: '/favoris', component: favoris }),
    route({ url: '/collections', component: routing, routes: collectionRoute })
]
index();


function index() {
    root.appendChild(main)
    //InitRouting
    let url = new URL(window.location.href);
    link({ to: '/' });

}

//Component

function headerComponent({ component = null }) {
    //Navbar
    const nav = createElement('div', {
        className: 'navbar',
        attributes: [{
            key: "style",
            value: "height:100px; width:100%"
        }]
    }, header, true)
    const ul = createElement('ul', {
        className: 'nav-list',
        attributes: ''
    }, nav)
    const headerComponents = createElement('div', {
        className: 'nav-components',
    }, header)

    createLi('/', ul, 'Home');
    createLi('/favoris', ul, 'Favoris');
    createLi('/collections', ul, 'Collections');

    headerComponents.replaceChildren(component || '');

}

function creatorSelect({ parent, handleSelect }) {
    const url = 'https://awesome-nft-app.herokuapp.com/creators';

    const creatorForm = createElement('select', {
        className: "form",
    }, parent);
    creatorForm.addEventListener("input", (e) => {
        handleSelect('/creators/' + e.target.value)
    })

    const execute = (request) => {
        useFetch(request).then((data) => {
            data.creators.forEach(creator => {
                if (creator.username) {
                    const optionCreator = createElement('option', {
                        className: "select",
                        text: creator.username
                    }, creatorForm);
                }
            })
        })
    }
    execute({ url });
    return creatorForm;
}

// Problème au niveau API
function ownerSelect({ parent, handleSelect }) {
    const url = 'https://awesome-nft-app.herokuapp.com/owners';

    const ownerForm = createElement('select', {
        className: "form",
    }, parent);
    ownerForm.addEventListener("input", (e) => {
        handleSelect('/owners/' + e.target.value)
    })

    const execute = (request) => {
        useFetch(request).then((data) => {
            console.log(data)
            data.owners.forEach(owners => {
                // console.log(owners.username)
                if (owners.username && owners.username != 'NullAddress') {
                    const optionOwner = createElement('option', {
                        className: "select",
                        text: owners.username
                    }, ownerForm);
                }
            })
        })
    }
    execute({ url });
}

function searchNft({ parent, handleSearch }) {
    const searchForm = createElement('input', {
        className: "form",
    }, parent);
    searchForm.addEventListener("input", (e) => {
        handleSearch('/search?q=' + e.target.value)
    })
    return searchForm;
}

function assets() {

    //Const & let
    const rootUrl = 'https://awesome-nft-app.herokuapp.com';
    let search = false;
    let nfts = [];

    //Elements
    const container = createElement('div', { className: "container list" }, main, true)
    const loading = createElement('div', { className: "ui loader active" });
    const list = createElement('div', { className: 'grid' })
    const separate = createElement('div', { className: "separate" })
    const searchContainer = createElement('div', {
        className: 'form-container'
    });

    //With of card
    const width = Math.floor(container.offsetWidth);
    const nbr = Math.floor(width / 350);
    const margin = (nbr - 1) * 40 / nbr;
    const columnSize = Math.floor((width / nbr) - 1 - margin);

    //Form
    const handleForm = (pathname) => {
        handleLoading();
        search = true;
        execute({
            url: rootUrl + pathname,
        }, true);
    }

    const handleLoading = () => {
        container.replaceChildren(loading);
    }

    const execute = (request, replace = false) => {
        useFetch(request).then((data) => {
            if (data) {
                nfts = nfts.concat(data);
                if (loading) {
                    loading.remove();
                    if (replace) {
                        list.innerHTML = "";
                        if (search && !data.assets.length) {
                            nfts = []
                        }

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
                        url: rootUrl + '/?page=' + section.getAttribute("data-url"),
                    });
                }
            }
        });
    }, { rootMargin: "500px" });

    const listRender = (nftList) => {
        if (!nfts.length) {
            container.replaceChildren('null')
        }
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

                const likeButton = createElement('div', {
                    className: "extra content",
                    text: `<a><i class="heart icon"></i>favoris</a>`
                }, nftElement);
                likeButton.addEventListener("click", () => addFeature(nft));
                //Observe with scroll
                lazyLoading.observe(img);
            }
        })
        if (nftList.next) {
            separate.setAttribute("data-url", nftList.next)
            preLoading.observe(separate);
        }
    }

    //Header 
    headerComponent({
        component: searchContainer
    })
    creatorSelect({
        parent: searchContainer,
        handleSelect: handleForm
    });

    ownerSelect({
        parent: searchContainer,
        handleSelect: handleForm
    });

    searchNft({
        parent: searchContainer,
        handleSearch: handleForm
    });

    //Components
    handleLoading();
    execute({ url: rootUrl });
}

function asset({ id }) {
    // console.log(id)
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

    const listRender = (nft) => {
        //For each NFTS
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
    headerComponent({});
    execute({ url: rootUrl + "/nft/" + id })

}

function favoris() {
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

    const listRender = (nftList) => {
        //For each NFTS
        if (loading) {
            loading.remove();
            container.appendChild(list);
            container.appendChild(separate);
        }
        const favoris = JSON.parse(nftList);
        if (favoris) {
            favoris.forEach((nft, index) => {
                if (nft.image_url) {
                    const nftElement = createElement('div', {
                        className: "column ui card",
                        attributes: [{
                            key: "style", value: `width:${columnSize}px`
                        }]
                    }, list)
                    //Create Img with lazyLoading
                    const imgContainer = createElement('div', {
                        className: '',
                        attributes: [{
                            key: "style",
                            value: `height:${columnSize}px`
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
                    const likeButton = createElement('img', {
                        className: "imgLike",
                        attributes: [{ key: 'src', value: 'assets/like.png', }]

                    }, nftElement);
                    likeButton.addEventListener("click", (e) => {
                        nftElement.remove();
                        removeFeature(index);
                    });

                    //Observe with scroll
                    lazyLoading.observe(img);
                }
            })
        }
    }
    headerComponent({});
    listRender(localStorage.getItem('favoris'));
}

function collection({ slug }) {
    // console.log(id)
    const rootUrl = 'https://awesome-nft-app.herokuapp.com';
    //history.pushState({}, null, "nft/" + id)
    let nfts = [];

    //Components
    const container = createElement('div', { className: "container list" }, main, true)
    const loading = createElement('div', { className: "ui loader active" });
    const list = createElement('div', { className: 'grid' })
    const separate = createElement('div', { className: "separate" })
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
                    container.appendChild(list);
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

    const listRender = (nftList) => {
        console.log(nftList);
        if (!nfts.length) {
            container.replaceChildren('null')
        }
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

                const likeButton = createElement('div', {
                    className: "extra content",
                    text: `<a><i class="heart icon"></i>favoris</a>`
                }, nftElement);
                likeButton.addEventListener("click", () => addFeature(nft));
                //Observe with scroll
                lazyLoading.observe(img);
            }
        })
        if (nftList.next) {
            separate.setAttribute("data-url", nftList.next)
            preLoading.observe(separate);
        }
    }
    headerComponent({});
    execute({ url: rootUrl + "/collections/" + slug })

}

function collections() {

    //Const & let
    const rootUrl = 'https://awesome-nft-app.herokuapp.com/collections';
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
            console.log(data)
            if (data) {
                console.log(data);
                nfts = nfts.concat(data.collections);
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
                    url: rootUrl + '/?page' + section.getAttribute("data-url"),
                });
            }
        });
    }, { rootMargin: "500px" });

    const listRender = (nftList) => {
        console.log(nftList)
        //For each NFTS
        nftList.collections.forEach(nft => {
            if (nft.image_url) {
                const nftElement = createElement('div', {
                    className: "column ui card",
                    attributes: [{
                        key: "style", value: `width:${columnSize}px`
                    }]
                }, list)
                //Create Img with lazyLoading
                const imgContainer = createElement('div', {
                    className: "image",
                    attributes: [{
                        key: "style",
                        value: `height:${columnSize}px`
                    }],
                    className: "crop"
                }, nftElement)
                const imgCenter = createElement('div', {
                    className: "img-center"
                }, imgContainer)
                const divicon = createElement('div', {
                    className: "extra content"
                }, nftElement)
                const aicon = createElement('a', {
                    text: "add favoris"
                }, divicon)
                const icon = createElement('i', {
                    className: "heart icon"
                }, aicon)
                const img = createImg(nft.image_url, imgCenter);
                img.addEventListener('click', (e) => {
                    link({ to: '/collections/' + nft.slug });
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

    //Header 
    headerComponent({})
    execute({ url: rootUrl });

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

function createLi(to, parent, text) {
    const Li = createElement('li', {
        className: 'nav-text',
        text
    }, parent)
    Li.addEventListener('click', (e) => {
        link({ to })
    })
    return Li;
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
        console.log('erreur');
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

//Function Favoris localStorage
function addFeature(nft) {
    let arr = JSON.parse(localStorage.getItem("favoris"));
    if (arr && !arr.includes(nft)) {
        arr.push(nft);
        localStorage.setItem('favoris', JSON.stringify(arr));
    } else {
        localStorage.setItem('favoris', JSON.stringify([nft]));
    }

    alert("image ajoutée aux favoris");
}

function removeFeature(index) {
    let arr = JSON.parse(localStorage.getItem("favoris"));
    arr.splice(index, 1);
    localStorage.setItem('favoris', JSON.stringify(arr));
    document.getElementsByClassName("li")[2].click()
}

//Routing

function link({ to }) {
    routing({ pathnameGiven: to })
}

function route({ url, component, routes = null }) {
    if (routes) {
        return {
            url, routing: ({ pathname, nextPathname }) => {
                component({ pathnameGiven: nextPathname, declaredRoutes: routes, prevUrl: pathname })
            }
        }
    }
    return {
        url, action: ({ pathname, ...props }) => {
            if (historyPushAvailable) {
                history.pushState({}, null, pathname)
            }
            component({ ...props });
        }
    }
}

function routing({ pathnameGiven, declaredRoutes = routes, prevUrl = null }) {
    //Exemple with : /nft/150256/details
    const matricePathname = [];
    //Exemple with : [nft,150256,details]
    const pathnameSplit = pathnameGiven.slice(1).split('/');
    if (pathnameGiven != '/') {
        //8 -> 2^length
        const mathPow = (Math.pow(2, pathnameSplit.length));
        //create matrice with index
        let matriceIndex = (mathPow) / 2;
        // Desired result : 
        // ['/nft', '/150256', '/details']
        // ['/nft', '/150256', '/&']
        // ['/nft', '/&', '/details']
        // ['/nft', '/&', '/&']
        // ['/&', '/150256', '/details']
        // ['/&', '/150256', '/&']
        // ['/&', '/&', '/details']
        // ['/&', '/&', '/&']
        //
        //& represents variables
        //create an order of priority
        pathnameSplit.forEach((pathname, index) => {
            let insert = true;
            for (let j = 0; j < mathPow; j++) {
                if (!(j % matriceIndex) && j != 0) {
                    insert = !insert;
                }
                if (index === 0) {
                    matricePathname.push([insert ? ('/' + pathname) : '/&'])
                } else {
                    matricePathname[j].push('/' + (insert ? pathname : '&'));
                }
            }
            matriceIndex = matriceIndex / 2
        });
    } else {
        matricePathname.push(['/'])
        matricePathname[0].push('/&')
    }
    //init props with return in component
    const props = {};
    for (const [index, pathname] of matricePathname.entries()) {
        //compare currentUrl with the declared routes
        const routeIfExist = declaredRoutes.find(declaredRoute => {
            //ex: route declared /nft/:id/details
            //result : ['',nft,:id,details]
            const declaredRouteSplit = declaredRoute.url.split('/');
            //universal:[/nft/&/details]
            const universalRoute = declaredRouteSplit.map(el => el[0] == ':' ? '&' : el).join('/');
            //compare universal '/nft/&/details', path => line in matrice
            if (universalRoute == pathname.slice(0, declaredRouteSplit.length - 1).join('')) {
                //recover the rest of the url for multi-routing
                props.nextPathname = '/' +
                    pathnameSplit.slice(declaredRouteSplit.length - 1).join('/');
                pathname.forEach((el, i) => {
                    //if variable in URL
                    if (el == '/&') {
                        //routeSplit ['',nft,:id,details]
                        if (declaredRouteSplit[i + 1]) {
                            //recover :id => props.id = 150256;
                            props[declaredRouteSplit[i + 1].slice(1)] = pathnameSplit[i];
                        }
                    }
                })
                //url is found
                return true;
            }

        })

        if (routeIfExist) {
            //next-routing
            if (routeIfExist.routing) {
                //global pathname nft/150256/details, with props.nextUrl
                routeIfExist.routing({ pathname: pathnameGiven.slice(1), ...props })
                break;
            }
            //run components with({id}) and change URL in page
            routeIfExist.action({ pathname: (prevUrl || pathnameGiven), ...props });
            break;
        };
    }
}

