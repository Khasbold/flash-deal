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
            <FaBolt style={{ color: '#1A1A1A' }} />
          </div>
          <div className="feature-content">
            <h3 style={{ color: '#FFFFFF' }}>7 хоног бүр Flashdeal</h3>
            <p style={{ color: '#9CA3AF' }}>Төгс дансаар төлбөр төлөх бүрд автоматаар цуглана.</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon" style={{ backgroundColor: '#FFB800' }}>
            <FaGift style={{ color: '#1A1A1A' }} />
          </div>
          <div className="feature-content">
            <h3 style={{ color: '#FFFFFF' }}>Онцлох үйлчилгээ</h3>
            <p style={{ color: '#9CA3AF' }}>Сонгогдсон үйлчилгээнээс худалдан авалт хийн ихийг цуглуулах боломжтой.</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon" style={{ backgroundColor: '#FFB800' }}>
            <FaCalendar style={{ color: '#1A1A1A' }} />
          </div>
          <div className="feature-content">
            <h3 style={{ color: '#FFFFFF' }}>Улирал бүр Cashback</h3>
            <p style={{ color: '#9CA3AF' }}>Цуглуулсан Cashback улирал дуусах үед таны "Төгс данс"-руу орно.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer" style={{ color: '#9CA3AF' }}>
        2024 оноос дуустал үргэлжилнэ.
      </div>

      {/* CTA Button */}
      <button className="cta-button" style={{ backgroundColor: '#FFB800', color: '#1A1A1A' }}>
        Эхлэх
      </button>
    </div>
  )
}

export default LandingPage 