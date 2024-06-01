document.addEventListener('DOMContentLoaded', () => {

    let moreBtn = document.querySelector('.card-main-info__description .more-button')

    if (moreBtn) {

        moreBtn.addEventListener('click', e => {

            e.preventDefault()

            document.querySelectorAll('.card-tabs__toggle.tabs__toggle')[1].dispatchEvent(new Event('click'))

            // Скрол и триггер кнопки характеристика
            window.scrollTo({
                top: document.querySelector('.card-tabs').getBoundingClientRect().top + scrollY,
                behavior: 'smooth'
            })

        })

    }

    (function () {

        let start = 0

        document.querySelectorAll('.card-main-gallery-thumb__slide').forEach(item => {

            item.addEventListener('click', () => {

                let itemCoordinates = item.getBoundingClientRect()

                let parentCoordinates = item.parentElement.parentElement.getBoundingClientRect()

                // Выравнивание относительно скрола экрана
                let itemY = scrollY + itemCoordinates.top

                let parentY = scrollY + parentCoordinates.top

                let margin = parseFloat(getComputedStyle(item)['marginBottom'])

                let top = Math.ceil(itemCoordinates.height + margin)

                if (item.nextElementSibling && Math.ceil(itemY - parentY + top) >= parentCoordinates.height) {

                    start -= top

                } else if (item.previousElementSibling && itemY <= parentY) {

                    start += top

                }
                // Смещение контейнера
                item.parentElement.style.transition = '0.3s'

                item.parentElement.style.transform = `translate3d(0px, ${start}px, 0px)`

            })

        })

    })()

    changeQty()

    addToCart()

    document.querySelectorAll('[data-popup]').forEach(item => {

        if (item.getAttribute('data-popup')) {

            let popupElement = document.querySelector(`.${item.getAttribute('data-popup')}`)

            if (popupElement) {

                item.addEventListener('click', e => {

                    e.preventDefault()

                    popupElement.classList.add('open')

                })

                popupElement.addEventListener('click', e => {

                    if (e.target === popupElement) {

                        popupElement.classList.remove('open')

                    }

                })

            }

        }

    })

    let authVariants = document.querySelectorAll('.login-popup h2 span')

    let authFormVariants = document.querySelectorAll('.login-popup form')

    authVariants.forEach(item => {

        item.addEventListener('click', () => {

            let index = [...authVariants].indexOf(item)

            authFormVariants[index].style.display = 'block'

            authFormVariants[+!index].style.display = 'none'


        })

    })

})

function addToCart() {

    document.querySelectorAll('[data-addToCart]').forEach(item => {

        item.addEventListener('click', e => {

            e.preventDefault()

            let cart = {}

            cart.id = +item.getAttribute('data-addToCart')

            if (cart.id && !isNaN(cart.id)) {

                let productContainer = item.closest('[data-productContainer]') || document

                cart.qty = 1

                let qtyBlock = productContainer.querySelector('[data-quantity]')

                if (qtyBlock) {

                    cart.qty = +qtyBlock.innerHTML || 1

                }

                cart.ajax = 'add_to_cart'

                $.ajax({
                    url: '/',
                    data: cart,
                    error: result => {
                        console.error(result)
                    },
                    success: result => {

                        console.log(result)

                        try {

                            result = JSON.parse(result)

                            if (typeof result.current === 'undefined') {

                                throw new Error('')

                            }

                            item.setAttribute('data-toCartAdded', true);

                            ['data-totalQty', 'data-totalSum', 'data-totalOldSum'].forEach(attr => {

                                let cartAttr = attr.replace(/data-/, '').replace(/([^A-Z])([A-Z])/g, '$1_$2').toLowerCase()

                                document.querySelectorAll(`[${attr}]`).forEach(element => {

                                    if (typeof result[cartAttr] !== 'undefined') {

                                        element.innerHTML = result[cartAttr] + (attr === 'data-totalQty' ? '' : ' руб.');

                                    }

                                })

                            })

                        } catch (e) {

                            alert('Ошибка добавления в корзину')

                        }
                    }
                })

            }

        })

    })

}

function changeQty() {

    let qtyButtons = document.querySelectorAll('[data-quantityPlus], [data-quantityMinus]')

    if (qtyButtons.length) {

        qtyButtons.forEach(item => {

            item.addEventListener('click', e => {

                e.preventDefault()

                let productContainer = item.closest('[data-productContainer]') || document

                let qtyElement = productContainer.querySelector('[data-quantity]')

                if (qtyElement) {

                    let qty = +qtyElement.innerHTML || 1

                    if (item.hasAttribute('data-quantityPlus')) {

                        qty++

                    } else {

                        qty = qty <= 1 ? 1 : --qty

                    }

                    qtyElement.innerHTML = qty

                    let addToCart = productContainer.querySelector('[data-addToCart]')

                    if (addToCart) {

                        if (addToCart && addToCart.hasAttribute('data-toCartAdded')) {

                            addToCart.dispatchEvent(new Event('click'))

                        }

                    }

                }

            })

        })

    }

}

document.querySelectorAll('input[type="tel"]').forEach(item => phoneValidate(item))

function phoneValidate(item) {

    //+7(495)111-22-33
    let countriesOptions = {

        '+7': {
            limit: 16,
            firstDigits: '87',
            formatChars: {
                2: '(',
                6: ')',
                10: '-',
                13: '-'
            }
        }
    }

    item.addEventListener('input', e => {

        if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {

            return false

        }

        item.value = item.value.replace(/\D/g,'')

        if (item.value) {

            //Формирование ключей
            for (let code in countriesOptions) {

                if (countriesOptions.hasOwnProperty(code) && countriesOptions[code].firstDigits) {

                    let regExp = new RegExp(`^[${countriesOptions[code].firstDigits}]`)

                    if (regExp.test(item.value)) {

                        // Замена подданного значения на код (+7)
                        item.value = item.value.replace(regExp, code)

                        break

                    }

                }

            }

            if (!$(/^\+/).text(item.value)) {

                item.value = '+' + item.value

            }

            for (let code in countriesOptions) {

                if (countriesOptions.hasOwnProperty(code)  && countriesOptions[code].firstDigits) {

                    let regExp = new RegExp(code.replace(/\+/g, '\\+'), 'g')

                    if (regExp.test(item.value)) {

                        for (let i in countriesOptions[code].formatChars) {

                            let j = +i

                            if (item.value[j] && (item.value[j] !== countriesOptions[code].formatChars[i])) {

                                item.value = item.value.substring(0, j) + countriesOptions[code].formatChars[i] + item.value.substring(j)

                            }

                        }

                        if (item.value[countriesOptions[code].limit]) {

                            item.value = item.value.substring(0, countriesOptions[code].limit)

                        }

                    }

                }

            }

        }

    })

    item.dispatchEvent(new Event('input'))

    item.addEventListener('change', () => phoneValidate(item))

}
