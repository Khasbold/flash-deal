import React, { useEffect } from 'react'
import { useState } from 'react'
import './Home.css'

interface Product {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  isUnitel?: boolean;
  validUntil?: string;
}

const Home = () => {
  const [selectedDate, setSelectedDate] = useState({date: '05.09', time: '15:00', unix: 1746774000})
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const dates = [{date: '05.09', time: '15:00', unix: 1746774000 }, {date: '05.16', time: '15:00', unix: 1747378800 }, {date: '05.23', time: '15:00', unix: 1747983600 }, {date: '05.30', time: '15:00', unix: 1748588400 }, {date: '06.06', time: '15:00', unix: 1749193200 }];
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(new Date().getTime() / 1000);
      
      // Find current active date (first date that hasn't passed)
      const currentActiveDate = dates.find(date => date.unix > now);
      const isSelectedDateActive = selectedDate.unix === currentActiveDate?.unix;
      
      // Show countdown only for the active date
      if (isSelectedDateActive) {
        const diff = selectedDate.unix - now;
        
        if (diff <= 0) {
          setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        } else {
          const days = Math.floor(diff / (24 * 60 * 60)).toString().padStart(2, '0');
          const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60)).toString().padStart(2, '0');
          const minutes = Math.floor((diff % (60 * 60)) / 60).toString().padStart(2, '0');
          const seconds = Math.floor(diff % 60).toString().padStart(2, '0');
          setTimeLeft({ days, hours, minutes, seconds });
        }
      } else {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedDate]);

  // Get current active date for conditional rendering
  const now = Math.floor(new Date().getTime() / 1000);
  const currentActiveDate = dates.find(date => date.unix > now);
  const isSelectedDateActive = selectedDate.unix === currentActiveDate?.unix;

  const products = [
    {
      id: 1,
      name: '[Эхлээгүй] iPhone 16 Pro Max 256GB',
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
      stock: 0
    },
    {
      id: 3,
      name: 'AirPods 4',
      image: '/image/product1.png',
      originalPrice: 6488000,
      salePrice: 59760,
      stock: 0
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
      name: '[Эрхгүй]iPhone 16 Pro Max 256GB',
      image: '/image/product1.png',
      originalPrice: 6488000,
      salePrice: 59760,
      stock: 3
    }
  ]

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    if (product.stock !== 0) {
      setShowModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
  }

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
        <div className="logo">
          <img src="/image/homeFlashDeal.png" alt="Flashdeal" className="logo-image" />
        </div>
      </div>

      {/* Notification Banner */}
      {selectedDate.date === '06.06' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>🎉 Баяр хүргэе! Та Flash Deal-с <p style={{color: '#46C800', fontSize: '18px', fontWeight: 'bold'}}>"Юнител эрх 300'000₮"</p> амжилттай худалдан авлаа. Төлбөр төлөлтөө бүрэн хийж худалдан авалтаа баталгаажуулаарай. 😉</p>
        </div>
        <button className="notification-button">Төлбөр төлөх</button>
      </div>
      )}
      {selectedDate.date !== '06.06' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>Та 2025.04.22 - 2025.06.06-ий хооронд гар утас худалдан авснаар Flashdeal-д оролцох боломжтой.</p>
        </div>
        <button className="notification-button">Гар утас авах</button>
      </div>
      )}

      {/* Date Selector - Sticky */}
      <div className="sticky-date-section">
        <div className="date-selector">
          {dates.map((date) => (
            <button
              key={date.date}
              className={`date-tab ${selectedDate.date === date.date ? 'active' : ''}`}
              style={{ backgroundColor: date.date == '06.06' ? '#46C800' : 'transparent' }}
              onClick={() => setSelectedDate(date)}
            >
              {date.date}
            </button>
          ))}
        </div>
      </div>

      {/* Timer Section */}
      <div className="card-section">
        <div className="timer-section">
          {isSelectedDateActive ? (
            <>
              <p className="timer-info">Flash Deal эхлэх хүртэл:</p>
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
            </>
          ) : (
            <>
            <p className="timer-info">Flash deal эхлэх хугацаа</p>
            <p className="timer-info-1">2025.{selectedDate.date} • {selectedDate.time}</p>
            </>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
              {product.stock === 0 ? 'Дууссан' : `${product.stock} ширхэг`}
            </div>
            {product.isUnitel ? (
              <div className="unitel-card" onClick={() => handleProductClick(product)}>
                <img 
                  src={product.image} 
                  alt="Unitel" 
                  className={`unitel-logo ${product.stock === 0 ? 'out-of-stock' : ''}`} 
                  style={{ backgroundColor: 'white' }} 
                />
                <div className="unitel-info">
                  <div className="product-price">
                    <span className="sale-price">{product.salePrice.toLocaleString()}₮</span>
                  </div>
                  <p className="valid-until">[Хожсон]{product.validUntil} хүртэл ашиглах боломжтой</p>
                </div>
              </div>
            ) : (
              <>
                <div onClick={() => handleProductClick(product)}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`product-image ${product.stock === 0 ? 'out-of-stock' : ''}`}
                    style={{ backgroundColor: 'white' }}
                  />
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    <span className="sale-price">{product.salePrice.toLocaleString()}₮</span>
                    <span className="original-price">{product.originalPrice.toLocaleString()}₮</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {selectedProduct?.isUnitel ? (
              <>
                <h2>Баяр хүргэе!</h2>
                <p>Та Юнител эрх авах боломжтой</p>
                <p>Та хожсон тул яарч сандралгүйгээр төлбөрөө төлж шагналаа авна уу 😉</p>
                <div className="modal-buttons">
                  <button className="modal-pay" onClick={() => console.log('Payment')}>
                    Төлбөр төлөх
                  </button>
                  <button className="modal-close" onClick={handleCloseModal}>
                    Хаах
                  </button>
                </div>
              </>
            ) : selectedProduct?.name.includes('[Эрхгүй]') ? (
                <>
                  <h2>Уучлаарай</h2>
                  <p>Танд Flash Deal-д оролцох эрх үүсээгүй байна.  Та Toki-с гар утас худалдан аваад дараагийн Flash Deal-д оролцоорой. 😉</p>
                  <div className="modal-buttons">
                    <button className="modal-pay" onClick={() => console.log('Payment')}>
                    Гар утасны дэлгүүр
                    </button>
                    <button className="modal-close" onClick={handleCloseModal}>
                      Буцах
                    </button>
                  </div>
                </>
              ) : (
              <>
                <h2>Уучлаарай</h2>
                <p>Flash deal эхлэх болоогүй байна</p>
                <button className="modal-close" onClick={handleCloseModal}>
                  Хаах
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home 