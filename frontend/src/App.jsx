import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProductDetailModal from './components/ProductDetailModal';
import ScaleCalculatorModal from './components/ScaleCalculatorModal';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import { getStoreSettings } from './api/settings';
import { getCategories } from './api/categories';
import { getProducts } from './api/products';

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Navigation & View
  const [currentView, setCurrentView] = useState('home');

  // Core Data
  const [storeSettings, setStoreSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

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

  // Fetch featured and recent products for homepage
  useEffect(() => {
    async function loadHomeProducts() {
      try {
        const [featRes, recRes] = await Promise.all([
          getProducts({ is_featured: true, size: 8 }),
          getProducts({ sort_by: 'newest', size: 8 }),
        ]);
        setFeaturedProducts(featRes.items || []);
        setRecentProducts(recRes.items || []);
      } catch (err) {
        console.error('Failed to load home products:', err);
      }
    }
    loadHomeProducts();
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
        size: 16,
      };
      const res = await getProducts(params);
      setProducts(res.items || []);
      setTotalProducts(res.total || 0);
      setTotalPages(res.pages || 1);
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'Could not fetch products. Please try again.' });
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
    setCurrentView(view);
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
      {/* Public Navbar */}
      <Navbar
        storeSettings={storeSettings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={currentView}
        onNavigate={handleNavigate}
        onOpenCalculator={() => setIsScaleCalculatorOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            storeSettings={storeSettings}
            categories={categories}
            featuredProducts={featuredProducts}
            recentProducts={recentProducts}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => handleNavigate('products', { category_id: catId })}
            onSelectProduct={setSelectedProduct}
            onNavigate={handleNavigate}
            onSearchSubmit={(term) => {
              setSearchQuery(term);
              handleNavigate('products');
            }}
          />
        )}

        {currentView === 'products' && (
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
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage
            categories={categories}
            onSelectCategory={(catId) => handleNavigate('products', { category_id: catId })}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage
            storeSettings={storeSettings}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLoginPage
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        )}
      </main>

      {/* Public Footer */}
      <Footer
        storeSettings={storeSettings}
        onNavigate={handleNavigate}
        categories={categories}
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
          products={products.length > 0 ? products : (featuredProducts.length > 0 ? featuredProducts : recentProducts)}
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
