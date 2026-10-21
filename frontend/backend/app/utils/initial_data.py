import os
from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.category import Category
from app.models.product import Product
from app.models.price_option import ProductPriceOption
from app.models.store_settings import StoreSettings
from app.models.user import AdminUser
from app.core.security import get_password_hash

INITIAL_CATEGORIES = [
    {"name": "आटा, चावल और अनाज", "slug": "atta-rice-and-flour", "icon_name": "Wheat", "sort_order": 1, "description": "ताज़ा पिसा शरबती आटा, बासमती व रोजमर्रा चावल, बेसन व अन्य अनाज"},
    {"name": "दालें और दलहन", "slug": "dal-and-pulses", "icon_name": "Boxes", "sort_order": 2, "description": "अरहर दाल, मूंग दाल, चना दाल, उड़द दाल व अन्य दालें"},
    {"name": "तेल और शुद्ध घी", "slug": "oil-and-ghee", "icon_name": "Droplets", "sort_order": 3, "description": "शुद्ध देसी घी, सरसों का तेल, रिफाइंड तेल व मूंगफली तेल"},
    {"name": "मसाले और खड़े मसाले", "slug": "spices-and-masale", "icon_name": "Sparkles", "sort_order": 4, "description": "उंझा जीरा, हल्दी, मिर्ची, धनिया व खड़े गरम मसाले"},
    {"name": "चीनी, गुड़ और नमक", "slug": "sugar-salt-and-sweeteners", "icon_name": "Cookie", "sort_order": 5, "description": "साफ चीनी, देसी गुड़, सेंधा नमक व आयोडीन नमक"},
    {"name": "नमकीन, पोहा और पैकेट सामान", "slug": "snacks-and-packaged-foods", "icon_name": "Package", "sort_order": 6, "description": "पोहा, सूजी, सेंवई, पापड़ व तैयार नमकीन"},
    {"name": "बिस्किट और रस्क", "slug": "biscuits-and-bakery", "icon_name": "Coffee", "sort_order": 7, "description": "चाय बिस्किट, मीठे व नमकीन बिस्किट, टोस्ट और रस्क"},
    {"name": "चाय पत्ती और कॉफी", "slug": "beverages", "icon_name": "CupSoda", "sort_order": 8, "description": "कड़क सीटीसी चाय पत्ती, कॉफी व शरबत"},
    {"name": "साबुन, मंजन और शैम्पू", "slug": "personal-care", "icon_name": "Heart", "sort_order": 9, "description": "नहाने का साबुन, शैम्पू, टूथपेस्ट व रोजाना का सामान"},
    {"name": "सर्फ और सफाई का सामान", "slug": "household-cleaning", "icon_name": "Sparkle", "sort_order": 10, "description": "कपड़े धोने का सर्फ, बर्तन बार, फिनाइल व झाड़ू-पोंछा"},
    {"name": "अन्य सामान और पूजा सामग्री", "slug": "other-grocery-items", "icon_name": "ShoppingBag", "sort_order": 11, "description": "माचिस, अगरबत्ती, कपूर, धूपबत्ती व अन्य किराना सामान"},
]



def seed_database(db: Session):
    # 1. Seed Categories if empty
    cat_map = {}
    if db.query(Category).count() == 0:
        for cat_data in INITIAL_CATEGORIES:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            cat_map[cat.slug] = cat.id
        db.commit()
    else:
        for cat in db.query(Category).all():
            cat_map[cat.slug] = cat.id

    # 2. Seed Store Settings if empty
    if db.query(StoreSettings).count() == 0:
        store_settings = StoreSettings(
            store_name="Raju Kirana Store",
            tagline="Aapki Apni Kirana Dukan — Daily Essentials & Fresh Groceries",
            logo_url=None,
            contact_phone="6266444862",
            whatsapp_number="916266444862",
            address="Mahamaya gali, pisid, kasdol",
            google_maps_url="https://maps.app.goo.gl/3tPyDrjZFJjavukX8",
            opening_hours="Mon - Sun: 7:00 AM - 10:00 PM",
            description="Welcome to Raju Kirana Store! Serving our neighbourhood with fresh, high-quality groceries, grains, spices, oils, and daily household essentials at transparent prices.",
            currency_symbol="₹",
            currency_code="INR",
        )
        db.add(store_settings)
        db.commit()

    # 3. Seed Default Admin if specified via environment or none exists
    admin_count = db.query(AdminUser).count()
    if admin_count == 0:
        admin_user = os.getenv("FIRST_ADMIN_USERNAME", "admin")
        admin_email = os.getenv("FIRST_ADMIN_EMAIL", "admin@rajukirana.local")
        admin_pass = os.getenv("FIRST_ADMIN_PASSWORD", "RajuKirana@2026")
        admin = AdminUser(
            username=admin_user,
            email=admin_email,
            hashed_password=get_password_hash(admin_pass),
            full_name="Raju Kirana Owner",
            is_active=True,
        )
        db.add(admin)
        db.commit()

    # 4. Seed realistic sample products only if explicitly requested
    if os.getenv("SEED_SAMPLE_PRODUCTS", "false").lower() == "true" and db.query(Product).count() == 0:
        sample_products = [
            # Type B: Sold by Weight
            {
                "name": "Sharbati Wheat Flour (Atta)",
                "brand": "Store Fresh / MP Milled",
                "category_slug": "atta-rice-and-flour",
                "pricing_type": "weight",
                "is_available": True,
                "is_featured": True,
                "image_url": "/uploads/atta.jpg",
                "description": "Freshly stone-ground MP Sharbati wheat flour. 100% whole grain with natural bran, zero maida, and pure sweetness.",
                "price_options": [
                    {"unit_label": "1 pav (250 g)", "quantity_value": Decimal("250"), "quantity_unit": "g", "price": Decimal("14.00"), "is_default": False, "sort_order": 1},
                    {"unit_label": "500 g", "quantity_value": Decimal("500"), "quantity_unit": "g", "price": Decimal("26.00"), "is_default": False, "sort_order": 2},
                    {"unit_label": "1 kg", "quantity_value": Decimal("1000"), "quantity_unit": "g", "price": Decimal("50.00"), "is_default": True, "sort_order": 3},
                    {"unit_label": "5 kg bag", "quantity_value": Decimal("5000"), "quantity_unit": "g", "price": Decimal("240.00"), "is_default": False, "sort_order": 4},
                ],
            },
            {
                "name": "Toor Dal (Unpolished Desi Arhar)",
                "brand": "Desi Premium",
                "category_slug": "dal-and-pulses",
                "pricing_type": "weight",
                "is_available": True,
                "is_featured": True,
                "image_url": "/uploads/toor_dal.jpg",
                "description": "Unpolished superior quality yellow toor dal. Hand-cleaned, stone-free, rich in natural protein and quick cooking.",
                "price_options": [
                    {"unit_label": "1 pav (250 g)", "quantity_value": Decimal("250"), "quantity_unit": "g", "price": Decimal("40.00"), "is_default": False, "sort_order": 1},
                    {"unit_label": "500 g", "quantity_value": Decimal("500"), "quantity_unit": "g", "price": Decimal("78.00"), "is_default": False, "sort_order": 2},
                    {"unit_label": "1 kg", "quantity_value": Decimal("1000"), "quantity_unit": "g", "price": Decimal("155.00"), "is_default": True, "sort_order": 3},
                ],
            },
            {
                "name": "Clean White Sugar (M30 Cheeni)",
                "brand": "Refined Loose",
                "category_slug": "sugar-salt-and-sweeteners",
                "pricing_type": "weight",
                "is_available": True,
                "is_featured": True,
                "image_url": "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80",
                "description": "Clean, sparkling white crystalline sugar for daily chai, traditional sweets, and domestic cooking.",
                "price_options": [
                    {"unit_label": "1 pav (250 g)", "quantity_value": Decimal("250"), "quantity_unit": "g", "price": Decimal("12.00"), "is_default": False, "sort_order": 1},
                    {"unit_label": "500 g", "quantity_value": Decimal("500"), "quantity_unit": "g", "price": Decimal("24.00"), "is_default": False, "sort_order": 2},
                    {"unit_label": "1 kg", "quantity_value": Decimal("1000"), "quantity_unit": "g", "price": Decimal("46.00"), "is_default": True, "sort_order": 3},
                ],
            },
            # Type C: Small-Quantity Products (Spices)
            {
                "name": "Jeera (Unjha Special Cumin Seeds)",
                "brand": "Unjha Special",
                "category_slug": "spices-and-masale",
                "pricing_type": "small_quantity",
                "is_available": True,
                "is_featured": True,
                "image_url": "/uploads/jeera.jpg",
                "description": "Bold, fragrant cumin seeds sourced directly from Gujarat markets. Machine-cleaned and completely stone-free.",
                "price_options": [
                    {"unit_label": "20 g", "quantity_value": Decimal("20"), "quantity_unit": "g", "price": Decimal("10.00"), "is_default": False, "sort_order": 1},
                    {"unit_label": "50 g", "quantity_value": Decimal("50"), "quantity_unit": "g", "price": Decimal("22.00"), "is_default": False, "sort_order": 2},
                    {"unit_label": "100 g", "quantity_value": Decimal("100"), "quantity_unit": "g", "price": Decimal("42.00"), "is_default": True, "sort_order": 3},
                    {"unit_label": "250 g (1 pav)", "quantity_value": Decimal("250"), "quantity_unit": "g", "price": Decimal("100.00"), "is_default": False, "sort_order": 4},
                    {"unit_label": "1 kg", "quantity_value": Decimal("1000"), "quantity_unit": "g", "price": Decimal("380.00"), "is_default": False, "sort_order": 5},
                ],
            },
            {
                "name": "Rai / Sarso (Black Mustard Seeds)",
                "brand": "Desi Small Grain",
                "category_slug": "spices-and-masale",
                "pricing_type": "small_quantity",
                "is_available": True,
                "is_featured": False,
                "image_url": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
                "description": "Pungent, highly aromatic black mustard seeds for authentic Indian tempering, tadka, and pickles.",
                "price_options": [
                    {"unit_label": "50 g", "quantity_value": Decimal("50"), "quantity_unit": "g", "price": Decimal("12.00"), "is_default": False, "sort_order": 1},
                    {"unit_label": "100 g", "quantity_value": Decimal("100"), "quantity_unit": "g", "price": Decimal("22.00"), "is_default": True, "sort_order": 2},
                    {"unit_label": "250 g", "quantity_value": Decimal("250"), "quantity_unit": "g", "price": Decimal("50.00"), "is_default": False, "sort_order": 3},
                ],
            },
            # Type A: Packaged Products
            {
                "name": "Thick Poha (Flattened Rice)",
                "brand": "Gajanand",
                "category_slug": "snacks-and-packaged-foods",
                "pricing_type": "packaged",
                "is_available": True,
                "is_featured": True,
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
                "description": "Hygienically packaged clean thick poha flakes for quick morning breakfast and snacks.",
                "price_options": [
                    {"unit_label": "500 g packet", "quantity_value": Decimal("500"), "quantity_unit": "g", "price": Decimal("35.00"), "is_default": True, "sort_order": 1},
                    {"unit_label": "1 kg pouch", "quantity_value": Decimal("1000"), "quantity_unit": "g", "price": Decimal("68.00"), "is_default": False, "sort_order": 2},
                ],
            },
            {
                "name": "Tata Salt (Iodized Desh Ka Namak)",
                "brand": "Tata",
                "category_slug": "sugar-salt-and-sweeteners",
                "pricing_type": "packaged",
                "is_available": True,
                "is_featured": True,
                "image_url": "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80",
                "description": "Vacuum evaporated pure iodized salt for mental development and essential daily cooking.",
                "price_options": [
                    {"unit_label": "1 kg packet", "quantity_value": Decimal("1000"), "quantity_unit": "g", "price": Decimal("28.00"), "is_default": True, "sort_order": 1},
                ],
            },
            {
                "name": "Fortune Sunlite Refined Sunflower Oil",
                "brand": "Fortune",
                "category_slug": "oil-and-ghee",
                "pricing_type": "packaged",
                "is_available": True,
                "is_featured": True,
                "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
                "description": "Light, healthy, refined sunflower cooking oil enriched with vitamins A and D.",
                "price_options": [
                    {"unit_label": "1 Litre pouch", "quantity_value": Decimal("1"), "quantity_unit": "litre", "price": Decimal("142.00"), "is_default": True, "sort_order": 1},
                    {"unit_label": "5 Litre jar", "quantity_value": Decimal("5"), "quantity_unit": "litre", "price": Decimal("690.00"), "is_default": False, "sort_order": 2},
                ],
            },
            {
                "name": "Parle-G Gold Glucose Biscuits",
                "brand": "Parle",
                "category_slug": "biscuits-and-bakery",
                "pricing_type": "packaged",
                "is_available": True,
                "is_featured": False,
                "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
                "description": "Crispy golden glucose biscuits, perfect companion for morning and evening masala chai.",
                "price_options": [
                    {"unit_label": "130 g pack", "quantity_value": Decimal("130"), "quantity_unit": "g", "price": Decimal("15.00"), "is_default": True, "sort_order": 1},
                ],
            },
            {
                "name": "Red Label Natural Care Ayurvedic Tea",
                "brand": "Brooke Bond",
                "category_slug": "beverages",
                "pricing_type": "packaged",
                "is_available": True,
                "is_featured": True,
                "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
                "description": "Rich blended CTC black tea infused with 5 Ayurvedic ingredients: tulsi, mulethi, ashwagandha, ginger and elaichi.",
                "price_options": [
                    {"unit_label": "250 g pack", "quantity_value": Decimal("250"), "quantity_unit": "g", "price": Decimal("140.00"), "is_default": True, "sort_order": 1},
                    {"unit_label": "500 g pack", "quantity_value": Decimal("500"), "quantity_unit": "g", "price": Decimal("270.00"), "is_default": False, "sort_order": 2},
                ],
            },
            # Type D: Custom Selling Units
            {
                "name": "Farm Fresh Brown Eggs",
                "brand": "Poultry Fresh",
                "category_slug": "other-grocery-items",
                "pricing_type": "custom_unit",
                "is_available": True,
                "is_featured": False,
                "image_url": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80",
                "description": "Daily sourced protein-rich clean farm eggs with strong shells.",
                "price_options": [
                    {"unit_label": "1 Piece", "quantity_value": Decimal("1"), "quantity_unit": "piece", "price": Decimal("7.00"), "is_default": False, "sort_order": 1},
                    {"unit_label": "Half Dozen (6 pcs)", "quantity_value": Decimal("6"), "quantity_unit": "piece", "price": Decimal("40.00"), "is_default": False, "sort_order": 2},
                    {"unit_label": "1 Dozen (12 pcs)", "quantity_value": Decimal("12"), "quantity_unit": "piece", "price": Decimal("78.00"), "is_default": True, "sort_order": 3},
                    {"unit_label": "Tray (30 pcs)", "quantity_value": Decimal("30"), "quantity_unit": "piece", "price": Decimal("190.00"), "is_default": False, "sort_order": 4},
                ],
            },
            {
                "name": "Vim Dishwash Bar with Lemon",
                "brand": "Vim",
                "category_slug": "household-cleaning",
                "pricing_type": "custom_unit",
                "is_available": True,
                "is_featured": False,
                "image_url": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80",
                "description": "Powerful grease-cutting dishwash bar formulated with concentrated real lemon power.",
                "price_options": [
                    {"unit_label": "1 Bar (200 g)", "quantity_value": Decimal("1"), "quantity_unit": "piece", "price": Decimal("20.00"), "is_default": True, "sort_order": 1},
                    {"unit_label": "Pack of 3 Bars", "quantity_value": Decimal("3"), "quantity_unit": "bundle", "price": Decimal("55.00"), "is_default": False, "sort_order": 2},
                ],
            },
            {
                "name": "Dettol Original Bathing Soap",
                "brand": "Dettol",
                "category_slug": "personal-care",
                "pricing_type": "custom_unit",
                "is_available": True,
                "is_featured": False,
                "image_url": "https://images.unsplash.com/photo-1607006314644-8848c6655c82?auto=format&fit=crop&w=600&q=80",
                "description": "Classic germ protection antibacterial soap for daily family hygiene.",
                "price_options": [
                    {"unit_label": "1 Soap (75 g)", "quantity_value": Decimal("1"), "quantity_unit": "piece", "price": Decimal("38.00"), "is_default": True, "sort_order": 1},
                    {"unit_label": "Buy 4 Get 1 Free Pack", "quantity_value": Decimal("5"), "quantity_unit": "bundle", "price": Decimal("150.00"), "is_default": False, "sort_order": 2},
                ],
            },
        ]

        for p_data in sample_products:
            cat_id = cat_map.get(p_data["category_slug"])
            if not cat_id:
                continue
            product = Product(
                name=p_data["name"],
                brand=p_data.get("brand"),
                category_id=cat_id,
                pricing_type=p_data["pricing_type"],
                is_available=p_data["is_available"],
                is_featured=p_data.get("is_featured", False),
                description=p_data.get("description"),
            )
            db.add(product)
            db.flush()

            for opt_data in p_data["price_options"]:
                opt = ProductPriceOption(
                    product_id=product.id,
                    unit_label=opt_data["unit_label"],
                    quantity_value=opt_data["quantity_value"],
                    quantity_unit=opt_data["quantity_unit"],
                    price=opt_data["price"],
                    is_default=opt_data.get("is_default", False),
                    sort_order=opt_data.get("sort_order", 0),
                )
                db.add(opt)

        db.commit()
