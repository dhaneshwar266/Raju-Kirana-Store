import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProductDetailModal from './components/ProductDetailModal';
import ScaleCalculatorModal from './components/ScaleCalculatorModal';
import Toast from './components/Toast';

import ProductsPage from './pages/ProductsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import { getStoreSettings } from './api/settings';
import { getCategories } from './api/categories';
import { getProducts } from './api/products';

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Navigation & View - Default is directly the products catalogue
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin-login';
    }
    return 'products';
  });

  // Core Data
  const [storeSettings, setStoreSettings] = useState(null);
  const [categories, setCategories] = useState([]);

  // Products Page State
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal & Toast State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isScaleCalculatorOpen, setIsScaleCalculatorOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Refs for state inside popstate event listeners without stale closures
  const selectedProductRef = useRef(selectedProduct);
  const isScaleCalculatorOpenRef = useRef(isScaleCalculatorOpen);
  const selectedCategoryRef = useRef(selectedCategory);
  const isClosingViaUiRef = useRef(false);

  useEffect(() => {
    selectedProductRef.current = selectedProduct;
  }, [selectedProduct]);

  useEffect(() => {
    isScaleCalculatorOpenRef.current = isScaleCalculatorOpen;
  }, [isScaleCalculatorOpen]);

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  const showToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Load store settings and categories on mount
  const loadInitialData = async () => {
    try {
      const [settingsData, catData] = await Promise.all([
        getStoreSettings(),
        getCategories(),
      ]);
      setStoreSettings(settingsData);
      setCategories(catData || []);
    } catch (err) {
      console.error('Failed to load initial store data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch products catalogue with filters
  const fetchCatalogue = async () => {
    setProductsLoading(true);
    try {
      const params = {
        search: searchQuery.trim() || undefined,
        category_id: selectedCategory || undefined,
        is_available: inStockOnly ? true : undefined,
        sort_by: sortBy,
        page: currentPage,
        size: 50, // Load all products clearly on one unified price page
      };
      const res = await getProducts(params);
      setProducts(res.items || []);
      setTotalProducts(res.total || 0);
      setTotalPages(res.pages || 1);
    } catch (err) {
      showToast({ type: 'error', title: 'त्रुटि', message: 'सामान लोड नहीं हो सका। कृपया दोबारा प्रयास करें।' });
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'products') {
      fetchCatalogue();
    }
  }, [currentView, searchQuery, selectedCategory, inStockOnly, sortBy, currentPage]);

  // Modal handlers with Browser History Back Button support
  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
    window.history.pushState({ modal: 'product-detail', productId: product.id }, '');
  };

  const handleCloseProductModal = () => {
    if (selectedProductRef.current) {
      isClosingViaUiRef.current = true;
      setSelectedProduct(null);
      if (window.history.state && window.history.state.modal === 'product-detail') {
        window.history.back();
      }
    }
  };

  const handleOpenCalculator = () => {
    setIsScaleCalculatorOpen(true);
    window.history.pushState({ modal: 'scale-calculator' }, '');
  };

  const handleCloseCalculator = () => {
    if (isScaleCalculatorOpenRef.current) {
      isClosingViaUiRef.current = true;
      setIsScaleCalculatorOpen(false);
      if (window.history.state && window.history.state.modal === 'scale-calculator') {
        window.history.back();
      }
    }
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    if (catId !== null) {
      window.history.pushState({ category_id: catId }, '');
    }
  };

  // Browser Back Button & Popstate Listener: ensures back button closes modals or returns to store
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ view: currentView }, '');
    }

    const handlePopState = (event) => {
      // If user clicked the X button (which already triggered history.back()), skip
      if (isClosingViaUiRef.current) {
        isClosingViaUiRef.current = false;
        return;
      }

      // 1. If product detail modal is open, CLOSE IT and stay on website!
      if (selectedProductRef.current) {
        setSelectedProduct(null);
        return;
      }

      // 2. If scale calculator modal is open, CLOSE IT and stay on website!
      if (isScaleCalculatorOpenRef.current) {
        setIsScaleCalculatorOpen(false);
        return;
      }

      // 3. Category history sync
      if (event.state && event.state.category_id !== undefined) {
        setSelectedCategory(event.state.category_id);
        return;
      } else if (selectedCategoryRef.current !== null) {
        setSelectedCategory(null);
        return;
      }

      // 4. View sync based on browser URL
      const path = window.location.pathname;
      if (path.startsWith('/admin/login')) {
        setCurrentView('admin-login');
      } else if (path.startsWith('/admin')) {
        setCurrentView(isAuthenticated ? 'admin-dashboard' : 'admin-login');
      } else {
        setCurrentView('products');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  // Handle navigation
  const handleNavigate = (view, extraParams = {}) => {
    if (extraParams.category_id !== undefined) {
      setSelectedCategory(extraParams.category_id);
    }

    if (view === 'admin-login') {
      if (window.location.pathname !== '/admin/login') {
        window.history.pushState({ view: 'admin-login' }, '', '/admin/login');
      }
      setCurrentView('admin-login');
    } else if (view === 'admin-dashboard') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({ view: 'admin-dashboard' }, '', '/admin');
      }
      setCurrentView('admin-dashboard');
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState({ view: 'products' }, '', '/');
      }
      setCurrentView('products');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setInStockOnly(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  // If viewing admin dashboard but not authenticated, render login
  if (currentView === 'admin-dashboard' && !isAuthenticated) {
    return (
      <AdminLoginPage
        onNavigate={handleNavigate}
        showToast={showToast}
      />
    );
  }

  // Admin Dashboard has its own distinct layout
  if (currentView === 'admin-dashboard') {
    return (
      <>
        <AdminDashboardPage
          storeSettings={storeSettings}
          onRefreshSettings={loadInitialData}
          onNavigateSite={handleNavigate}
          showToast={showToast}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0C] text-[#F5F0E7]">
      {/* Public Store Header */}
      <Navbar
        storeSettings={storeSettings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={currentView}
        onNavigate={handleNavigate}
        onOpenCalculator={handleOpenCalculator}
      />

      {/* Main Content Area: Purely the Products & Daily Rates Page */}
      <main className="flex-1">
        {currentView === 'admin-login' ? (
          <AdminLoginPage
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        ) : (
          <ProductsPage
            products={products}
            totalProducts={totalProducts}
            categories={categories}
            loading={productsLoading}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            inStockOnly={inStockOnly}
            onToggleInStockOnly={(val) => {
              setInStockOnly(val);
              setCurrentPage(1);
            }}
            sortBy={sortBy}
            onSortChange={(val) => {
              setSortBy(val);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSelectProduct={handleOpenProductModal}
            storeSettings={storeSettings}
            onResetFilters={handleResetFilters}
            onOpenCalculator={handleOpenCalculator}
          />
        )}
      </main>

      {/* Clean, Focused Footer */}
      <Footer
        storeSettings={storeSettings}
        onNavigate={handleNavigate}
      />

      {/* Floating WhatsApp button (only when number is configured) */}
      {storeSettings?.whatsapp_number && (
        <WhatsAppButton
          whatsappNumber={storeSettings.whatsapp_number}
          storeName={storeSettings?.store_name}
          floating={true}
        />
      )}

      {/* Product Details Rates Modal with Back Button Support */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseProductModal}
          storeSettings={storeSettings}
        />
      )}

      {/* Scale Calculator Modal (₹ to Grams) with Back Button Support */}
      {isScaleCalculatorOpen && (
        <ScaleCalculatorModal
          products={products}
          onClose={handleCloseCalculator}
          storeSettings={storeSettings}
        />
      )}

      {/* Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
