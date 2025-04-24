import { FaCalendar, FaGift, FaBolt } from 'react-icons/fa'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div className="container">
      {/* Background Images */}
      <img src="/image/splash-left.png" alt="" className="splash-left" />
      <img src="/image/splash-right.png" alt="" className="splash-right" />
      <img src="/image/tail-left.png" alt="" className="tail-left" />
      <img src="/image/tail-right.png" alt="" className="tail-right" />

      {/* Flash Deal Logo */}
      <div className="logo-container">
        <div className="logo">
          <img src="/image/flashdeal.png" alt="Flashdeal" className="logo-image" />
        </div>
      </div>

      {/* Features List */}
      <div className="features">
        <div className="feature">
          <div className="feature-icon" style={{ backgroundColor: '#FFB800' }}>
            <FaBolt style={{ color: '#0F1F29' }} />
          </div>
          <div className="feature-content">
            <h3 style={{ color: '#FFFFFF' }}>7 хоног бүр Flashdeal</h3>
            <p style={{ color: '#9CA3AF' }}>2025,05.09-2025.06.06-г дуустал 7 хоног бүрийн Баасан гарагт</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon" style={{ backgroundColor: '#FFB800' }}>
            <FaGift style={{ color: '#0F1F29' }} />
          </div>
          <div className="feature-content">
            <h3 style={{ color: '#FFFFFF' }}>1 утас аваад 5 Flash Deal-д оролц</h3>
            <p style={{ color: '#9CA3AF' }}>Сонгогдсон үйлчилгээнээс худалдан авалт хийн ихийг цуглуулах боломжтой.</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon" style={{ backgroundColor: '#FFB800' }}>
            <FaCalendar style={{ color: '#0F1F29' }} />
          </div>
          <div className="feature-content">
            <h3 style={{ color: '#FFFFFF' }}>98% -ийн хямдрал</h3>
            <p style={{ color: '#9CA3AF' }}>Apple, Samsung, Huawei brand-н шилдэг загварууд, хэрэгцээт үйлчилгээний 100k-1сая төгрөг хүртэлх эрхийн бичгүүдийг 98%-н хямдралтай үнээр аваарай.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer" style={{ color: '#9CA3AF' }}>
        2024 оноос дуустал үргэлжилнэ.
      </div>

      {/* CTA Button */}
      <button className="cta-button" style={{ backgroundColor: '#FFB800', color: '#0F1F29' }}>
        Эхлэх
      </button>
    </div>
  )
}

export default LandingPage 