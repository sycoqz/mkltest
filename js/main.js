// ----- Goods buttons -----
const goodsInfoButtons = document.querySelectorAll('.goods-card__button-info'),
    goodsPurchaseButtons = document.querySelectorAll('.goods-card__button-purchase'),
    goodsInspectButtons = document.querySelectorAll('.goods__inspect-button');

if (goodsInfoButtons.length)
    goodsInfoButtons.forEach(button => button.addEventListener('click', onGoodsClick))

if (goodsInfoButtons.length)
    goodsPurchaseButtons.forEach(button => button.addEventListener('click', onGoodsPurchaseClick))

if (goodsInspectButtons.length)
    goodsInspectButtons.forEach(btn => btn.addEventListener('click', onGoodsClick))

function onGalleryButtonClick(e) {
    const mainImg = document.querySelector('.goods-modal__inspect-main_img'),
        isPrevButton = e.target.closest('.goods-modal__inspect-button').classList.contains('goods-modal__inspect-button-prev'),
        prevImg = document.querySelector('.goods-modal__inspect--prev_img'),
        activeImg = document.querySelector('.goods-modal__inspect--active_img'),
        nextImg = document.querySelector('.goods-modal__inspect--next_img');

    if (isPrevButton) {
        if (prevImg) {
            if (prevImg.previousElementSibling) prevImg.previousElementSibling.classList.add('goods-modal__inspect--prev_img')
            prevImg.classList.remove('goods-modal__inspect--prev_img')
            prevImg.classList.add('goods-modal__inspect--active_img')
            mainImg.src = prevImg.src
            mainImg.alt = prevImg.alt
            activeImg.classList.remove('goods-modal__inspect--active_img')
            activeImg.classList.add('goods-modal__inspect--next_img')
            if (nextImg) nextImg.classList.remove('goods-modal__inspect--next_img')
        }
    } else {
        if (nextImg) {
            if (prevImg) prevImg.classList.remove('goods-modal__inspect--prev_img')
            activeImg.classList.remove('goods-modal__inspect--active_img')
            activeImg.classList.add('goods-modal__inspect--prev_img')
            nextImg.classList.remove('goods-modal__inspect--next_img')
            nextImg.classList.add('goods-modal__inspect--active_img')
            mainImg.src = nextImg.src
            mainImg.alt = nextImg.alt
            if (nextImg.nextElementSibling) nextImg.nextElementSibling.classList.add('goods-modal__inspect--next_img')
        }
    }
    const elementToScroll = document.querySelector('.goods-modal__inspect--active_img'),
        xPos = elementToScroll.offsetLeft,
        yPos = elementToScroll.offsetTop,
        elementWidth = elementToScroll.offsetWidth,
        elementHeight = elementToScroll.offsetHeight;
    document.querySelector('.goods-modal__inspect-gallery-wrapper').scrollLeft = (xPos - elementWidth);
    document.querySelector('.goods-modal__inspect-gallery-wrapper').scrollTop = (yPos - elementHeight);
}

function onImageClick(e) {
    const img = e.target,
        mainImg = document.querySelector('.goods-modal__inspect-main_img');
    document.querySelectorAll('.goods-modal__inspect-sub_img').forEach(img =>
        img.classList.remove('goods-modal__inspect--prev_img','goods-modal__inspect--active_img','goods-modal__inspect--next_img'))
    img.classList.add('goods-modal__inspect--active_img')
    mainImg.src = img.src
    mainImg.alt = img.alt
    if (img.previousElementSibling) img.previousElementSibling.classList.add('goods-modal__inspect--prev_img')
    if (img.nextElementSibling) img.nextElementSibling.classList.add('goods-modal__inspect--next_img')
}

function onGoodsClick(e) {
    const goodsId = this.dataset.good,
        isInspectButton = e.target.closest('button').classList.contains('goods__inspect-button')
    if (isInspectButton) {
        // modalGoodsInspect(result)
        openModalAndLockScroll(document.querySelector('#goodsInspect'));
        let galleryButtons = document.querySelectorAll('.goods-modal__inspect-button');
            galleryButtons.forEach(btn => {
                btn.addEventListener('click', onGalleryButtonClick)
            })
        document.querySelectorAll('.goods-modal__inspect-sub_img').forEach(img => img.addEventListener('click', onImageClick))
    } else {
        // modalSetGoodsDesc(result)
        openModalAndLockScroll(document.querySelector('#goodsModal'));
    }
    // let goodsInfo = {}
    // goodsInfo.id = goodsId
    // if (goodsInfo.id) {
    //     goodsInfo.ajax = 'goodsInfo'
    //     $.ajax({
    //         url: '/',
    //         data: goodsInfo,
    //         error: result => {
    //             console.error(result)
    //         },
    //         success: result => {
    //             try {
    //                 result = JSON.parse(result)[0]
    //                 if (isInspectButton) {
    //                     modalGoodsInspect(result)
    //                     openModalAndLockScroll(document.querySelector('#goodsInspect'));
    //                 } else {
    //                     modalSetGoodsDesc(result)
    //                     openModalAndLockScroll(document.querySelector('#goodsModal'));
    //                 }
    //             } catch (e) {
    //                 alert('Ошибка получения данных о товаре.')
    //             }
    //         }
    //     })
    // }
}

function modalGoodsInspect(data) {
    let mainImgContainer = document.querySelector('.goods-modal__inspect-main_img'),
        galleryImgContainer = document.querySelector('.goods-modal__inspect-gallery-wrapper'),
        galleryButtons = document.querySelectorAll('.goods-modal__inspect-button');
    mainImgContainer.src = 'userfiles/' + data['img']
    mainImgContainer.alt = data['img'].replace('goods/', '')

    if (data['gallery_img']) {
        let images = data['gallery_img'].split(','),
            gallery = document.querySelector('.goods-modal__inspect-gallery');
        images.unshift(data['img'])
        gallery.innerHTML = ''
        galleryButtons.forEach(btn => {
            btn.classList.remove('none')
            btn.addEventListener('click', onGalleryButtonClick)
        })
        galleryImgContainer.classList.remove('none')
        for (let i = 0; i < images.length; i++) {
            let imgHTML = document.createElement('img');
            images[i] = images[i].trim().replace(/[^a-zA-Z0-9.-/_]/g, '')
            imgHTML.classList.add('goods-modal__inspect-sub_img');
            if (i === 0) {
                imgHTML.classList.add('goods-modal__inspect--active_img')
            }
            if (i === 1) {
                imgHTML.classList.add('goods-modal__inspect--next_img')
            }
            imgHTML.src = 'userfiles/' + images[i]
            imgHTML.alt = images[i].replace('goods/', '')
            imgHTML.loading = 'lazy'
            imgHTML.addEventListener('click', onImageClick);
            gallery.appendChild(imgHTML)
        }
    } else {
        galleryButtons.forEach(btn => btn.classList.add('none'))
        galleryImgContainer.classList.add('none');
    }
}

function modalSetGoodsDesc(data) {
    const descDiv = document.querySelector('.goods-modal__description');
    descDiv.innerHTML = '';
    const getNodes = str => new DOMParser().parseFromString(str, 'text/html').body.childNodes;
    let contentNode = getNodes(data['content']);
    for (let node of contentNode) {
        descDiv.appendChild(node);
    }
}

function onGoodsPurchaseClick() {
    openModalAndLockScroll(document.querySelector('#modalConsultation'))
}


// ----- Slider -----
let swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 10,
    keyboard: {
        enabled: true,
    },

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    navigation: {
        nextEl: '.slider__button-next',
        prevEl: '.slider__button-prev',
    },

    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 16,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 32,
        },
    }

});

const buttons = document.querySelectorAll('.tab-controls-button'),
    cards = document.querySelectorAll('.slider__card');

for (let button of buttons) {
    button.addEventListener('click', onTabClick);
}

function onTabClick() {
    const buttonId = this.dataset.item;
    buttons.forEach(button => button.classList.remove('tab-controls-button--active'));
    this.classList.add('tab-controls-button--active');
    cards.forEach(card => {
        if (buttonId !== 'all') {
            if (card.dataset.item !== buttonId) {
                card.classList.add('none');
            } else {
                card.classList.remove('none');
            }
        } else {
            card.classList.remove('none');
        }
    });

    swiper.update();
}

// popups
function closeOnBackDropClick({ currentTarget, target }) {
    const dialog = currentTarget
    const isClickedOnBackDrop = target === dialog
    if (isClickedOnBackDrop) {
        dialog.close()
        returnScroll()
        returnSwiper()
    }
}

function openModalAndLockScroll(modal) {
    modal.showModal()
    document.body.classList.add('scroll-lock')
    swiper.disable()
}

function returnScroll() {
    document.body.classList.remove('scroll-lock')
}

function returnSwiper() {
    swiper.enable();
}

function close(modal) {
    modal.close()
    returnScroll()
}

const modals = document.querySelectorAll('.modal-window'),
    headerButton = document.querySelector('.header__button'),
    productPackage = document.querySelector('.product-package__button'),
    closeModalButtons = document.querySelectorAll('.modal__close-btn');

if (modals.length) {
    modals.forEach(modal => modal.addEventListener('click', closeOnBackDropClick))
}

if (headerButton) {
    headerButton.addEventListener('click', () => {
        openModalAndLockScroll(document.querySelector('.feedback-modal'));
    })
}

if (productPackage) {
    productPackage.addEventListener('click', () => {
        openModalAndLockScroll(document.querySelector('.feedback-modal'))
    })
}
if (closeModalButtons.length) {
    closeModalButtons.forEach(btn => btn.addEventListener('click', (event) => {
        event.stopPropagation()
        returnScroll()
        swiper.enable();
        close(btn.closest('dialog'))
    }));
}



