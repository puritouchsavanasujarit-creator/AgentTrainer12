import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  ArrowRight,
  Calculator,
  Compass,
  Building2,
  Hospital,
} from 'lucide-react';

interface InteractiveDeliveryMapProps {
  onSelectDestination?: (name: string, distanceKm: number, note: string) => void;
  onInsertFeeScript?: (script: string) => void;
}

interface MapPoint {
  id: string;
  name: string;
  category: 'hospital' | 'business' | 'residential' | 'landmark';
  x: number; // SVG coordinate percentage 0-100
  y: number;
  km: number;
  travelMins: number;
  note: string;
  isHospital?: boolean;
}

const MAP_POINTS: MapPoint[] = [
  {
    id: 'siriraj',
    name: 'รพ.ศิริราช (Siriraj)',
    category: 'hospital',
    x: 48,
    y: 53,
    km: 5,
    travelMins: 15,
    note: 'เขตบางกอกน้อย ฝั่งธนบุรี (ห้ามแมสขึ้นตึก! ฝากจุดรับของกลางชั้น 1)',
    isHospital: true,
  },
  {
    id: 'silom',
    name: 'สีลมคอมเพล็กซ์ (Silom)',
    category: 'business',
    x: 58,
    y: 62,
    km: 9,
    travelMins: 25,
    note: 'ย่านธุรกิจ สีลม-สาทร (1-10 กม. สั่งครบ 1,500 ส่งฟรี)',
  },
  {
    id: 'chula',
    name: 'รพ.จุฬาลงกรณ์ (Chula)',
    category: 'hospital',
    x: 59,
    y: 58,
    km: 10,
    travelMins: 28,
    note: 'พระราม 4 / ปทุมวัน (ส่งจุด Drop-off อาคารภูมิสิริฯ ชั้น 1)',
    isHospital: true,
  },
  {
    id: 'ari',
    name: 'อารีย์ / พหลโยธิน ซอย 7',
    category: 'residential',
    x: 54,
    y: 40,
    km: 8,
    travelMins: 22,
    note: 'โซนพญาไท (1-10 กม. ครบ 1,500 ส่งฟรี)',
  },
  {
    id: 'rama9',
    name: 'รพ.พระราม 9 / อโศก',
    category: 'hospital',
    x: 68,
    y: 49,
    km: 13,
    travelMins: 35,
    note: 'ห้วยขวาง-พระราม 9 (11-25 กม. ครบ 4,000 ส่งฟรี, ส่งเคาน์เตอร์ชั้น 1)',
    isHospital: true,
  },
  {
    id: 'ladprao',
    name: 'เซ็นทรัล ลาดพร้าว',
    category: 'business',
    x: 56,
    y: 31,
    km: 12,
    travelMins: 32,
    note: 'ห้าแยกลาดพร้าว (11-25 กม. ยอดไม่ถึงคิด 159 บ.)',
  },
  {
    id: 'bangkae',
    name: 'เดอะมอลล์ บางแค',
    category: 'business',
    x: 32,
    y: 66,
    km: 14,
    travelMins: 38,
    note: 'โซนเพชรเกษม ฝั่งธนบุรี (11-25 กม.)',
  },
  {
    id: 'bangna',
    name: 'บางนา-ตราด กม.14',
    category: 'residential',
    x: 88,
    y: 78,
    km: 28,
    travelMins: 55,
    note: 'โซนนอกเมือง (>25 กม. คิดฐาน 159 + 10 บ./กม. ยอด 4,000 ฟรีฐาน 159)',
  },
  {
    id: 'fashion',
    name: 'แฟชั่นไอส์แลนด์ รามอินทรา',
    category: 'business',
    x: 77,
    y: 22,
    km: 27,
    travelMins: 50,
    note: 'โซนรามอินทรา (>25 กม. ส่วนเกิน 2 กม. x 10 บ.)',
  },
];

// Charan 59 Center Coordinates in SVG
const CHARAN_59 = { x: 47, y: 46 };

export const InteractiveDeliveryMap: React.FC<InteractiveDeliveryMapProps> = ({
  onSelectDestination,
  onInsertFeeScript,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint>(MAP_POINTS[0]);
  const [orderAmount, setOrderAmount] = useState<number>(2500);
  const [selectedBrand, setSelectedBrand] = useState<'PMF' | 'UB'>('PMF');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Calculate PMF Fee
  let pmfFee = 0;
  let pmfExplanation = '';
  let pmfFree = false;

  if (selectedPoint.km <= 10) {
    if (orderAmount >= 1500) {
      pmfFee = 0;
      pmfFree = true;
      pmfExplanation = 'ระยะ 1-10 กม. ยอดซื้อครบ 1,500 บาท ฟรีค่าจัดส่งทันที!';
    } else {
      pmfFee = 59;
      pmfFree = false;
      pmfExplanation = 'ระยะ 1-10 กม. ยอดไม่ถึง 1,500 บาท คิดค่าจัดส่ง 59 บาท';
    }
  } else if (selectedPoint.km <= 25) {
    if (orderAmount >= 4000) {
      pmfFee = 0;
      pmfFree = true;
      pmfExplanation = 'ระยะ 11-25 กม. ยอดซื้อครบ 4,000 บาท ฟรีค่าจัดส่งทันที!';
    } else {
      pmfFee = 159;
      pmfFree = false;
      pmfExplanation = 'ระยะ 11-25 กม. ยอดไม่ถึง 4,000 บาท คิดค่าจัดส่ง 159 บาท';
    }
  } else {
    const excess = selectedPoint.km - 25;
    const excessCost = excess * 10;
    if (orderAmount >= 4000) {
      pmfFee = excessCost;
      pmfFree = false;
      pmfExplanation = `ระยะ ${selectedPoint.km} กม. (>25 กม.) สั่งครบ 4,000 บ. ได้รับสิทธิ์ฟรีค่าส่งฐาน 159 บ.! ชำระเฉพาะส่วนเกิน ${excess} กม. x 10 บ. = ${excessCost} บาท`;
    } else {
      pmfFee = 159 + excessCost;
      pmfFree = false;
      pmfExplanation = `ระยะ ${selectedPoint.km} กม. ค่าส่งฐาน 159 บ. + ส่วนเกิน ${excess} กม. x 10 บ. (${excessCost} บ.) = รวม ${pmfFee} บาท`;
    }
  }

  // UB Fee
  const ubFee = selectedPoint.km <= 30 ? 0 : 200 + (selectedPoint.km - 30) * 15;
  const ubExplanation =
    selectedPoint.km <= 30
      ? 'Uncle Ben: ฟรีค่าส่งทุกออเดอร์ (ไม่เกิน 30 กม.)'
      : 'Uncle Ben: เกิน 30 กม. คิดค่าบริการพิเศษ';

  const activeFee = selectedBrand === 'PMF' ? pmfFee : ubFee;
  const activeExplanation = selectedBrand === 'PMF' ? pmfExplanation : ubExplanation;

  const scriptToInsert = `สำหรับค่าจัดส่งปลายทาง "${selectedPoint.name}" (${selectedPoint.km} กม. จากศูนย์จรัญ 59)
ยอดสั่งซื้อ ${orderAmount.toLocaleString()} บาท:
👉 ${activeFee === 0 ? 'ฟรีค่าจัดส่งค่ะ! 🎉' : `ค่าจัดส่ง ${activeFee} บาท`}
(${activeExplanation})
${selectedPoint.isHospital ? '\n⚠️ หมายเหตุ รพ.: แมสเซนเจอร์นำส่งที่จุดรับของกลางชั้น 1 ค่ะ' : ''}`;

  const filteredPoints =
    filterCategory === 'all'
      ? MAP_POINTS
      : MAP_POINTS.filter((p) => p.category === filterCategory);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-full">
      {/* Interactive Map Visual (Left/Center) */}
      <div className="flex-1 bg-[#1a2332] p-4 flex flex-col justify-between relative overflow-hidden select-none">
        {/* Map Header Overlay */}
        <div className="z-10 flex flex-wrap items-center justify-between gap-2 mb-2 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              📍
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-white">
                แผนที่รัศมีโซนจัดส่ง (Hub: ซอยจรัญสนิทวงศ์ 59)
              </h3>
              <p className="text-[11px] text-slate-400">
                คลิกที่หมุดปลายทางเพื่อดูระยะทางจริงและคำนวณอัตราค่าส่งอัตโนมัติ
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2 py-1 rounded-md transition ${
                filterCategory === 'all'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterCategory('hospital')}
              className={`px-2 py-1 rounded-md transition flex items-center space-x-1 ${
                filterCategory === 'hospital'
                  ? 'bg-red-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Hospital className="w-3 h-3 text-red-400" />
              <span>รพ. ({MAP_POINTS.filter((p) => p.isHospital).length})</span>
            </button>
            <button
              onClick={() => setFilterCategory('business')}
              className={`px-2 py-1 rounded-md transition ${
                filterCategory === 'business'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              ออฟฟิศ/ห้าง
            </button>
          </div>
        </div>

        {/* SVG Interactive Bangkok Map */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#141d2b] rounded-xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Radial Gradients for Delivery Rings */}
              <radialGradient id="ring10km" cx="47%" cy="46%" r="20%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
              </radialGradient>
              <radialGradient id="ring25km" cx="47%" cy="46%" r="42%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
              </radialGradient>
              <radialGradient id="ring60km" cx="47%" cy="46%" r="65%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01" />
              </radialGradient>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Grid Lines for Map Feel */}
            <path
              d="M 10 0 L 10 100 M 30 0 L 30 100 M 50 0 L 50 100 M 70 0 L 70 100 M 90 0 L 90 100 M 0 20 L 100 20 M 0 40 L 100 40 M 0 60 L 100 60 M 0 80 L 100 80"
              stroke="#1e293b"
              strokeWidth="0.3"
            />

            {/* Chao Phraya River Stylized Path */}
            <path
              d="M 38 0 C 44 20, 48 35, 46 45 C 44 55, 52 65, 50 80 C 48 90, 60 100, 62 100"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.5"
            />
            <text x="38" y="24" fill="#3b82f6" fontSize="2" opacity="0.6">
              แม่น้ำเจ้าพระยา (Chao Phraya)
            </text>

            {/* Outer Zone Ring 25-60km */}
            <circle
              cx={CHARAN_59.x}
              cy={CHARAN_59.y}
              r="48"
              fill="url(#ring60km)"
              stroke="#f59e0b"
              strokeWidth="0.4"
              strokeDasharray="2,2"
              opacity="0.6"
            />
            <text x="75" y="10" fill="#f59e0b" fontSize="2.2" opacity="0.8">
              โซน 25+ กม. (ฐาน 159 + 10บ./กม.)
            </text>

            {/* Middle Zone Ring 11-25km */}
            <circle
              cx={CHARAN_59.x}
              cy={CHARAN_59.y}
              r="30"
              fill="url(#ring25km)"
              stroke="#3b82f6"
              strokeWidth="0.5"
              strokeDasharray="1.5,1.5"
              opacity="0.8"
            />
            <text x="65" y="24" fill="#38bdf8" fontSize="2.2" opacity="0.9">
              โซน 11-25 กม. (ครบ 4,000 ส่งฟรี)
            </text>

            {/* Inner Zone Ring 1-10km */}
            <circle
              cx={CHARAN_59.x}
              cy={CHARAN_59.y}
              r="15"
              fill="url(#ring10km)"
              stroke="#10b981"
              strokeWidth="0.6"
            />
            <text x="47" y="36" fill="#10b981" fontSize="2.2" fontWeight="bold">
              โซน 1-10 กม. (ครบ 1,500 ส่งฟรี!)
            </text>

            {/* Active Route Line to Selected Destination */}
            <line
              x1={CHARAN_59.x}
              y1={CHARAN_59.y}
              x2={selectedPoint.x}
              y2={selectedPoint.y}
              stroke="url(#routeGradient)"
              strokeWidth="0.9"
              strokeDasharray="2,1"
              className="animate-pulse"
            />

            {/* Center Dispatch Hub (Charan 59) */}
            <g transform={`translate(${CHARAN_59.x}, ${CHARAN_59.y})`}>
              <circle r="4" fill="#10b981" opacity="0.25" className="animate-ping" />
              <circle r="2.4" fill="#10b981" stroke="#ffffff" strokeWidth="0.6" />
              <text
                x="0"
                y="-4.5"
                fill="#34d399"
                fontSize="2.4"
                fontWeight="bold"
                textAnchor="middle"
              >
                ศูนย์จัดส่ง จรัญ 59
              </text>
            </g>

            {/* Destination Pins */}
            {filteredPoints.map((point) => {
              const isSelected = selectedPoint.id === point.id;
              const isHosp = point.category === 'hospital';

              return (
                <g
                  key={point.id}
                  transform={`translate(${point.x}, ${point.y})`}
                  onClick={() => {
                    setSelectedPoint(point);
                    if (onSelectDestination) {
                      onSelectDestination(point.name, point.km, point.note);
                    }
                  }}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Pin Selection Highlight Ring */}
                  {isSelected && (
                    <circle
                      r="4"
                      fill={isHosp ? '#ef4444' : '#38bdf8'}
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Marker Dot */}
                  <circle
                    r={isSelected ? '2.5' : '1.8'}
                    fill={isHosp ? '#ef4444' : isSelected ? '#38bdf8' : '#94a3b8'}
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />

                  {/* Label */}
                  <text
                    x="0"
                    y={point.y > 60 ? '4.5' : '-3.5'}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize={isSelected ? '2.3' : '1.9'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="drop-shadow-md select-none"
                  >
                    {point.name.split(' ')[0]} ({point.km} กม.)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="z-10 mt-3 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>1-10 กม. (ฟรีเมื่อครบ 1,500)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
              <span>11-25 กม. (ฟรีเมื่อครบ 4,000)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>25+ กม. (159 + 10บ./กม.)</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span>โรงพยาบาล (ห้ามขึ้นตึก)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Control & Calculation Panel (Right Sidebar) */}
      <div className="w-full lg:w-96 bg-slate-850 p-5 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          {/* Selected Destination Card */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                จุดหมายปลายทางที่เลือก
              </span>
              <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                {selectedPoint.km} กม. จากจรัญ 59
              </span>
            </div>

            <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
              {selectedPoint.isHospital ? (
                <Hospital className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <span>{selectedPoint.name}</span>
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              {selectedPoint.note}
            </p>

            {selectedPoint.isHospital && (
              <div className="p-2 rounded bg-red-950/60 border border-red-700/60 text-[11px] text-red-200 flex items-start space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>ข้อกำหนด รพ.:</strong> ห้ามแมสเซนเจอร์ขึ้นห้องพักผู้ป่วย ต้องฝากจุดรับของกลางชั้น 1
                </span>
              </div>
            )}
          </div>

          {/* Calculator Inputs */}
          <div className="space-y-3">
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setSelectedBrand('PMF')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition ${
                  selectedBrand === 'PMF'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                PMF (มอเตอร์ไซค์)
              </button>
              <button
                onClick={() => setSelectedBrand('UB')}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition ${
                  selectedBrand === 'UB'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Uncle Ben (UB)
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium mb-1 block">
                ยอดสั่งซื้อของลูกค้า (บาท):
              </label>
              <input
                type="number"
                step="100"
                value={orderAmount}
                onChange={(e) => setOrderAmount(Number(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Fee Result Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">ค่าจัดส่งคำนวณได้:</span>
              {activeFee === 0 ? (
                <span className="text-emerald-400 font-black text-sm px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                  🎉 ฟรีค่าจัดส่ง!
                </span>
              ) : (
                <span className="text-amber-400 font-black text-base">
                  +{activeFee} บาท
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {activeExplanation}
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">ยอดรวมสินค้า + ค่าส่ง:</span>
              <span className="font-bold text-white text-sm">
                {(orderAmount + activeFee).toLocaleString()} บาท
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onInsertFeeScript && (
          <button
            onClick={() => onInsertFeeScript(scriptToInsert)}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-950/50"
          >
            <ArrowRight className="w-4 h-4" />
            <span>แทรกข้อความค่าส่งนี้เข้าห้องแชท</span>
          </button>
        )}
      </div>
    </div>
  );
};
