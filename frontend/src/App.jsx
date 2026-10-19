import React, { useState, useEffect } from 'react';
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

  // Modal & Toast
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isScaleCalculatorOpen, setIsScaleCalculatorOpen] = useState(false);
  const [toast, setToast] = useState(null);

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

  // Handle navigation
  const handleNavigate = (view, extraParams = {}) => {
    if (extraParams.category_id !== undefined) {
      setSelectedCategory(extraParams.category_id);
    }
    // Customer views always stay on the unified products & rate list
    if (view === 'home' || view === 'categories' || view === 'contact' || view === 'products') {
      setCurrentView('products');
    } else {
      setCurrentView(view);
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
        onOpenCalculator={() => setIsScaleCalculatorOpen(true)}
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
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setCurrentPage(1);
            }}
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
            onSelectProduct={setSelectedProduct}
            storeSettings={storeSettings}
            onResetFilters={handleResetFilters}
            onOpenCalculator={() => setIsScaleCalculatorOpen(true)}
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

      {/* Product Details Rates Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          storeSettings={storeSettings}
        />
      )}

      {/* Scale Calculator Modal (₹ to Grams) */}
      {isScaleCalculatorOpen && (
        <ScaleCalculatorModal
          products={products}
          onClose={() => setIsScaleCalculatorOpen(false)}
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
