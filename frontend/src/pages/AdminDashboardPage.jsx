import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Store,
  Loader2,
  Scale,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAdminOverview } from '../api/settings';
import { getProducts, createProduct, updateProduct } from '../api/products';
import { getCategories } from '../api/categories';
import DashboardOverview from '../components/admin/DashboardOverview';
import ProductList from '../components/admin/ProductList';
import CategoryManager from '../components/admin/CategoryManager';
import StoreSettingsForm from '../components/admin/StoreSettingsForm';
import ProductFormModal from '../components/admin/ProductFormModal';
import ScaleCalculatorModal from '../components/ScaleCalculatorModal';

export default function AdminDashboardPage({
  storeSettings,
  onRefreshSettings,
  onNavigateSite,
  showToast,
}) {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [overviewData, setOverviewData] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScaleCalcOpen, setIsScaleCalcOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ov, prodRes, catRes] = await Promise.all([
        getAdminOverview(),
        getProducts({ size: 100 }), // admin table fetch
        getCategories(),
      ]);
      setOverviewData(ov);
      setProducts(prodRes.items || []);
      setTotalProducts(prodRes.total || 0);
      setCategories(catRes || []);
    } catch (err) {
      showToast({ type: 'error', title: 'त्रुटि (Error)', message: err.message || 'डेटा लोड नहीं हो सका।' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData, productId) => {
    try {
      if (productId) {
        await updateProduct(productId, productData);
        showToast({
          type: 'success',
          title: 'भाव सुरक्षित हो गए!',
          message: `"${productData.name}" के भाव बदल दिए गए हैं।`,
        });
      } else {
        await createProduct(productData);
        showToast({
          type: 'success',
          title: 'नया सामान जुड़ गया!',
          message: `"${productData.name}" को दुकान की सूची में जोड़ दिया गया है।`,
        });
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      await fetchDashboardData();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'सेव नहीं हो सका',
        message: err.message || 'कृपया दोबारा प्रयास करें।',
      });
      throw err;
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast({ type: 'info', title: 'लॉगआउट सफल', message: 'आप सुरक्षित रूप से बाहर निकल गए हैं।' });
    onNavigateSite('home');
  };

  const storeName = storeSettings?.store_name || 'राजू किराना स्टोर';

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F5F0E7] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="bg-[#101014] text-[#F5F0E7] border-b border-[#302E31] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#17171C] border border-[#302E31] text-[#D2AC68] flex items-center justify-center font-bold shadow-xs">
                <Store className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F5F0E7] text-base tracking-wide">{storeName}</span>
                  <span className="text-[11px] bg-[#202027] text-[#D2AC68] border border-[rgba(210,172,104,0.22)] font-bold px-2 py-0.5 rounded">
                    मालिक कंट्रोल रूम
                  </span>
                </div>
                <span className="text-xs text-[#817C77] block font-medium">
                  दुकानदार: {user?.full_name || user?.username || 'राजू जी'}
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsScaleCalcOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#D2AC68] hover:bg-[#E8CA91] text-[#0A0A0C] transition-colors cursor-pointer shadow-xs"
                title="कांटा कैलकुलेटर (₹ से ग्राम तौलें)"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>⚖️ कांटा कैलकुलेटर</span>
              </button>

              <button
                onClick={() => onNavigateSite('home')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#17171C] hover:bg-[#202027] text-[#B0AAA1] hover:text-[#F5F0E7] border border-[#302E31] transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D2AC68]" />
                <span>ग्राहक वेबसाइट देखें</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#17171C] hover:bg-[#202027] text-[#F08A83] border border-[#302E31] hover:border-[#F08A83]/50 transition-colors cursor-pointer"
                title="कंट्रोल रूम से बाहर निकलें"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">बाहर निकलें (Logout)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar - Clear, friendly Hindi */}
        <div className="bg-[#0A0A0C] border-t border-[#302E31]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-[#17171C] text-[#D2AC68] border border-[#D2AC68] shadow-xs'
                  : 'text-[#817C77] hover:text-[#F5F0E7] hover:bg-[#17171C]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>दुकान का हाल (Overview)</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'products'
                  ? 'bg-[#17171C] text-[#D2AC68] border border-[#D2AC68] shadow-xs'
                  : 'text-[#817C77] hover:text-[#F5F0E7] hover:bg-[#17171C]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>सामान और भाव बदलें ({totalProducts})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'categories'
                  ? 'bg-[#17171C] text-[#D2AC68] border border-[#D2AC68] shadow-xs'
                  : 'text-[#817C77] hover:text-[#F5F0E7] hover:bg-[#17171C]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>श्रेणियाँ ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-[#17171C] text-[#D2AC68] border border-[#D2AC68] shadow-xs'
                  : 'text-[#817C77] hover:text-[#F5F0E7] hover:bg-[#17171C]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>दुकान की जानकारी (Store Info)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#817C77]">
            <Loader2 className="w-8 h-8 animate-spin text-[#D2AC68] mb-2" />
            <p className="text-sm font-semibold">दुकान की जानकारी लोड हो रही है...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <DashboardOverview
                overviewData={overviewData}
                onAddNewProduct={handleOpenAddModal}
                onEditProduct={handleOpenEditModal}
                onNavigateTab={setActiveTab}
                currencySymbol={storeSettings?.currency_symbol || '₹'}
              />
            )}

            {activeTab === 'products' && (
              <ProductList
                products={products}
                totalProducts={totalProducts}
                categories={categories}
                onAddNewProduct={handleOpenAddModal}
                onEditProduct={handleOpenEditModal}
                onRefresh={fetchDashboardData}
                showToast={showToast}
                currencySymbol={storeSettings?.currency_symbol || '₹'}
              />
            )}

            {activeTab === 'categories' && (
              <CategoryManager
                categories={categories}
                onRefresh={fetchDashboardData}
                showToast={showToast}
              />
            )}

            {activeTab === 'settings' && (
              <StoreSettingsForm
                storeSettings={storeSettings}
                onRefresh={onRefreshSettings}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          showToast={showToast}
          currencySymbol={storeSettings?.currency_symbol || '₹'}
        />
      )}

      {/* Scale Calculator Modal */}
      {isScaleCalcOpen && (
        <ScaleCalculatorModal
          products={products}
          onClose={() => setIsScaleCalcOpen(false)}
          storeSettings={storeSettings}
        />
      )}
    </div>
  );
}
