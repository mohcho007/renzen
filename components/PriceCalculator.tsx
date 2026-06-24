'use client';

import React, { useState, useEffect, useRef } from 'react';
import { listPriceKr } from '@/data/pricing';
import Image from 'next/image';
import './PriceCalculator.css';

interface PriceCalculatorProps {
  initialSqm?: number;
  title?: string;
  showIntroText?: boolean;
  serviceSlug?: 'rengoring' | 'privat-rengoring' | 'flytterengoring' | 'airbnb-rengoring' | string;
}

export default function PriceCalculator({
  initialSqm = 70,
  serviceSlug = 'privat-rengoring'
}: PriceCalculatorProps) {
  // Base states
  const [sqm, setSqm] = useState(initialSqm);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSqm, setTempSqm] = useState(initialSqm.toString());
  
  // Normal cleaning states
  const [frequencyIndex, setFrequencyIndex] = useState(2); // Default: Hver 2. uge (index 2)
  
  // Flytterengøring states
  const [stand, setStand] = useState(2); // 1 = clean, 2 = normal, 3 = dirty
  const [standDropdownOpen, setStandDropdownOpen] = useState(false);
  
  // Airbnb states
  const [airbnbSize, setAirbnbSize] = useState(70); // 70, 100, 130, 160
  
  const editInputRef = useRef<HTMLInputElement>(null);

  // Sync temp value when sqm changes
  useEffect(() => {
    setTempSqm(sqm.toString());
  }, [sqm]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  // Handle manual input confirmation
  const handleConfirmEdit = () => {
    let parsed = parseInt(tempSqm, 10);
    if (isNaN(parsed) || parsed < 0) {
      parsed = 0;
    } else if (parsed > 299) {
      parsed = 299;
    }
    setSqm(parsed);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirmEdit();
    } else if (e.key === 'Escape') {
      setTempSqm(sqm.toString());
      setIsEditing(false);
    }
  };

  // Frequencies array matching WP config
  const frequencyMap = [
    { id: 1,  mult: 1,    label: 'Engangsydelse',  discountLabel: '0% rabat', slug: 'once' },
    { id: 17, mult: 0.8,  label: 'Hver uge',       discountLabel: '20% rabat', slug: 'weekly' },
    { id: 22, mult: 0.85, label: 'Hver 2. uge',    discountLabel: '15% rabat', slug: 'biweekly', popular: true },
    { id: 19, mult: 0.95, label: 'Hver 4. uge',    discountLabel: '5% rabat', slug: 'fourweekly' }
  ];

  // Pricing calculations
  let totalPrice = 0;
  let finalCostAfterFradrag = 0;
  let bookUrl = '';

  if (serviceSlug === 'flytterengoring') {
    // Flytterengøring pricing: flat m2 rate based on stand
    // Stand 1: 30 kr/m2, Stand 2: 40 kr/m2, Stand 3: 50 kr/m2
    const rate = stand === 1 ? 30 : stand === 2 ? 40 : 50;
    totalPrice = sqm * rate;
    finalCostAfterFradrag = Math.round(totalPrice * 0.74);
    
    // Redirect URL for Flytterengøring
    bookUrl = `/flytterengoring/book/?sqm=${sqm}&stand=${stand}`;
  } else if (serviceSlug === 'airbnb-rengoring') {
    // Airbnb sizes: standard formula once (no discount) for fixed sizes
    // Uses the standard formula: basePrice + pricePerSqm per m².
    totalPrice = listPriceKr(airbnbSize);
    finalCostAfterFradrag = Math.round(totalPrice * 0.74);
    
    // Redirect URL for Airbnb
    bookUrl = `/airbnb-rengoring/forespoergsel/?m2=${airbnbSize}`;
  } else {
    // Standard and Privat cleaning
    const basePrice = listPriceKr(sqm);
    totalPrice = Math.round(basePrice * frequencyMap[frequencyIndex].mult);
    finalCostAfterFradrag = Math.round(totalPrice * 0.74);
    
    // Redirect URL for regular cleaning matching WP format exactly
    bookUrl = `/book-rengoering/?m2=${sqm}`;
  }

  // Stand details helper descriptions
  const standDescriptions = [
    {
      id: 1,
      title: '1 - Boligen er ren og nyligt rengjort',
      desc: 'Boligen er pæn og har minimalt snavs. Der er ikke noget synligt snavs, og de fleste områder skal blot støvsuges og tørres af med en klud. Kalk og ovn behøver kun en hurtig overfladisk rengøring.'
    },
    {
      id: 2,
      title: '2 - Boligen er pæn og velholdt',
      desc: 'Boligen er pæn og velholdt. Der er ikke noget synligt snavs, og de fleste områder skal blot støvsuges og tørres af med en klud. Kalkskab og ovn er næsten helt rene og behøver kun en hurtig aftørring. Badeværelset er uden kalk og kræver minimal indsats.'
    },
    {
      id: 3,
      title: '3 - Boligen er beskidt / trænger til bund',
      desc: 'Boligen bærer præg af længere tids manglende rengøring. Der er omfattende kalkaflejringer i badeværelset, fedt og fastbrændt snavs i køkkenet/ovnen, og generelt behov for en kraftig grovrengøring i bund.'
    }
  ];

  const activeStandDesc = standDescriptions.find(s => s.id === stand)?.desc || '';

  // Return standard star rating rows
  const renderStars = () => (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 32 31">
          <g fillRule="nonzero" fill="none">
            <path d="m11 9.76-8.82 1.27-.15.03a1.38 1.38 0 0 0-.61 2.33l6.38 6.22-1.5 8.77-.02.16a1.38 1.38 0 0 0 2.02 1.3l7.88-4.14 7.87 4.14.14.06a1.38 1.38 0 0 0 1.86-1.52l-1.5-8.77 6.39-6.22.1-.12a1.38 1.38 0 0 0-.87-2.24l-8.81-1.27-3.94-7.99a1.38 1.38 0 0 0-2.48 0L11 9.76Z" stroke="#000" fill="#E8F5D3"></path>
            <path d="m21.2 10.35 1.23 6.52A.22.22 0 1 1 22 17l-1.23-6.5a.2.2 0 0 1 .17-.27c.1-.02.2.03.25.12ZM15.88 23.79l-3.58.45a.2.2 0 0 1-.24-.2.22.22 0 0 1 .2-.24l3.55-.46c.13-.01.24.07.26.2a.22.22 0 0 1-.2.25Z" fill="#000"></path>
          </g>
        </svg>
      ))}
    </div>
  );

  // Layout 1: Airbnb cleaning
  if (serviceSlug === 'airbnb-rengoring') {
    return (
      <div className="my-calc-wrapper scroll-mt-24">
        <div className="calc-widget">
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-100">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-xs font-bold text-[#206d69] mb-2">
              Klargøring mellem gæster
            </span>
            <h3 className="text-xl font-bold tracking-tight text-slate-800">Klargøring af feriebolig</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-sm mx-auto">
              Vælg din boligs størrelse for at se prisen. Klargøring mellem gæster udføres professionelt, så boligen står klar.
            </p>
            
            {/* Rating badge */}
            <div className="mt-3 flex items-center justify-center space-x-2">
              {renderStars()}
              <span className="text-[11px] text-slate-500 font-semibold">
                4.8 rating • Verificerede Zenmestre
              </span>
            </div>
          </div>

          {/* Size Selection Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { size: 70, label: 'Op til 70 m²', rooms: '1-2 værelser', price: listPriceKr(70) },
              { size: 100, label: 'Op til 100 m²', rooms: '3-4 værelser', price: listPriceKr(100), popular: true },
              { size: 130, label: 'Op til 130 m²', rooms: '4-5 værelser', price: listPriceKr(130) },
              { size: 160, label: 'Op til 160 m²', rooms: 'Større feriebolig', price: listPriceKr(160) }
            ].map((item) => {
              const isSelected = airbnbSize === item.size;
              return (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => setAirbnbSize(item.size)}
                  className={`relative rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-[#206d69] bg-[#206d69]/5 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {item.popular && (
                    <span className="absolute -top-2 right-2 rounded-full bg-amber-400 px-2 py-0.5 text-[8px] font-extrabold uppercase text-slate-900">
                      Mest populær
                    </span>
                  )}
                  <span className={`block text-xs font-bold ${isSelected ? 'text-[#206d69]' : 'text-slate-800'}`}>
                    {item.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{item.rooms}</span>
                  <span className="block text-sm font-extrabold text-slate-800 mt-2">{item.price} kr.</span>
                </button>
              );
            })}
          </div>

          {/* What's included block */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-600 border border-slate-100">
            <p className="font-bold text-slate-800 mb-2">Standard klargøring inkluderer:</p>
            <ul className="space-y-1 pl-4 list-disc">
              <li>Nulstilling af badeværelse, køkken, stue og værelser</li>
              <li>Linnedskift & håndklædeopsætning (hvis rent haves i boligen)</li>
              <li>Tømning af opvaskemaskine & skraldespande</li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="mt-6">
            <button
              onClick={() => window.location.href = bookUrl}
              className="calc-book-btn flex items-center justify-center"
            >
              Book klargøring til
              <span className="price-in-button">{totalPrice} kr.</span>
            </button>
          </div>

          {/* Servicefradrag Display */}
          <div className="calc-servicefradrag" style={{ marginTop: '18px' }}>
            <div style={{ fontSize: '17px', color: '#206d69' }}>
              Pris efter servicefradrag (26%):{' '}
              <strong id="calc-price-after-tax" style={{ fontSize: '21px' }}>
                {finalCostAfterFradrag} kr.
              </strong>
            </div>
            <div style={{ fontSize: '13px', color: '#333333', marginTop: '4px' }}>
              Du kan trække 26% af prisen fra i skat via servicefradraget.<br />
              <a
                href="https://skat.dk/borger/fradrag/servicefradrag/servicefradrag"
                target="_blank"
                style={{ color: '#333333', textDecoration: 'underline' }}
                rel="nofollow noopener"
              >
                Læs mere hos Skattestyrelsen
              </a>
            </div>
          </div>

          {/* Trust rating row */}
          <div className="star-rating-row">
            <Image
              src="/kunde-ansigter.png"
              alt="Tilfredse kunder"
              width={90}
              height={30}
              className="review-faces"
            />
            {renderStars()}
            <span className="reviewtext">Vurderet til 4.8 ud af 5</span>
          </div>
        </div>
      </div>
    );
  }

  // Layout 2: Flytterengøring
  if (serviceSlug === 'flytterengoring') {
    return (
      <div className="my-calc-wrapper scroll-mt-24">
        <div className="calc-widget">
          {/* Desktop size input */}
          <div className="calc-slider-row-desktop">
            <div className="calc-slider-label-desktop">Kvadratmeter:</div>
            <div className="slider-holder-desktop">
              <input
                type="range"
                min="20"
                max="250"
                step="1"
                value={sqm}
                onChange={(e) => setSqm(Number(e.target.value))}
                className="calc-slider-desktop"
              />
            </div>
            <div className="calc-slider-value-desktop">
              {isEditing ? (
                <input
                  ref={editInputRef}
                  type="number"
                  value={tempSqm}
                  onChange={(e) => setTempSqm(e.target.value)}
                  onBlur={handleConfirmEdit}
                  onKeyDown={handleKeyDown}
                  className="calc-sqm-edit-input"
                  style={{ width: '80px' }}
                />
              ) : (
                <span
                  onClick={() => setIsEditing(true)}
                  style={{ cursor: 'pointer' }}
                >
                  {sqm}
                </span>
              )}{' '}
              m²
            </div>
          </div>

          {/* Mobile size input */}
          <div className="calc-slider-row-mobile">
            <div className="calc-slider-label-value-wrapper-mobile">
              <div className="calc-slider-label-mobile">Kvadratmeter:</div>
              <div className="calc-slider-value-mobile">
                {isEditing ? (
                  <input
                    ref={editInputRef}
                    type="number"
                    value={tempSqm}
                    onChange={(e) => setTempSqm(e.target.value)}
                    onBlur={handleConfirmEdit}
                    onKeyDown={handleKeyDown}
                    className="calc-sqm-edit-input"
                    style={{ width: '60px' }}
                  />
                ) : (
                  <span
                    onClick={() => setIsEditing(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    {sqm}
                  </span>
                )}{' '}
                m²
              </div>
            </div>
            <div className="slider-holder-mobile">
              <input
                type="range"
                min="20"
                max="250"
                step="1"
                value={sqm}
                onChange={(e) => setSqm(Number(e.target.value))}
                className="calc-slider-mobile"
              />
            </div>
          </div>

          {/* Boligens stand selector */}
          <div className="mt-4 mb-6">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Vælg boligens stand:
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setStandDropdownOpen(!standDropdownOpen)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left font-semibold text-slate-700 flex justify-between items-center hover:bg-slate-50 focus:outline-none"
              >
                <span>{standDescriptions.find(s => s.id === stand)?.title}</span>
                <svg className={`h-4 w-4 transform transition-transform ${standDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {standDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-1 rounded-lg border border-slate-100 bg-white p-2 shadow-xl">
                  {standDescriptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setStand(item.id);
                        setStandDropdownOpen(false);
                      }}
                      className={`w-full rounded-lg p-2.5 text-left text-xs transition-colors block ${
                        stand === item.id ? 'bg-[#206d69]/10 text-[#206d69] font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Helper description block */}
            <div className="mt-3 rounded-lg bg-emerald-50/40 p-3 border border-emerald-500/5 text-xs text-slate-600 leading-relaxed">
              {activeStandDesc}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6">
            <button
              onClick={() => window.location.href = bookUrl}
              className="calc-book-btn flex items-center justify-center"
            >
              Se din pris og book flytterengøring
              <span className="price-in-button">{totalPrice} kr.</span>
            </button>
          </div>

          {/* Servicefradrag Display */}
          <div className="calc-servicefradrag" style={{ marginTop: '18px' }}>
            <div style={{ fontSize: '17px', color: '#206d69' }}>
              Pris efter servicefradrag (26%):{' '}
              <strong id="calc-price-after-tax" style={{ fontSize: '21px' }}>
                {finalCostAfterFradrag} kr.
              </strong>
            </div>
            <div style={{ fontSize: '13px', color: '#333333', marginTop: '4px' }}>
              Du kan trække 26% af prisen fra i skat via servicefradraget.<br />
              <a
                href="https://skat.dk/borger/fradrag/servicefradrag/servicefradrag"
                target="_blank"
                style={{ color: '#333333', textDecoration: 'underline' }}
                rel="nofollow noopener"
              >
                Læs mere hos Skattestyrelsen
              </a>
            </div>
          </div>

          {/* Trust rating row */}
          <div className="star-rating-row">
            <Image
              src="/kunde-ansigter.png"
              alt="Tilfredse kunder"
              width={90}
              height={30}
              className="review-faces"
            />
            {renderStars()}
            <span className="reviewtext">Vurderet til 4.8 ud af 5</span>
          </div>
        </div>
      </div>
    );
  }

  // Layout 3: Standard and Privat cleaning
  return (
    <div className="my-calc-wrapper scroll-mt-24">
      <div className="calc-widget">
        {/* Desktop Kvadratmeter Section */}
        <div className="calc-slider-row-desktop">
          <div className="calc-slider-label-desktop">Kvadratmeter:</div>
          <div className="slider-holder-desktop">
            <input
              type="range"
              min="0"
              max="299"
              step="1"
              value={sqm}
              onChange={(e) => setSqm(Number(e.target.value))}
              className="calc-slider-desktop"
            />
          </div>
          <div className="calc-slider-value-desktop">
            {isEditing ? (
              <input
                ref={editInputRef}
                type="number"
                value={tempSqm}
                onChange={(e) => setTempSqm(e.target.value)}
                onBlur={handleConfirmEdit}
                onKeyDown={handleKeyDown}
                className="calc-sqm-edit-input"
                style={{ width: '80px' }}
              />
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                style={{ cursor: 'pointer' }}
              >
                {sqm}
              </span>
            )}{' '}
            m²
          </div>
        </div>

        {/* Mobile Kvadratmeter Section */}
        <div className="calc-slider-row-mobile">
          <div className="calc-slider-label-value-wrapper-mobile">
            <div className="calc-slider-label-mobile">Kvadratmeter:</div>
            <div className="calc-slider-value-mobile">
              {isEditing ? (
                <input
                  ref={editInputRef}
                  type="number"
                  value={tempSqm}
                  onChange={(e) => setTempSqm(e.target.value)}
                  onBlur={handleConfirmEdit}
                  onKeyDown={handleKeyDown}
                  className="calc-sqm-edit-input"
                  style={{ width: '60px' }}
                />
              ) : (
                <span
                  onClick={() => setIsEditing(true)}
                  style={{ cursor: 'pointer' }}
                >
                  {sqm}
                </span>
              )}{' '}
              m²
            </div>
          </div>
          <div className="slider-holder-mobile">
            <input
              type="range"
              min="0"
              max="299"
              step="1"
              value={sqm}
              onChange={(e) => setSqm(Number(e.target.value))}
              className="calc-slider-mobile"
            />
          </div>
        </div>

        {/* Frequency selector grid/row */}
        <div className="calc-freq-section">
          <div className="calc-freq-row">
            {frequencyMap.map((item, idx) => {
              const isSelected = frequencyIndex === idx;
              return (
                <div key={item.id} className="calc-freq-item">
                  <button
                    type="button"
                    onClick={() => setFrequencyIndex(idx)}
                    className={`calc-freq-btn ${isSelected ? 'active' : ''}`}
                  >
                    {item.label}
                    {item.popular && (
                      <span className="most-popular">(Mest populær)</span>
                    )}
                  </button>
                  <div
                    className={`calc-discount-label ${isSelected ? 'active' : ''}`}
                  >
                    {item.discountLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => window.location.href = bookUrl}
          className="calc-book-btn flex items-center justify-center"
        >
          Se tider og book til
          <span className="price-in-button">{totalPrice} kr.</span>
        </button>

        {/* Servicefradrag Display */}
        <div className="calc-servicefradrag" style={{ marginTop: '18px' }}>
          <div style={{ fontSize: '17px', color: '#206d69' }}>
            Pris efter servicefradrag (26%):{' '}
            <strong id="calc-price-after-tax" style={{ fontSize: '21px' }}>
              {finalCostAfterFradrag} kr.
            </strong>
          </div>
          <div style={{ fontSize: '13px', color: '#333333', marginTop: '4px' }}>
            Du kan trække 26% af prisen fra i skat via servicefradraget.<br />
            <a
              href="https://skat.dk/borger/fradrag/servicefradrag/servicefradrag"
              target="_blank"
              style={{ color: '#333333', textDecoration: 'underline' }}
              rel="nofollow noopener"
            >
              Læs mere hos Skattestyrelsen
            </a>
          </div>
        </div>

        {/* Trust rating row */}
        <div className="star-rating-row">
          <Image
            src="/kunde-ansigter.png"
            alt="Tilfredse kunder"
            width={90}
            height={30}
            className="review-faces"
          />
          {renderStars()}
          <span className="reviewtext">Vurderet til 4.8 ud af 5</span>
        </div>
      </div>
    </div>
  );
}
