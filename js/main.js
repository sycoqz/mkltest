// ----- Goods buttons -----
const goodsInfoButtons = document.querySelectorAll('.goods-card__button-info');
const goodsPurchaseButtons = document.querySelectorAll('.goods-card__button-purchase');

if (goodsInfoButtons.length) {
    goodsInfoButtons.forEach(button => button.addEventListener('click', onGoodsInfoClick))
}

if (goodsInfoButtons.length) {
    goodsPurchaseButtons.forEach(button => button.addEventListener('click', onGoodsPurchaseClick))
}

async function onGoodsInfoClick() {
    const goodsId = this.dataset.good;
    let goodsInfo = {}
    openModalAndLockScroll(document.querySelector('#goodsModal'))
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
    //                 result = JSON.parse(result)
    //                 const data = result[0],
    //                     descDiv = document.querySelector('.goods-modal__description');
    //                 descDiv.innerHTML = '';
    //                 const getNodes = str => new DOMParser().parseFromString(str, 'text/html').body.childNodes;
    //                 let contentNode = getNodes(data['content']);
    //                 for (let node of contentNode) {
    //                     descDiv.appendChild(node);
    //                 }
    //                 openModalAndLockScroll(document.querySelector('#goodsModal'));
    //             } catch (e) {
    //                 alert('Ошибка получения данных о товаре.')
    //             }
    //         }
    //     })
    // }
}

function onGoodsPurchaseClick() {
    openModalAndLockScroll(document.querySelector('#modalConsultation'))
}


// ----- Slider -----
const swiper = new Swiper('.swiper', {
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
    }
}

function openModalAndLockScroll(modal) {
    modal.showModal()
    document.body.classList.add('scroll-lock')
}

function returnScroll() {
    document.body.classList.remove('scroll-lock')
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
        close(btn.closest('dialog'))
    }));
}



