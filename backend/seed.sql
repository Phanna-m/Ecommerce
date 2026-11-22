-- ====================================================================
-- E-Commerce Order Database Seed Data
-- Products matching the PDF reference screenshots:
-- Black Jacket Puffed ($499), Women White jacket ($1000), Orange Full wear ($1200),
-- Men Top Black Puffed Jacket ($999), Urban Runner Sneakers ($350), Minimalist Leather Backpack ($280)
-- ====================================================================

-- Categories
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Outerwear & Puffer Jackets', 'outerwear-jackets', 'Premium down-filled jackets, technical outerwear, and thermal puffers'),
(2, 'Luxury Coats & Blazers', 'luxury-coats', 'Tailored trench coats, wool silhouettes, and elegant runway collections'),
(3, 'Streetwear & Full Sets', 'streetwear-sets', 'Bold monochrome jumpsuits, streetwear sets, and contemporary fits'),
(4, 'Footwear & Accessories', 'footwear-accessories', 'Designer sneakers, statement bags, and minimalist accessories');

-- Products
INSERT INTO products (id, category_id, name, price, description, image_url, stock) VALUES
(1, 1, 'Black Jacket Puffed', 499.00, 'Ultra-lightweight goose down insulation with water-repellent matte shell and storm collar.', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 25),
(2, 2, 'Women White jacket', 1000.00, 'Exquisite double-breasted tailored coat crafted from premium Italian wool cashmere blend.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80', 15),
(3, 3, 'Orange Full wear', 1200.00, 'Signature statement two-piece streetwear suit featuring technical ripstop nylon and tailored seams.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', 18),
(4, 1, 'Men Top Black Puffed Jacket', 999.00, 'Architectural high-density silhouette with heat-sealed baffled chambers and magnetic storm placket.', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80', 30),
(5, 4, 'Urban Runner Sneakers', 350.00, 'Sculpted ergonomic midsole with breathable mesh upper and premium calfskin suede accents.', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80', 40),
(6, 4, 'Minimalist Leather Backpack', 280.00, 'Full-grain vegetable-tanned leather bag with dedicated 16-inch padded laptop compartment.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', 20);

-- Customer
INSERT INTO customers (id, first_name, last_name, email, phone, address, city, state, zip_code) VALUES
(1, 'Divyansh', 'Agarwal', 'divyansh@webyansh.com', '+91 6377588843', 'Silicon Tech Park, Tower B, Suite 402', 'Bangalore', 'Karnataka', '560021');

-- Sample Order (ORD-0001) matching PDF Screenshot
INSERT INTO orders (id, customer_id, order_number, order_date, shipping_method, shipping_fee, subtotal, discount, total_amount, status) VALUES
(1, 1, 'ORD-0001', '2026-11-22 08:30:00', 'Free Shipping', 0.00, 2699.00, 0.00, 2699.00, 'Pending');

-- Order Items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 499.00, 499.00),
(1, 2, 1, 1000.00, 1000.00),
(1, 3, 1, 1200.00, 1200.00);
