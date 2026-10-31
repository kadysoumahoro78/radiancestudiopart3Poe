/* =========================================================
   Radiance Studio — services data
   Single source of truth for the price list. It is loaded
   dynamically into services.html (js/services.js) and also
   used by the enquiry form (js/forms.js) to build the service
   drop-down and calculate an estimated cost.

   Kept as a plain .js file (not .json) so the site also works
   when opened straight from disk, where browsers block fetch().

   price      numeric rand value used for sorting / estimates
              (null = "price on consultation")
   from       true when the price is a "from" price
   scales     true when the price grows with hair length
   ========================================================= */

window.RADIANCE_SERVICES = {
  categories: [
    { id: 'braiding',   name: 'Braiding & Styling',   blurb: 'Precision braids, locs and styling tailored to your face shape and lifestyle.' },
    { id: 'colouring',  name: 'Colouring',            blurb: 'From subtle balayage to bold, vibrant colour.' },
    { id: 'treatments', name: 'Hair Treatments',      blurb: 'Deep-conditioning and repair treatments that restore shine and strength.' },
    { id: 'extras',     name: 'Extensions & Bridal',  blurb: 'Wigs, relaxers and complete bridal hair.' }
  ],

  items: [
    { id: 'womens-braiding',  category: 'braiding', name: "Women's Braiding & Blow-Dry", price: 350, from: false, scales: true,
      description: 'Neat, long-lasting braids finished with a blow-dry. Ideal for everyday wear.' },
    { id: 'mens-braiding',    category: 'braiding', name: "Men's Braiding & Style", price: 180, from: false, scales: false,
      description: 'Clean cornrows and braided styles, sharp lines and a finish that lasts.' },
    { id: 'kids-braiding',    category: 'braiding', name: 'Children’s Braiding (under 12)', price: 120, from: false, scales: false,
      description: 'Gentle, comfortable braiding for little ones, done with patience and care.' },
    { id: 'occasion-braiding', category: 'braiding', name: 'Special Occasion Braiding (updos, braids with extensions)', price: 400, from: true, scales: true,
      description: 'Updos and braids with extensions, styled for weddings, matric dances and other big days.' },
    { id: 'locs-styling',     category: 'braiding', name: 'Locs Styling', price: 300, from: true, scales: true,
      description: 'Retwists, updos and styling for healthy, well-kept locs.' },
    { id: 'starter-locs',     category: 'braiding', name: 'Starter Locs', price: 200, from: true, scales: true,
      description: 'Begin your locs journey with a style and method chosen for your hair type.' },

    { id: 'full-colour',      category: 'colouring', name: 'Full Head Colour', price: 650, from: true, scales: true,
      description: 'Rich, even all-over colour mixed to your chosen shade.' },
    { id: 'balayage',         category: 'colouring', name: 'Highlights / Balayage', price: 850, from: true, scales: true,
      description: 'Hand-painted highlights for soft, sun-kissed dimension.' },
    { id: 'root-touch-up',    category: 'colouring', name: 'Root Touch-Up', price: 450, from: true, scales: false,
      description: 'Refresh your regrowth so your colour stays seamless.' },
    { id: 'colour-correction', category: 'colouring', name: 'Colour Correction', price: null, from: false, scales: false,
      description: 'Fixing uneven, faded or unwanted colour. Priced after a consultation.' },
    { id: 'locs-colouring',   category: 'colouring', name: 'Locs Colouring', price: null, from: false, scales: false,
      description: 'Colour designed for locs, applied carefully to protect the hair. Priced after a consultation.' },

    { id: 'deep-conditioning', category: 'treatments', name: 'Deep Conditioning Treatment', price: 300, from: false, scales: false,
      description: 'An intensive moisture treatment that restores softness, shine and strength.' },
    { id: 'keratin',          category: 'treatments', name: 'Keratin Smoothing Treatment', price: 900, from: true, scales: true,
      description: 'Smoother, more manageable hair with reduced frizz.' },
    { id: 'scalp-treatment',  category: 'treatments', name: 'Scalp Treatment', price: 250, from: true, scales: false,
      description: 'A soothing treatment for a clean, balanced and healthy scalp.' },
    { id: 'locs-treatment',   category: 'treatments', name: 'Locs Treatment', price: null, from: false, scales: false,
      description: 'Deep cleansing and conditioning made for locs. Priced after a consultation.' },

    { id: 'relaxer',          category: 'extras', name: 'Hair Relaxer (application)', price: 90, from: true, scales: true,
      description: 'Professional relaxer application for smooth, straight results.' },
    { id: 'bridal',           category: 'extras', name: 'Bridal Hair (covers up to 5 people)', price: 1000, from: true, scales: false,
      description: 'Hair for the bride and her party, with a trial run available on request.' },
    { id: 'wig-installation', category: 'extras', name: 'Wig Installation', price: 500, from: true, scales: false,
      description: 'Secure, natural-looking lace-front wig installation and styling.' },
    { id: 'matric-wig',       category: 'extras', name: 'Matric Discount (for wigs)', price: null, from: false, scales: false,
      description: 'Special matric pricing on wig services. Priced after a consultation.' }
  ]
};
