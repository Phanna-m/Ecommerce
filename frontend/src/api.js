const API_BASE_URL = 'http://localhost:5000/api';

// Initial products matching the PDF reference screenshots
export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    category_id: 1,
    name: 'Black Jacket Puffed',
    price: 499.00,
    category_name: 'Outerwear & Puffer Jackets',
    description: 'Ultra-lightweight goose down insulation with water-repellent matte shell and storm collar.',
    image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    variant: 'Agora',
    specs: 'Size: XXL · Color: Black · Thermal Warmth'
  },
  {
    id: 2,
    category_id: 2,
    name: 'Women White jacket',
    price: 1000.00,
    category_name: 'Luxury Coats & Blazers',
    description: 'Exquisite double-breasted tailored coat crafted from premium Italian wool cashmere blend.',
    image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    stock: 15,
    variant: 'Allure',
    specs: 'Size: XL · Color: Smoke white · 100% Cashmere'
  },
  {
    id: 3,
    category_id: 3,
    name: 'Orange Full wear',
    price: 1200.00,
    category_name: 'Streetwear & Full Sets',
    description: 'Signature statement two-piece streetwear suit featuring technical ripstop nylon and tailored seams.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    stock: 18,
    variant: 'Vibe',
    specs: 'Size: L · Color: Electric Orange · Unisex Cut'
  },
  {
    id: 4,
    category_id: 1,
    name: 'Men Top Black Puffed Jacket',
    price: 999.00,
    category_name: 'Outerwear & Puffer Jackets',
    description: 'Architectural high-density silhouette with heat-sealed baffled chambers and magnetic storm placket.',
    image_url: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80',
    stock: 30,
    variant: 'Stealth Puffer',
    specs: 'Size: L · Color: Onyx Black · Water Resistant'
  },
  {
    id: 5,
    category_id: 4,
    name: 'Urban Runner Sneakers',
    price: 350.00,
    category_name: 'Footwear & Accessories',
    description: 'Sculpted ergonomic midsole with breathable mesh upper and premium calfskin suede accents.',
    image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    stock: 40,
    variant: 'Cloudform',
    specs: 'Size: US 10 / EU 43 · Color: Chalk White / Slate'
  },
  {
    id: 6,
    category_id: 4,
    name: 'Minimalist Leather Backpack',
    price: 280.00,
    category_name: 'Footwear & Accessories',
    description: 'Full-grain vegetable-tanned leather bag with dedicated 16-inch padded laptop compartment.',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    stock: 20,
    variant: 'Artisan Tan',
    specs: 'Volume: 20L · Color: Tan Saddle · Brass Hardware'
  }
];

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('API failed');
    const json = await res.json();
    return { data: json.data, source: 'backend' };
  } catch (err) {
    console.warn('Backend not detected, using fallback products:', err.message);
    return { data: FALLBACK_PRODUCTS, source: 'local' };
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('API failed');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return [
      { id: 1, name: 'Outerwear & Puffer Jackets' },
      { id: 2, name: 'Luxury Coats & Blazers' },
      { id: 3, name: 'Streetwear & Full Sets' },
      { id: 4, name: 'Footwear & Accessories' }
    ];
  }
}

export async function createOrder(orderPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
      signal: AbortSignal.timeout(5000)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to submit order');
    }
    return json.data;
  } catch (err) {
    console.warn('Backend order submission fallback to local storage:', err.message);
    const localSeq = Number(localStorage.getItem('order_seq') || '1');
    const orderNumber = `ORD-${String(localSeq).padStart(4, '0')}`;
    localStorage.setItem('order_seq', String(localSeq + 1));

    const subtotal = orderPayload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = Number(orderPayload.shippingFee || 0);
    const discount = Number(orderPayload.discount || 0);
    const grandTotal = Math.max(0, subtotal - discount + shippingFee);

    const localOrder = {
      id: localSeq,
      order_number: orderNumber,
      order_date: new Date().toISOString(),
      customer_id: localSeq,
      customer: {
        id: localSeq,
        first_name: orderPayload.customer.first_name,
        last_name: orderPayload.customer.last_name,
        email: orderPayload.customer.email,
        phone: orderPayload.customer.phone,
        address: orderPayload.customer.address,
        city: orderPayload.customer.city,
        state: orderPayload.customer.state,
        zip_code: orderPayload.customer.zip_code
      },
      shipping_method: orderPayload.shippingMethod || 'Standard Shipping',
      shipping_fee: shippingFee,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      total_amount: parseFloat(grandTotal.toFixed(2)),
      status: 'Pending',
      items: orderPayload.items.map((item, idx) => ({
        id: idx + 1,
        product_id: item.id || item.productId,
        product_name: item.name,
        product_image: item.image_url,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }))
    };

    const existing = JSON.parse(localStorage.getItem('local_orders') || '[]');
    existing.unshift(localOrder);
    localStorage.setItem('local_orders', JSON.stringify(existing));

    return localOrder;
  }
}

export async function fetchOrderDetails(identifier) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${identifier}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Order not found on backend');
    const json = await res.json();
    return json.data;
  } catch (err) {
    const existing = JSON.parse(localStorage.getItem('local_orders') || '[]');
    return existing.find(o => o.order_number === identifier || String(o.id) === String(identifier)) || null;
  }
}

export async function fetchSchemaMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/schema`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('API failed');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}
