import React, { useEffect } from 'react'
import { useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import './Home.css'

interface Product {
  productId: number;
  name: string;
  quantity: number;
  discountedPrice: number;
  actualPrice: number;
}

const Home = () => {
  const [selectedDate, setSelectedDate] = useState({id: 1,date: '05.09', time: '15:00', unix: 1746774000})
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const [showModal, setShowModal] = useState(false)
  const [isLegit, setIsLegit] = useState('')
  // const [userId, setUserId] = useState('5ff7d646893101e0ef38a369'); // ok
  // const [userId, setUserId] = useState('a3d5f8e2015f4c9a7bcde102'); // ready
  // const [userId, setUserId] = useState('bb92734a8c11401b9e45fa2c'); // employee
  // const [userId, setUserId] = useState('d14e9a0b6f814fcfa5de9a30'); // won
  const [userId, setUserId] = useState('7c5eab90123c4567de8f10aa'); // paid
  // const [userId, setUserId] = useState('e90d7b23acde1023456fe78a'); // unpaid
  const [productList, setProductList] = useState([])
  const [isStarted, setIsStarted] = useState(false);
  const [jumpLink, setJumpLink] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const dates = [{id : 1, date: '05.09', time: '15:00', unix: 1746774000 }, {id : 2, date: '05.16', time: '15:00', unix: 1747378800 }, {id : 3, date: '05.23', time: '15:00', unix: 1747983600 }, {id : 4, date: '05.30', time: '15:00', unix: 1748588400 }, {id : 5, date: '06.06', time: '15:00', unix: 1749193200 }];


  const checkUser = async () => {
    fetch(`https://campaign.unitel.mn/flash-deal/v1/check/user?userId=${userId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsLegit(data.status);
        if (data.status == 'won') {
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getProducts = async () => {
    fetch(`https://campaign.unitel.mn/flash-deal/v1/week/stock?week=${selectedDate.id}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        // ЭХЭЛСЭН БОЛГОВ
        // setIsStarted(data.isDealActive);
        setIsStarted(true);
        setProductList(data.availableGifts[0]);
      });
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (selectedDate.id == 1) {
      setIsStarted(true);
    }
    
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
  useEffect(() => {
    getProducts();
  }, [selectedDate]);
  useEffect(() => {
    console.log('dddddddd:')
    setInterval(() => {
      //   fetch(`http://10.136.32.220:8080/flash-deal/week/stock?week=${currentActiveDate?.id}`, {
      //     method: 'GET',
      //   })
      //     .then((res) => res.json())
      //     .then((data) => {
      //       // ЭХЭЛСЭН БОЛГОВ
      //       // setIsStarted(data.isDealActive);
      //       setIsStarted(true);
      //       setProductList(data.availableGifts);
      //     });
      }, 1000);
  }, [!isStarted]);

  const handleProductClick = (product: Product) => {
    console.log('product: ', product);
    if (isStarted) {
      setSelectedProduct(product)
      if (product.quantity == 0) {
        toast.error('Уг бүтээгдэхүүн дууссан байна', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: 0,
          theme: "light",
          transition: Bounce,
          });
      } else if (product.quantity != 0 && isLegit == 'not ok') {
        toast.warn('Уг бүтээгдэхүүн эрхгүй байна', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: 0,
        });
      } else if (isLegit == 'employee') {
        toast.warn('Уучлаарай, Энэ удаагийн урамшуулалт нөхцөлд Юнител группийн ажилтнууд хамрагдах боломжгүй байна. 😔 ', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: 0,
        });
      } else if (product.quantity != 0 && isLegit == 'won' || isLegit == 'paid') {
        toast.warn('Та хожсон тул дахин бүтээгдэхүүн авах боломжгүй', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          progress: 0,
        });
      } else if (isLegit == 'ready') {
        fetch(`https://campaign.unitel.mn/flash-deal/v1/trybuy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            productId: product.productId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('data: ', data);
            if (data.status == 'success') {
              setJumpLink(data.deepLink);
              checkUser();
            }
            getProducts();
          });
      }
    } else {
      toast.warn('Flash deal эхлэх болоогүй байна', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: 0,
        theme: "light",
        transition: Bounce,
        });
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
  }
  const changeUserId = (userId: string) => {
    setUserId(userId);
    checkUser();
  }

  return (
    <div className="home-container">
      <ToastContainer
        style={{ marginTop: '40px'}}
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable
        theme="light"
        transition={Bounce}
      />
      {/* Logo Section */}

      {/* Flash Deal Logo */}
      <div className="logo-container" style={{ paddingBottom: '0px !important' }}>
        <div className="logo">
          <img src="/image/flashdeal.png" alt="Flashdeal" className="logo-image" />
        </div>
      </div>
      <div style={{ margin: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={userId}
          defaultValue={userId}
          onChange={(e) => changeUserId(e.target.value)}
          placeholder="Enter User ID"
          style={{ color: 'white', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={() => checkUser()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Update User
        </button>
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
      {isLegit == 'ok' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>Та 2025.04.22 - 2025.06.06-ий хооронд гар утас худалдан авснаар Flashdeal-д оролцох боломжтой.</p>
        </div>
        <button className="notification-button" onClick={() => window.location.replace("https://link.toki.mn/ykqv")}>Гар утас авах</button>
      </div>
      )}
      {isLegit == 'employee' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>Уучлаарай, Энэ удаагийн урамшуулалт нөхцөлд Юнител группийн ажилтнууд хамрагдах боломжгүй байна. 😔</p>
        </div>
      </div>
      )}
      {isLegit == 'won' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>🎉Баяр хүргэе! Та маш хурдтай байж Flash Deal-н ялагч боллоо. Та төлбөр төлөлтөө бүрэн хийж худалдан авалтаа баталгаажуулаарай. 😉</p>
        </div>
        <button className="notification-button" onClick={() => window.location.replace(jumpLink)} >Төлбөр төлөх</button>
      </div>
      )}

      {/* Timer Section */}
      <div className="card-section">
      {/* Date Selector - Sticky */}
      <div className="sticky-date-section">
        <div className="date-selector">
          {dates.map((date) => (
            <button
              key={date.date}
              className={`date-tab ${selectedDate.date === date.date ? 'active' : ''}`}
              style={{ backgroundColor: date.date == '06.06' ? '#46C800' : selectedDate.date === date.date ? '#23333D' : 'transparent' }}
              onClick={() => setSelectedDate(date)}
            >
              {date.date}
            </button>
          ))}
        </div>
      </div>
        <div className="timer-section">
          {isSelectedDateActive ? (
            <>
              <p className="timer-info">Flash Deal эхлэх хугацаа: 2025.{selectedDate.date} {selectedDate.time}</p>
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
        {productList.map((product: Product) => (
          <div key={product.id} className="product-card">
            <div className={`stock-badge ${product.quantity === 0 ? 'out-of-stock' : ''}`}>
              {product.quantity === 0 ? 'Дууссан' : `${product.quantity} ширхэг`}
            </div>
                <div onClick={() => handleProductClick(product)}>
                  <img 
                    src={product.name.includes('эрхийн бичиг') ? `/image/${product.name} ${product.actualPrice}.jpg` : `/image/${product.name}.png`} 
                    alt={product.name} 
                    className={`product-image ${product.quantity === 0 ? 'out-of-stock' : ''}`}
                    style={{ backgroundColor: 'white' }}
                  />
                  {product.name.includes('эрхийн бичиг') ? <>
                    <div className="unitel-info">
                  <div className="product-price">
                    <span className="sale-price">{product.actualPrice.toLocaleString()}₮</span>
                  </div>
                  <p className="valid-until">Toki-р нэгж, дата авах, төлбөр төлөхдөө ашиглах эрх</p>
                </div>
                </> : <>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    <span className="sale-price">{!product.name.includes('эрхийн бичиг') ? product.discountedPrice.toLocaleString() : product.actualPrice.toLocaleString()}₮</span>
                    {!product.name.includes('эрхийн бичиг') ? <span className="original-price">{product.actualPrice.toLocaleString()}₮</span> : <></>}
                  </div>
                </>}
                </div>
          </div>
        ))}
      </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {isLegit == 'ok' ? (
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
              ) : isLegit == 'employee' ? (
                <>
                  <h2>Уучлаарай</h2>
                  <p>Энэ удаагийн урамшуулалт нөхцөлд Юнител группийн ажилтнууд хамрагдах боломжгүй байна. 😔</p>
                  <div className="modal-buttons">
                    <button className="modal-close" onClick={handleCloseModal}>
                      Буцах
                    </button>
                  </div>
                </>
              ) : isLegit == 'paid' ? (
                <>
                  <h2>Уучлаарай</h2>
                  <p>Хэрэглэгч та Flash Deal-с зөвхөн 1 удаа худалдан авалт хийх боломжтойг анхаарна уу.</p>
                  <div className="modal-buttons">
                    <button className="modal-close" onClick={handleCloseModal}>
                      Буцах
                    </button>
                  </div>
                </>
              ) : isLegit == 'won' ? (
                <>
                  <h2>🎉Баяр хүргэе!</h2>
                  <p>Та маш хурдтай байж Flash Deal-н ялагч боллоо. Та төлбөр төлөлтөө бүрэн хийж худалдан авалтаа баталгаажуулаарай. 😉</p>
                  <div className="modal-buttons">
                  <button className="modal-pay" onClick={() => console.log('Payment')}>
                    Төлбөр төлөх
                  </button>
                  <button className="modal-close" onClick={handleCloseModal}>
                    Хаах
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