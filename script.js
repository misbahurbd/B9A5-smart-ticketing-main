const seatElements = document.querySelectorAll('.ticket-btn')
const couponForm = document.getElementById('coupon-form')
const customerInfoForm = document.getElementById('customer-info-form')

const coupons = [
  {
    value: 'NEW15',
    discount: 15,
  },
  {
    value: 'Couple20',
    discount: 20,
  },
]

const orderDetails = {
  selectedSeat: [],
  ticketPrice: 550,
  coupon: '',
  totalSeat: 40,
  maxTicket: 4,
  total() {
    if (this.selectedSeat.length === 0) {
      return 0
    }
    return this.selectedSeat.length * this.ticketPrice
  },
  discount() {
    if (this.coupon === '') {
      return 0
    }
    const coupon = coupons.find((coupon) => coupon.value === this.coupon)
    return this.total() * (coupon.discount / 100)
  },
  grandTotal() {
    return this.total() - this.discount()
  },
}

seatElements.forEach((seatElement) => {
  seatElement.addEventListener('click', (e) => {
    if (e.target.id) {
      onSeatBook(e.target.id)
    }
  })
})

const goToTicketingSection = () => {
  const section = document.getElementById('ticketing-section')
  section.scrollIntoView({ behavior: 'smooth' })
}

const updateSeatUi = () => {
  const seatElements = document.getElementsByClassName('ticket-btn')
  for (let i = 0; i < seatElements.length; i++) {
    const seatElement = seatElements[i]
    seatElement.classList.remove('selected')
  }

  for (let i = 0; i < seatElements.length; i++) {
    const seatElement = seatElements[i]
    if (orderDetails.selectedSeat.includes(seatElement.id)) {
      seatElement.classList.add('selected')
    }
  }

  const remainingSeatElement = document.getElementById('remaining-seat')
  remainingSeatElement.innerText = orderDetails.totalSeat - orderDetails.selectedSeat.length
}

const updateOrderDetailsUi = () => {
  const orderDetailElements = document.getElementById('order-details-block')
  const countElement = orderDetailElements.querySelector('#seat-count')
  const priceElement = orderDetailElements.querySelector('#total-price')
  const grandPriceElement = orderDetailElements.querySelector('#grand-price')
  const orderItemListElement = orderDetailElements.querySelector('#order-item-list')
  const couponForm = orderDetailElements.querySelector('#coupon-form')
  const discountElement = orderDetailElements.querySelector('#discount-element')
  const discountPriceElement = orderDetailElements.querySelector('#discount-price')

  if (orderDetails.selectedSeat.length === 0) {
    orderItemListElement.innerHTML = `<p class="py-3 text-center text-primary/50">No seat selected!</p>`
  } else {
    let html = ''
    for (let i = 0; i < orderDetails.selectedSeat.length; i++) {
      const seat = orderDetails.selectedSeat[i]
      html += `<div class="order-item">
      <p>${seat}</p>
      <p>Business</p>
      <p class="text-end">${orderDetails.ticketPrice}</p>
    </div>`
    }
    orderItemListElement.innerHTML = html
  }

  if (orderDetails.selectedSeat.length === 4) {
    couponForm.coupon.disabled = false
    couponForm.querySelector('button').disabled = false
  }

  if (orderDetails.coupon !== '') {
    couponForm.classList.add('hidden')
  }
  if (orderDetails.coupon !== '') {
    couponForm.classList.add('hidden')
    discountElement.classList.remove('hidden')
  }

  countElement.innerText = orderDetails.selectedSeat.length
  priceElement.innerText = orderDetails.total()
  grandPriceElement.innerText = orderDetails.grandTotal()
  discountPriceElement.innerText = orderDetails.discount()
}

const onSeatBook = (seatId) => {
  if (orderDetails.selectedSeat.includes(seatId)) {
    return
  }
  if (orderDetails.selectedSeat.length === 4) {
    alert('You can only book 4 seats!')
    return
  }
  orderDetails.selectedSeat.push(seatId)
  updateSeatUi()
  updateOrderDetailsUi()
}

const onCouponSubmit = (e) => {
  e.preventDefault()
  const coupon = e.target.coupon.value
  const isCouponValid = coupons.some((cp) => cp.value === coupon)
  if (!isCouponValid) {
    alert('Invalid coupon!')
    return
  } else {
    orderDetails.coupon = coupon
    updateOrderDetailsUi()
  }
}

const onCustomerFormUpdate = (e) => {
  e.preventDefault()
  if (customerInfoForm.name.value.length !== 0 && customerInfoForm.number.value.length !== 0) {
    customerInfoForm.submitBtn.disabled = false
  } else {
    customerInfoForm.submitBtn.disabled = true
  }
}

const resetOrder = () => {
  const orderConfirmation = document.getElementById('order-confirmation')

  orderDetails.selectedSeat = []
  orderDetails.coupon = ''
  updateOrderDetailsUi()
  updateSeatUi()

  orderConfirmation.classList.add('hidden')
  customerInfoForm.reset()
  couponForm.reset()
}

const onCustomerFormSubmit = (e) => {
  e.preventDefault()
  const orderConfirmation = document.getElementById('order-confirmation')
  orderConfirmation.classList.remove('hidden')

  const orderContinue = document.getElementById('order-continue')
  orderContinue.addEventListener('click', resetOrder)
}

couponForm.addEventListener('submit', onCouponSubmit)

customerInfoForm.addEventListener('change', onCustomerFormUpdate)
customerInfoForm.addEventListener('submit', onCustomerFormSubmit)

updateSeatUi()
updateOrderDetailsUi()
