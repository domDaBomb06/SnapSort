import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { faqData } from '../data/faqData'
import './FAQPage.css'

function FAQPage({ onNavigate, points }) {
  return (
    <div className="faq">

      <Header points={points} showBack={false} />

      <div className="faq__content">

        <div>
          <h2 className="faq__title">Waste Guide</h2>
          <p className="faq__subtitle">
            Common campus items and which bin they belong in.
          </p>
        </div>

        {faqData.map((item) => (
          <div key={item.id} className="faq__item">

            <div className="faq__item-header">
              <p className="faq__item-name">{item.name}</p>
              <span
                className="faq__item-chip"
                style={{ backgroundColor: item.binColour }}
              >
                {item.binLabel}
              </span>
            </div>

            <p className="faq__item-instruction">{item.instruction}</p>

          </div>
        ))}

      </div>

      <BottomNav currentPage="faq" onNavigate={onNavigate} />

    </div>
  )
}

export default FAQPage