import React, { useEffect } from 'react'
import { useState } from 'react'
import './Home.css'

const Home = () => {
  const [selectedDate, setSelectedDate] = useState({date: '05.09', time: '15:00', unix: 1746774000})
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const dates = [{date: '05.09', time: '15:00', unix: 1746774000 }, {date: '05.16', time: '15:00', unix: 1746774000 }, {date: '05.23', time: '15:00', unix: 1746774000 }, {date: '05.30', time: '15:00', unix: 1746774000 }, {date: '06.06', time: '15:00', unix: 1746774000 }];
    useEffect(() => {
        const timer = setInterval(() => {
            const now = Math.floor(new Date().getTime() / 1000);
            const diff = selectedDate.unix - now;
            if (diff <= 0) {
                setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
                clearInterval(timer);
                return;
            }
            const days = Math.floor(diff / (24 * 60 * 60)).toString().padStart(2, '0');
            const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60)).toString().padStart(2, '0');
            const minutes = Math.floor((diff % (60 * 60)) / 60).toString().padStart(2, '0');
            const seconds = Math.floor(diff % 60).toString().padStart(2, '0');
            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, [selectedDate]);
  const products = [
    {
      id: 1,
      name: 'iPhone 16 Pro Max 256GB',
      image: '/image/product1.png',
      originalPrice: 6488000,
      salePrice: 59760,
      stock: 3
    },
    {
      id: 2,
      name: 'iWatch 10 42mm',
      image: '/image/iwatch.png',
      originalPrice: 1000000,
      salePrice: 20000,
      stock: 3
    },
    {
      id: 3,
      name: 'AirPods 4',
      image: '/image/product1.png',
      originalPrice: 6488000,
      salePrice: 59760,
      stock: 3
    },
    {
      id: 4,
      name: 'Юнител эрх',
      image: '/image/unitelLogo.png',
      originalPrice: 500000,
      salePrice: 300000,
      stock: 2,
      isUnitel: true,
      validUntil: '2024.05.31'
    },
    {
      id: 5,
      name: 'iPhone 16 Pro Max 256GB',
      image: '/image/product1.png',
      originalPrice: 6488000,
      salePrice: 59760,
      stock: 3
    }
  ]
  return (
    <div className="home-container">
      {/* Logo Section */}
      {/* Background Images */}
      <img src="/image/splash-left.png" alt="" className="splash-left" />
      <img src="/image/splash-right.png" alt="" className="splash-right" />
      <img src="/image/tail-left.png" alt="" className="tail-left" />
      <img src="/image/tail-right.png" alt="" className="tail-right" />

      {/* Flash Deal Logo */}
      <div className="logo-container" style={{ paddingBottom: '0px !important' }}>
        {/* dsadasdasd */}
        <div className="logo">
          <img src="/image/homeFlashDeal.png" alt="Flashdeal" className="logo-image" />
        </div>
      </div>

      <div className="card-section">
      {/* Date Selector */}
      <div className="date-selector">
        {dates.map((date) => (
          <button
            key={date.date}
            className={`date-tab ${selectedDate.date === date.date ? 'active' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            {date.date}
          </button>
        ))}
      </div>

      {/* Timer Section */}

      <div className="timer-section">
        <p className="timer-info">Flashdeal эхлэх хугацаа: {selectedDate.date} {selectedDate.time}</p>
        <div className="timer-display">
          <div className="timer-block">
            <span className="timer-number">{timeLeft.days}</span>
            <span className="timer-label">Өдөр</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-block">
            <span className="timer-number">{timeLeft.hours}</span>
            <span className="timer-label">Цаг</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-block">
            <span className="timer-number">{timeLeft.minutes}</span>
            <span className="timer-label">Минут</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-block">
            <span className="timer-number">{timeLeft.seconds}</span>
            <span className="timer-label">Секунд</span>
          </div>
        </div>
      </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="stock-badge">{product.stock} ширхэг</div>
            {product.isUnitel ? (
              <div className="unitel-card">
                <img src={product.image} alt="Unitel" className="unitel-logo" style={{ backgroundColor: 'white' }} />
                <div className="unitel-info">
                  <div className="product-price">
                    <span className="sale-price">{product.salePrice.toLocaleString()}₮</span>
                  </div>
                  <p className="valid-until">{product.validUntil} хүртэл ашиглах боломжтой</p>
                </div>
              </div>
            ) : (
              <>
                <img src={product.image} alt={product.name} className="product-image" style={{ backgroundColor: 'white' }}/>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">
                  <span className="sale-price">{product.salePrice.toLocaleString()}₮</span>
                  <span className="original-price">{product.originalPrice.toLocaleString()}₮</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default Home 