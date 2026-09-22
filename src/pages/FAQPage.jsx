import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { faqData } from '../data/faqData'
import './FAQPage.css'

const reclaimerFacts = [
  {
    id: 1,
    title: 'Who are waste reclaimers?',
    text: 'Waste reclaimers are informal workers who collect recyclable materials from bins and waste streams. In South Africa, they divert an estimated 25 million tonnes of recyclable material from landfills every year!',
  },
  {
    id: 2,
    title: 'How does sorting help reclaimers?',
    text: 'When waste is correctly sorted, reclaimers can collect recyclables more quickly and safely. Recycle bins that are contaminated with food waste and other items make their work slower, more dangerous, and less profitable.',
  },

]

function FAQPage({ onNavigate, points, scrollToReclaimers, onScrollHandled, onLogoClick }) {
  const [query, setQuery] = useState('')
  const reclaimerRef = useRef(null)

  useEffect(() => {
    if (scrollToReclaimers && reclaimerRef.current) {
      reclaimerRef.current.scrollIntoView({ behavior: 'smooth' })
      onScrollHandled()
    }
  }, [scrollToReclaimers])

  const filtered = query.trim() === ''
    ? faqData
    : faqData.filter((item) => {
        const q = query.toLowerCase()
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
        )
      })

  return (
    <div className="faq">

      <Header
        points={points}
        showBack={true}
        onBack={() => onNavigate('home')}
        onLogoClick={onLogoClick}
      />

      <div className="faq__content">

        <div>
          <h2 className="faq__title">Waste Guide</h2>
          <p className="faq__subtitle">
            Search for any item to find out which bin to use.
          </p>
        </div>

        
        

        <div className="faq__search-wrap">
          <input
            type="text"
            className="faq__search"
            placeholder="search an item"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        
        
        
        {filtered.length === 0 ? (
          <div className="faq__empty">
            No items found for "{query}". Try a different search term.
          </div>
        ) : (
          <>
            <p className="faq__section-title">
              {query.trim() === '' ? 'All items' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
            </p>
            {filtered.map((item) => (
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
          </>
        )}

        
        {query.trim() === '' && (
          <>
            <p
              className="faq__section-title"
              ref={reclaimerRef}
            >
              About waste reclaimers
            </p>
            {reclaimerFacts.map((fact) => (
              <div key={fact.id} className="faq__reclaimer-card">
                <p className="faq__reclaimer-card-title">{fact.title}</p>
                <p className="faq__reclaimer-card-text">{fact.text}</p>
              </div>
            ))}
          </>
        )}

      </div>

      <BottomNav currentPage="faq" onNavigate={onNavigate} />

    </div>
  )
}

export default FAQPage