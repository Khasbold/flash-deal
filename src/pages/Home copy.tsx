import React, { useEffect } from 'react'
import { useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { IoMdClose } from "react-icons/io";
import './Home.css'

interface Product {
  productId: string;
  name: string;
  quantity: number;
  discountedPrice: number;
  actualPrice: number;

}

const Home = () => {
  const urlParams = new URLSearchParams(window.location.search);
    const urltokenId = urlParams.get('tokenid');

  const [selectedDate, setSelectedDate] = useState({id: 1, date: '05.09', time: '13:00', unix: 1746597600})
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const [showModal, setShowModal] = useState(false)
  const [isLegit, setIsLegit] = useState('')
  const [legitObj, setLegitObj] = useState()
  const [wonProduct, setWonProduct] = useState('')
  const [tokenId, setTokenId] = useState(urltokenId); // ok
  const [productList, setProductList] = useState([])
  const [isStarted, setIsStarted] = useState(false);
  const [isSelectedDateActive, setIsSelectedDateActive] = useState(false);
  const [ui, setUi] = useState(false);
  const [loop, setLoop] = useState(false);
  const [stockObj, setStockObj] = useState();
  const [meNow, setMeNow] = useState<number>();
  const [systemDiff, setSystemDiff] = useState<number>();
  const [jumpLink, setJumpLink] = useState('');
  const [diff, setDiff] = useState<number>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const dates = [{id : 1, date: '05.09', time: '13:00', unix: 1746766800 }, {id : 2, date: '05.16', time: '13:00', unix: 1747371600 }, {id : 3, date: '05.23', time: '13:00', unix: 1747976400 }, {id : 4, date: '05.30', time: '13:00', unix: 1748581200 }, {id : 5, date: '06.06', time: '13:00', unix: 1749186000 }];
  const checkUser = async (val?) => {
    fetch(`https://campaign.unitel.mn/toki/flash-deal/v2/check/user?tokenId=${tokenId}`, {
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
        if (data.status == 'won' && !val) {
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const getProducts = async () => {
    const now = new Date().getTime();
    fetch(`https://campaign.unitel.mn/toki/flash-deal/v2/week/stock?week=${selectedDate.id}&time=${now}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        // ЭХЭЛСЭН БОЛГОВ
        setStockObj(data);
        setSystemDiff(data.dealStartDate - data.timestamp);
        setDiff(data.dif);
        setIsSelectedDateActive(data.availableGifts[0].some(item => item.quantity > 0));
        // setIsSelectedDateActive(data.timestamp < data.dealStartDate && data.isDealActive);
        // setSelectedDate({id : selectedDate.id, date: '05.09', time: '13:00', unix: data.dealStartDate})
        if (isStarted) {
          const available = data.availableGifts[0].some(item => item.quantity > 0);
          console.log('available', available);
          setIsSelectedDateActive(available);
          setIsStarted(available)
        }
        setProductList(data.availableGifts[0]);
      });
  };
  console.log('isStarted: ', isStarted);
  useEffect(() => {
    console.log('DDDDDDDDDDDDDDDDDDDDDDd')
    setMeNow(Date.now());
    checkUser();
  }, []);

  useEffect(() => {
    if (!stockObj?.dealStartDate || !stockObj?.timestamp || !systemDiff) return;

    // Calculate initial server time
    const initialServerTime = stockObj.timestamp;
    const initialLocalTime = Date.now();
    const timeOffset = initialServerTime - initialLocalTime;

    const timer = setInterval(() => {
      // Calculate current server time based on local time + offset
      const currentLocalTime = Date.now();
      const currentServerTime = currentLocalTime + timeOffset;
      const remaining = stockObj.dealStartDate - currentServerTime;

      if (isSelectedDateActive) {
        console.log('AAAAAAAAAAA remaining', remaining)
        if (remaining <= 1000) {
          setIsStarted(true);
          getProducts();
        }
        if (remaining <= 0) {
          setUi(true);
          setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        } else {
          const days = Math.floor(remaining / (24 * 60 * 60 * 1000)).toString().padStart(2, '0');
          const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)).toString().padStart(2, '0');
          const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000)).toString().padStart(2, '0');
          const seconds = Math.floor((remaining % (60 * 1000)) / 1000).toString().padStart(2, '0');
          setTimeLeft({ days, hours, minutes, seconds });
        }
      } else {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [stockObj, systemDiff, isSelectedDateActive]);

  // Add visibility change handler to sync time when app becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        getProducts(); // Refresh server time when app becomes visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Get current active date for conditional rendering
  const now = Math.floor(new Date().getTime() / 1000);
  const currentActiveDate = dates.find(date => date.unix > now);
  useEffect(() => {
    getProducts();
  }, [selectedDate]);

  function WithCustomProgressBar({
    closeToast,
    data,
  }: { message: string }) {
    setTimeout(() => {
      closeToast();
    }, 2000);
    return (
      <div className="flex justify-between items-center w-full">
        <p style={{textAlign: 'left'}}>{data.message}</p>
        <IoMdClose size={30} />
      </div>
    );
  }
  const handleProductClick = (product: Product) => {
    console.log('product: ', product);
      setSelectedProduct(product)
      if (product.quantity == 0) {
        toast(WithCustomProgressBar, {
          autoClose: 8000,
          customProgressBar: true,
          closeButton: false,
          data: {
            message: 'Уг бүтээгдэхүүн дууссан байна',
          },
        });
      } else if (product.quantity != 0 && isLegit == 'ok') {
        toast(WithCustomProgressBar, {
          autoClose: 8000,
          customProgressBar: true,
          closeButton: false,
          data: {
            message: 'Танд Flash Deal-д оролцох эрх үүсээгүй байна. Toki-с гар утас худалдан аваад Flash Deal-д оролцоорой. 😉',
          },
        });
      } else if (product.quantity != 0 && isLegit == 'ready' && !isStarted) {
        toast(WithCustomProgressBar, {
          autoClose: 8000,
          customProgressBar: true,
          closeButton: false,
          data: {
            message: 'Хугацаа эхлээгүй байна',
          },
        });
      } else if (isLegit == 'employee') {
        toast(WithCustomProgressBar, {
          autoClose: 8000,
          customProgressBar: true,
          closeButton: false,
          data: {
            message: 'Уучлаарай, Энэ удаагийн урамшуулалт нөхцөлд Юнител группийн ажилтнууд хамрагдах боломжгүй байна. 😔',
          },
        });
      } else if (product.quantity != 0 && isLegit == 'won' || isLegit == 'paid') {
        toast(WithCustomProgressBar, {
          autoClose: 8000,
          customProgressBar: true,
          closeButton: false,
          data: {
            message: 'Хэрэглэгч та Flash Deal-с зөвхөн 1 удаа худалдан авалт хийх боломжтойг анхаарна уу.',
          },
        });
      } else if (product.quantity != 0 && isStarted && (isLegit == 'ready' || isLegit == 'ok' || isLegit == 'not ok' || isLegit == 'employee')) {
        console.log('TRY buy');
        fetch(`https://campaign.unitel.mn/toki/flash-deal/v2/trybuy13`, {
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
                      getProducts();
                      if (data.error) {
                        console.log('ERROR: ', data.error);
                      } else {
                        setJumpLink(data.deeplink);
                        checkUser();
                      }
          });
      } else {
        console.log('ELSE')
      }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
    checkUser('nope');
    // getProducts();
  }
  const changetokenId = (tokenId: string) => {
    setTokenId(tokenId);
    checkUser();
  }

  return (
    <div className="home-container">
      <ToastContainer
        style={{ marginTop: '40px', padding: '16px'}}
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
          <img src={`${import.meta.env.VITE_BASE_PATH}image/flashdeal.png`} alt="Flashdeal" className="logo-image" />
        </div>
      </div>
      {/* <div style={{color: 'white'}}>Current User Status : {isLegit}</div> */}
      {/* <div style={{ margin: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
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
      </div> */}

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
          <p>🎉 Баяр хүргэе! Та Flash Deal-с <p style={{color: '#46C800', fontSize: '18px', fontWeight: 'bold'}}>{wonProduct}</p> амжилттай худалдан авлаа. Худалдан авсан бүтээгдэхүүнээ Юнителийн "Сэнтрал Тауэр" салбарт өөрийн биеэр, бичиг баримттайгаа хандан аваарай. 😉</p>
        </div>
        {/* <a href={legitObj.deeplink}><button className="notification-button">Төлбөр төлөх</button></a> */}
      </div>
      )}
      {/* {isLegit == 'paid' && (
        <div className="notification-banner">
          <div className="notification-content">
          <p>Та Flash Deal-с <p style={{color: '#46C800', fontSize: '18px', fontWeight: 'bold'}}>{wonProduct}</p> амжилттай худалдан авсан байна. Таны худалдан авсан эрх Toki хэтэвч хэсэгт нь идэвхэжсэн байгаа шүү. 🤗</p>
        </div>
        <a href="https://staging-links.toki.mn/7Ren" target='_blank'><button className="notification-button">Хэтэвч шалгах</button></a>
      </div>
      )} */}
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
        <a href="https://link.toki.mn/3p7e"><button className="notification-button">Гар утас авах</button></a>
       
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
          {isSelectedDateActive && !ui ? (
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
          ) : ui ? (
            <div className="timer-display">
              <div className="timer-block">
                  <span className="timer-number">А</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">М</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">Ж</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">И</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">Л</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">Т</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number"></span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">Х</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">Ү</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">С</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">Ь</span>
                </div>
                <div className="timer-block">
                  <span className="timer-number">Е</span>
                </div>
               
                
              </div>
          ) : (
            <>
            <p className="timer-info" style={{marginTop: '8px'}}>Flash Deal эхлэх хугацаа</p>
            <p className="timer-info-1">2025.{selectedDate.date} • {selectedDate.time}</p>
            </>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
      <div className="products-grid">
        {productList.map((product: Product) => (
          <div key={product.productId} className="product-card">
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
                  <span className="sale-price">{product.discountedPrice.toLocaleString().replace(/,/g, "'")}₮</span>
                    <span className="original-price">{product.actualPrice.toLocaleString().replace(/,/g, "'")}₮</span>
                  </div>
                    <h3 className="product-name">
                    {product.name.includes('Unitel') ? 'Юнителийн нэгж, дата авах, төлбөр төлөх эрх' : product.name.includes('Univision') ? 'Юнивишнийн төлбөр төлөх, кино түрээслэх эрх' : 'Toki нэгж, дата авах, төлбөр төлөхдөө ашиглах эрх'}
                    </h3>
                    <div className="unitel-info">
                  
                  {/* <p className="valid-until">{product.name.includes('Unitel') ? 'Unitel-р нэгж, дата авах, төлбөр төлөхдөө ашиглах эрх' : product.name.includes('Univision') ? 'Univision-р төлбөр төлөхдөө ашиглах эрх' : 'Toki-р нэгж, дата авах, төлбөр төлөхдөө ашиглах эрх'}</p> */}
                </div>
                </> : <>
                  <div className="product-price">
                    <span className="sale-price">{!product.name.includes('эрхийн бичиг') ? product.discountedPrice.toLocaleString().replace(/,/g, "'") : product.actualPrice.toLocaleString().replace(/,/g, "'")}₮</span>
                    {!product.name.includes('эрхийн бичиг') ? <span className="original-price">{product.actualPrice.toLocaleString().replace(/,/g, "'")}₮</span> : <></>}
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
                  <a href="https://link.toki.mn/3p7e" target='_blank'><button className="modal-pay">Гар утасны дэлгүүр</button></a>
                    <button className="modal-close" onClick={handleCloseModal}>
                      Буцах
                    </button>
                  </div>
                </>
              ) 
              // : isLegit == 'employee' ? (
              //   <>
              //     <h2>Уучлаарай</h2>
              //     <p>Энэ удаагийн урамшуулалт нөхцөлд Юнител группийн ажилтнууд хамрагдах боломжгүй байна. 😔</p>
              //     <div className="modal-buttons">
              //       <button className="modal-close" onClick={handleCloseModal}>
              //         Буцах
              //       </button>
              //     </div>
              //   </>
              // )
               : isLegit == 'won' ? (
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
                  Та Flash Deal-с <p style={{color: '#46C800', fontSize: '18px', fontWeight: 'bold'}}>{wonProduct}</p> амжилттай худалдан авсан байна. Худалдан авсан бүтээгдэхүүнээ Юнителийн "Сэнтрал Тауэр" салбарт өөрийн биеэр, бичиг баримттайгаа хандан аваарай. 🤗 
                  Салбарын хаяг, цагийн хуваарь: <a href="https://www.unitel.mn/unitel/branch" style={{fontSize: '18px', fontWeight: 'bold'}}>www.unitel.mn/unitel/branch</a> 
                  </p>
                  {/* <p>
                  Та Flash Deal-с <p style={{color: '#46C800', fontSize: '18px', fontWeight: 'bold'}}>{wonProduct}</p> амжилттай худалдан авсан байна. Худалдан авсан бүтээгдэхүүнээ Юнителийн Сэнтрал Tayэр салбарт өөрийн биеэр, бичиг баримттайгаа хандан аваарай. 🤗 
                  Салбарын хаяг, цагийн хуваарь: <a href="https://www.unitel.mn/unitel/branch" style={{fontSize: '18px', fontWeight: 'bold'}}>www.unitel.mn/unitel/branch</a> 
                  </p> */}
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