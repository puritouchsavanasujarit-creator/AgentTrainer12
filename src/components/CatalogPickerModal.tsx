import React, { useState } from 'react';
import { X, Check, Image as ImageIcon, Send, Sparkles, Tag, AlertCircle } from 'lucide-react';
import { FruitProduct } from '../types';
import { CATALOG_PRODUCTS } from '../data/trainingData';

interface CatalogPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendProduct: (product: FruitProduct) => void;
  onSendAlbum: (budget: number) => void;
  currentBudget: number;
}

export const CatalogPickerModal: React.FC<CatalogPickerModalProps> = ({
  isOpen,
  onClose,
  onSendProduct,
  onSendAlbum,
  currentBudget,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  if (!isOpen) return null;

  const categories = ['ทั้งหมด', 'กระเช้าพรีเมียม', 'ชุดผลไม้เยี่ยมไข้', 'กล่องของขวัญ'];

  const filteredProducts =
    selectedCategory === 'ทั้งหมด'
      ? CATALOG_PRODUCTS
      : CATALOG_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl text-slate-100 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">
                แคตตาล็อกกระเช้าผลไม้ & ส่งรูปภาพแนะนำ (SOP Stage 2)
              </h3>
              <p className="text-xs text-slate-400">
                ตามมาตรฐาน SOP ให้ส่งรูปแนะนำ 8-12 แบบ ในช่วงราคา +- 200 บ. จากงบของลูกค้า ({currentBudget.toLocaleString()} บ.)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Album Action Bar */}
        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 px-6 py-3 border-b border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-emerald-300 font-medium">⚡ ส่งเซ็ตรูปด่วน:</span>
            <span className="text-slate-400">
              ส่งรูปตัวอย่างอัลบั้ม 8-12 แบบ ตรงตามงบ {currentBudget.toLocaleString()} บ.
            </span>
          </div>
          <button
            onClick={() => {
              onSendAlbum(currentBudget);
              onClose();
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ส่งอัลบั้มภาพ 8-12 แบบตามงบเข้าแชททันที</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-2.5 bg-slate-850 border-b border-slate-800 flex items-center space-x-2 shrink-0 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-medium shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isNearBudget =
              Math.abs(product.price - currentBudget) <= 500;

            return (
              <div
                key={product.id}
                className={`rounded-xl border overflow-hidden flex flex-col justify-between transition hover:border-emerald-500/70 ${
                  isNearBudget
                    ? 'bg-slate-800/90 border-emerald-500/40'
                    : 'bg-slate-850/60 border-slate-700/60'
                }`}
              >
                <div>
                  {/* Image & Price Tag */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-emerald-400 text-xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                      {product.code}
                    </div>
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                      ฿{product.price.toLocaleString()}
                    </div>
                    {isNearBudget && (
                      <div className="absolute bottom-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        ⭐ ตรงช่วงงบลูกค้า
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2">
                    <h4 className="font-semibold text-sm text-white line-clamp-1">
                      {product.name}
                    </h4>

                    {/* Fruits Included */}
                    <div className="text-[11px] text-slate-300">
                      <span className="text-slate-400 font-medium">ผลไม้ในกระเช้า:</span>{' '}
                      {product.fruitsIncluded.join(', ')}
                    </div>

                    {/* Upsell Option Tag */}
                    {product.upsellOption && (
                      <div className="bg-emerald-950/60 border border-emerald-800/40 rounded-lg p-2 text-[11px] text-emerald-200">
                        <div className="font-semibold flex items-center space-x-1 text-emerald-300">
                          <Sparkles className="w-3 h-3" />
                          <span>ตัวเลือก Up-sell แนะนำ:</span>
                        </div>
                        <div>
                          {product.upsellOption.name} (+{product.upsellOption.addPrice} บ.)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">{product.category}</span>
                  <button
                    onClick={() => {
                      onSendProduct(product);
                      onClose();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1 transition shadow"
                  >
                    <Send className="w-3 h-3" />
                    <span>ส่งกระเช้านี้เข้าแชท</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
