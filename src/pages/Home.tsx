import React, { useEffect } from 'react'
import { useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { FaQuestionCircle } from 'react-icons/fa';
import './Home.css'

interface Product {
  productId: number;
  name: string;
  quantity: number;
  discountedPrice: number;
  actualPrice: number;
}

const Home = () => {
  const [selectedDate, setSelectedDate] = useState({id: 1,date: '05.09', time: '13:00', unix: 1746774000})
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const [showModal, setShowModal] = useState(false)
  const [isLegit, setIsLegit] = useState('')
  const [legitObj, setLegitObj] = useState()
  const [wonProduct, setWonProduct] = useState('')
  const [tokenId, setTokenId] = useState('5ff7d646893101e0ef38a369'); // ok
  // const [tokenId, setTokenId] = useState('a3d5f8e2015f4c9a7bcde102'); // ready
  // const [tokenId, setTokenId] = useState('bb92734a8c11401b9e45fa2c'); // employee
  // const [tokenId, setTokenId] = useState('d14e9a0b6f814fcfa5de9a30'); // won
  // const [tokenId, setTokenId] = useState('7c5eab90123c4567de8f10aa'); // paid
  // const [tokenId, setTokenId] = useState('e90d7b23acde1023456fe78a'); // unpaid
  const [productList, setProductList] = useState([])
  const [isStarted, setIsStarted] = useState(false);
  const [jumpLink, setJumpLink] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const dates = [{id : 1, date: '05.09', time: '13:00', unix: 1746766800 }, {id : 2, date: '05.16', time: '13:00', unix: 1747371600 }, {id : 3, date: '05.23', time: '13:00', unix: 1747976400 }, {id : 4, date: '05.30', time: '13:00', unix: 1748581200 }, {id : 5, date: '06.06', time: '13:00', unix: 1749186000 }];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urltokenId = urlParams.get('tokenid');
    if (urltokenId) {
      setTokenId(urltokenId);
    }
  }, []);

  const checkUser = async () => {
    fetch(`https://campaign.unitel.mn/flash-deal/v1/check/user?tokenId=${tokenId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLegit(data.status);
        setLegitObj(data);
        if (data.productName) {
          setWonProduct(data.productName);
        } else {
          setWonProduct('productName');
        }
        if (data.status == 'won' || data.status == 'paid') {
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
      } else if (product.quantity != 0 && isLegit == 'ok') {
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
        toast.warn('Хэрэглэгч та Flash Deal-с зөвхөн 1 удаа худалдан авалт хийх боломжтойг анхаарна уу.', {
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
            userId: legitObj.userId,
            productId: product.productId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              setJumpLink(data.deeplink);
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
  const changetokenId = (tokenId: string) => {
    setTokenId(tokenId);
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
        {/* Helper Tooltip Section */}
        {/* <div className="helper-tooltip">
          <FaQuestionCircle 
            className="question-icon" 
            style={{ 
              color: '#9CA3AF',
              fontSize: '28px', 
              cursor: 'pointer',
              marginLeft: '10px',
              opacity: '0.8'
            }} 
            onMouseEnter={(e) => {
              const tooltip = document.createElement('div');
              tooltip.className = 'tooltip';
              tooltip.innerHTML = "Та 2025.05.01 - 2025.06.05-ны хугацаанд 'Toki лизинг'-ээр гар утас худалдан авснаар Flash Deals-т оролцох эрхтэй болно. Нэг л удаа худалдан авалт хийсэн бол бүх Flash Deals-т оролцох боломжтой. 😉";
              tooltip.style.position = 'absolute';
              tooltip.style.backgroundColor = '#23333D';
              tooltip.style.color = 'white';
              tooltip.style.padding = '12px';
              tooltip.style.borderRadius = '8px';
              tooltip.style.maxWidth = '300px';
              tooltip.style.zIndex = '1000';
              tooltip.style.top = `${e.clientY + 10}px`;
              tooltip.style.left = `${e.clientX + 10}px`;
              document.body.appendChild(tooltip);
            }}
            onMouseLeave={() => {
              const tooltips = document.getElementsByClassName('tooltip');
              if (tooltips.length > 0) {
                tooltips[0].remove();
              }
            }}
          />
        </div> */}

        <div className="logo">
          <img src={`${import.meta.env.VITE_BASE_PATH}image/flashdeal.png`} alt="Flashdeal" className="logo-image" />
        </div>
      </div>
      <div style={{color: 'white', fontSize: '18px' }}>User status: {isLegit.toUpperCase()}</div>
      <div style={{ margin: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => changetokenId(e.target.value)}
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
      {isLegit == 'won' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>🎉 Баяр хүргэе! Та Flash Deal-с <p style={{color: '#46C800', fontSize: '18px', fontWeight: 'bold'}}>{wonProduct}</p> амжилттай худалдан авлаа. Төлбөр төлөлтөө бүрэн хийж худалдан авалтаа баталгаажуулаарай. 😉</p>
        </div>
        <a href={legitObj.deeplink}><button className="notification-button">Төлбөр төлөх</button></a>
      </div>
      )}
      {isLegit == 'paid' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>Та Flash Deal-с <p style={{color: '#46C800', fontSize: '18px', fontWeight: 'bold'}}>{wonProduct}</p> амжилттай худалдан авсан байна. Таны худалдан авсан эрх Toki хэтэвч хэсэгт нь идэвхэжсэн байгаа шүү. 🤗</p>
        </div>
        <a href="https://staging-links.toki.mn/7Ren" target='_blank'><button className="notification-button">Хэтэвч шалгах</button></a>
      </div>
      )}
      {isLegit == 'ready' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>Худалдан авалт хийсэн та Flash Deal-д оролцох боломжтой байна. Таньд амжилт хүсье. 😉</p>
        </div>
      </div>
      )}
      {isLegit == 'ok' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>Та 2025.05.01 - 2025.06.05-ны хугацаанд 'Toki лизинг'-ээр гар утас худалдан авснаар Flash Deals-т оролцох эрхтэй болно. Нэг л удаа худалдан авалт хийсэн бол бүх Flash Deals-т оролцох боломжтой.</p>
        </div>
        <a href="https://staging-links.toki.mn/NXwc"><button className="notification-button">Гар утас авах</button></a>
        {/* <a href="https://staging-links.toki.mn/7Ren"><button className="notification-button">Гар утас авах</button></a> */}
      </div>
      )}
      {isLegit == 'employee' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>Уучлаарай, Энэ удаагийн урамшуулалт нөхцөлд Юнител группийн ажилтнууд хамрагдах боломжгүй байна. 😔</p>
        </div>
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
                    src={product.name.includes('эрхийн бичиг') || product.name.includes('хэтэвч цэнэглэлт') ? `${import.meta.env.VITE_BASE_PATH}image/${product.name} ${product.actualPrice}.png` : `${import.meta.env.VITE_BASE_PATH}image/${product.name}.png`} 
                    alt={product.name} 
                    className={`product-image ${product.quantity === 0 ? 'out-of-stock' : ''}`}
                    style={{ backgroundColor: 'white' }}
                  />
                  {product.name.includes('эрхийн бичиг') ? <>
                    <div className="product-price">
                  <span className="sale-price">{product.discountedPrice.toLocaleString()}₮</span>
                    <span className="original-price">{product.actualPrice.toLocaleString()}₮</span>
                  </div>
                    <h3 className="product-name">
                    {product.name.includes('Unitel') ? 'Unitel нэгж, дата авах, төлбөр төлөх эрх' : product.name.includes('Univision') ? 'Univision төлбөр төлөхдөө ашиглах эрх' : 'Toki нэгж, дата авах, төлбөр төлөхдөө ашиглах эрх'}
                    </h3>
                    <div className="unitel-info">
                  
                  {/* <p className="valid-until">{product.name.includes('Unitel') ? 'Unitel-р нэгж, дата авах, төлбөр төлөхдөө ашиглах эрх' : product.name.includes('Univision') ? 'Univision-р төлбөр төлөхдөө ашиглах эрх' : 'Toki-р нэгж, дата авах, төлбөр төлөхдөө ашиглах эрх'}</p> */}
                </div>
                </> : <>
                  <div className="product-price">
                    <span className="sale-price">{!product.name.includes('эрхийн бичиг') ? product.discountedPrice.toLocaleString() : product.actualPrice.toLocaleString()}₮</span>
                    {!product.name.includes('эрхийн бичиг') ? <span className="original-price">{product.actualPrice.toLocaleString()}₮</span> : <></>}
                  </div>
                  <h3 className="product-name">{product.name}</h3>
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
                  <a href="https://staging-links.toki.mn/NXwc" target='_blank'><button className="modal-pay">Гар утасны дэлгүүр</button></a>
                  {/* <a href="https://link.toki.mn/ykqv" target='_blank'><button className="modal-pay">Гар утасны дэлгүүр</button></a> */}
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
              ) : isLegit == 'won' ? (
                <>
                  <h2>🎉Баяр хүргэе!</h2>
                  <p>Та маш хурдтай байж Flash Deal-с <p style={{color: '#46C800', fontSize: '18px', fontWeight: 'bold'}}>{wonProduct}</p> ялагч боллоо. Та төлбөр төлөлтөө бүрэн хийж худалдан авалтаа баталгаажуулаарай. 😉</p>
                  <div className="modal-buttons">
                  <a href={legitObj.deeplink}><button className="modal-pay">Төлбөр төлөх</button></a>
                  <button className="modal-close" onClick={handleCloseModal}>
                    Хаах
                  </button>
                </div>
                </>
              )  : isLegit == 'paid' ? (
                <>
                  <h2>🎉Баяр хүргэе!</h2>
                  <p>
                  Та Flash Deal-с <p style={{color: '#46C800', fontSize: '18px', fontWeight: 'bold'}}>{wonProduct}</p> амжилттай худалдан авсан байна. Худалдан авсан бүтээгдэхүүнээ Юнителийн Сэнтрал Tayэр салбарт өөрийн биеэр, бичиг баримттайгаа хандан аваарай. 🤗 
                  Салбарын хаяг, цагийн хуваарь: <a href="https://www.unitel.mn/unitel/branch" style={{fontSize: '18px', fontWeight: 'bold'}}>www.unitel.mn/unitel/branch</a> 
                  </p>
                  <div className="modal-buttons">
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