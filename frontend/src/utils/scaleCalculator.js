/**
 * Kirana Scale Calculator Utility (कांटा कैलकुलेटर)
 * Helps aged shopkeepers and customers instantly calculate exact grams on digital scale
 * when customers ask for items in round rupee amounts like ₹10, ₹15, ₹20, etc.
 */

export function getPricePerGram(priceOptions) {
  if (!priceOptions || priceOptions.length === 0) return null;

  // 1. Try to find an option with explicit quantity_value in grams
  for (const opt of priceOptions) {
    const val = parseFloat(opt.quantity_value);
    const unit = (opt.quantity_unit || '').toLowerCase();
    const price = parseFloat(opt.price);
    if (!isNaN(val) && val > 0 && !isNaN(price) && price > 0) {
      if (unit === 'g' || unit === 'gm' || unit === 'gram' || unit === 'grams') {
        return {
          pricePerGram: price / val,
          basePrice: price,
          baseGrams: val,
          baseLabel: opt.unit_label,
        };
      }
      if (unit === 'kg' || unit === 'kilo') {
        return {
          pricePerGram: price / (val * 1000),
          basePrice: price,
          baseGrams: val * 1000,
          baseLabel: opt.unit_label,
        };
      }
    }
  }

  // 2. Parse from unit_label string if quantity_value is missing
  for (const opt of priceOptions) {
    const label = (opt.unit_label || '').toLowerCase();
    const price = parseFloat(opt.price);
    if (isNaN(price) || price <= 0) continue;

    if (label.includes('1 kg') || label.includes('1 किलो') || label.includes('1000 g') || label.includes('1000g')) {
      return { pricePerGram: price / 1000, basePrice: price, baseGrams: 1000, baseLabel: opt.unit_label };
    }
    if (label.includes('500 g') || label.includes('500g') || label.includes('आधा किलो')) {
      return { pricePerGram: price / 500, basePrice: price, baseGrams: 500, baseLabel: opt.unit_label };
    }
    if (label.includes('250 g') || label.includes('250g') || label.includes('1 pav') || label.includes('1 पाव')) {
      return { pricePerGram: price / 250, basePrice: price, baseGrams: 250, baseLabel: opt.unit_label };
    }
    if (label.includes('100 g') || label.includes('100g')) {
      return { pricePerGram: price / 100, basePrice: price, baseGrams: 100, baseLabel: opt.unit_label };
    }
    if (label.includes('50 g') || label.includes('50g')) {
      return { pricePerGram: price / 50, basePrice: price, baseGrams: 50, baseLabel: opt.unit_label };
    }
    if (label.includes('20 g') || label.includes('20g')) {
      return { pricePerGram: price / 20, basePrice: price, baseGrams: 20, baseLabel: opt.unit_label };
    }
    if (label.includes('10 g') || label.includes('10g')) {
      return { pricePerGram: price / 10, basePrice: price, baseGrams: 10, baseLabel: opt.unit_label };
    }
  }

  // 3. Fallback: assume default option price is for 1000g (1kg)
  const defaultOpt = priceOptions.find((o) => o.is_default) || priceOptions[0];
  const p = parseFloat(defaultOpt.price);
  if (!isNaN(p) && p > 0) {
    return { pricePerGram: p / 1000, basePrice: p, baseGrams: 1000, baseLabel: defaultOpt.unit_label };
  }

  return null;
}

export function formatGramsToScaleText(grams) {
  if (grams <= 0) return '0 ग्राम';

  if (grams >= 1000) {
    const kg = Math.floor(grams / 1000);
    const rem = grams % 1000;
    if (rem === 0) return `${kg} किलो (${grams}g)`;
    if (rem === 250) return `${kg} किलो 1 पाव (${grams}g)`;
    if (rem === 500) return `${kg} किलो 500g (${grams}g)`;
    return `${kg} किलो ${rem} ग्राम (${grams}g)`;
  }

  if (grams === 250) return `250 ग्राम (1 पाव)`;
  if (grams === 500) return `500 ग्राम (आधा किलो)`;
  if (grams === 750) return `750 ग्राम (पौना किलो)`;
  if (grams === 125) return `125 ग्राम (आधा पाव)`;

  return `${grams} ग्राम`;
}

export function calculateGramsForRupees(rupees, pricePerGram) {
  const amt = parseFloat(rupees);
  if (isNaN(amt) || amt <= 0 || !pricePerGram || pricePerGram <= 0) {
    return 0;
  }
  return Math.round(amt / pricePerGram);
}

export function generateQuickRupeeTable(pricePerGram, amounts = [5, 10, 15, 20, 25, 30, 50, 100]) {
  if (!pricePerGram || pricePerGram <= 0) return [];
  return amounts.map((rupees) => {
    const grams = Math.round(rupees / pricePerGram);
    return {
      rupees,
      grams,
      text: formatGramsToScaleText(grams),
    };
  });
}
