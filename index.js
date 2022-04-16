const JSON_TYPE = 'application/json';
const root = document.querySelector('body');
let token = localStorage.getItem("token");
let imageLiked = []

let page = 'Derniers NFT'


//Prompt
const initToken = (string) => {
    while (!token) {
        token = prompt(string);
        if (token) {
            localStorage.setItem("token", token);
            index();
        }
    }
    if (token) {
        index();
    }
}

initToken('Token:');






//functions 
function createElement(tag, config, parent = null, replace = false) {
    const { text, color, className, attributes} = config || {};

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
        console.log('test');
    }
}

async function fetching(url, params) {
    try {
        const response = await fetch(url, params);

        if (response.headers.get('Content-Type') === JSON_TYPE) {
            const responseJson = await response.json();
            if (response.ok) {
                return responseJson;
            } else {
                token = null;
                console.log('test')
                initToken("Votre token n'est plus valable");
            }

        }
    }
    catch (e) {
        console.error(e)
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

function addFeature(nft){
    let arr = JSON.parse(localStorage.getItem("favoris"));
    if(!arr.includes(nft)){
        arr.push(nft);
    }
    localStorage.setItem('favoris',JSON.stringify(arr));
    alert("image ajoutée aux favoris");
}

function removeFeature(index){
    let arr = JSON.parse(localStorage.getItem("favoris"));
    arr.splice(index,1);
    localStorage.setItem('favoris',JSON.stringify(arr));
}


function index() {
    //Code
    const textHeader = `<ul></ul>`;
    const header = createElement('header', { className: "header"}, root);
    const main = createElement('main', { className: "container"}, root);

    const ul = createElement('ul', { className: "ul"}, header);
    const li1 = createElement('li', { className: "li", 
    text : "Derniers NFT",
    }, ul);
    
    const li2 = createElement('li', { className: "li" ,
    text : "Collection",
    }, ul);
   
    const li3 = createElement('li', { className: "li" ,
    text : "Favoris",
    }, ul);
    

    //components


    // const assets = () => {
        
    //     //Const & let
    //     const rootUrl = 'https://api.m3o.com/v1/nft/Assets';
    //     let nfts = [];

    //     //Components
    //     const container = createElement('div', { className: "container list" }, main, true)
    //     const loading = createElement('div', { className: "ui loader active" }, container, true);
    //     const list = createElement('div', { className: 'grid' })
    //     const separate = createElement('div', { className: "separate" })

    //     const width = Math.floor(container.offsetWidth);
    //     const nbr = Math.floor(width / 350);
    //     const margin = (nbr - 1) * 40 / nbr;
    //     const columnSize = Math.floor((width / nbr) - 1 - margin);

    //     const execute = (request) => {
    //         useFetch(request).then((data) => {
    //             if (data) {
    //                 nfts = nfts.concat(data.assets);
    //                 if (loading) {
    //                     loading.remove();
    //                     container.appendChild(list);
    //                     container.appendChild(separate);
    //                 }
    //                listRender(data);
    //             }
    //         })
    //     }

    //     const lazyLoading = new IntersectionObserver((elements) => {
    //         elements.forEach((element) => {
    //             if (element.isIntersecting) {
    //                 const img = element.target;
    //                 img.src = img.dataset.src || img.src;
    //                 img.classList.remove("lazy-loading");
    //                 lazyLoading.unobserve(img);
    //             }
    //         });
    //     });

    //     const preLoading = new IntersectionObserver((elements) => {
    //         elements.forEach((element) => {
    //             if (element.isIntersecting) {
    //                 const section = element.target;
    //                 execute({
    //                     url: rootUrl,
    //                     method: 'POST',
    //                     body: {
    //                         cursor: section.getAttribute("data-url")
    //                     }
    //                 });
    //             }
    //         });
    //     }, { rootMargin: "500px" });

    //     execute({ url: rootUrl });

    //     const listRender = (nftList) => {
    //         //For each NFTS
    //         nftList.assets.forEach(nft => {
    //             if (nft.image_url) {
    //                 const nftElement = createElement('div', {
    //                     className: "column",
    //                     attributes: [{
    //                         key: "style", value: `width:${columnSize}px`
    //                     }]
    //                 }, list)
    //                 //Create Img with lazyLoading
    //                 const imgContainer = createElement('div', {
    //                     attributes: [{
    //                         key: "style",
    //                         value: `height:${columnSize}px`
    //                     }],
    //                     className: "crop"
    //                 }, nftElement)
    //                 const imgCenter = createElement('div', {
    //                     className: "img-center"
    //                 }, imgContainer)
    //                 const img = createImg(nft.image_url, imgCenter);
    //                 const name = createElement('p', {
    //                     className: "",
    //                     text: nft.name
    //                 }, nftElement)
    //                 const creator = createElement('p', {
    //                     className: "",
    //                     text: `par <a href="">${nft.collection.slug}</a>`
    //                 }, nftElement)
    //                 const likeButton =createElement('img', {
    //                     className: "",
    //                     attributes:[{key:'src',value:'assets/like.png'}]
                        
    //                 }, nftElement);
    //                 likeButton.addEventListener("click",(e)=>{
    //                     if(!imageLiked.includes(nft)){
    //                         imageLiked.push(nft);
    //                         localStorage.setItem('favoris',JSON.stringify(imageLiked));
    //                         alert("image ajoutée aux favoris");
    //                     }
    //                 })
                    
    //                 //Observe with scroll
    //                 lazyLoading.observe(img);
    //             }
    //         })
    //         if (nftList.next) {
    //             separate.setAttribute("data-url", nftList.next)
    //             preLoading.observe(separate);
    //         }
    //     }
    // }
    // assets();
    li1.addEventListener("click",(e)=>{
        page = "Derniers NFT";
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
                        const likeButton =createElement('div', {
                            className: "extra content",
                            text: `<a><i class="heart icon"></i>favoris</a>`
                        }, nftElement);
                        likeButton.addEventListener("click",() => addFeature(nft));
                        
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

    });

    li2.addEventListener("click",(e)=>{
        page = "Collection"; 
    });
    
    li3.addEventListener("click",(e)=>{
        page = "Favoris"; 
        const favoris = () => {
        
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
                JSON.parse(nftList).forEach((nft,index) => {
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
                        const likeButton =createElement('img', {
                            className: "imgLike",
                            attributes:[{key:'src',value:'assets/like.png',}]
                            
                        }, nftElement);
                        likeButton.addEventListener("click",() => removeFeature(index));
                        
                        //Observe with scroll
                        lazyLoading.observe(img);
                    }
                })
                if (nftList.next) {
                    separate.setAttribute("data-url", nftList.next)
                    preLoading.observe(separate);
                }
            }
            
            listRender(localStorage.getItem('favoris'));
        }
        favoris();
    });
}







