import React, { useState } from "react";

// ─── Figma Asset URLs ─────────────────────────────────────────────────────────
const imgMaskGroup = "https://www.figma.com/api/mcp/asset/91b6ad96-9f30-4c63-b3d0-6c8f23cbb686";
const imgGroup1437253079 = "https://www.figma.com/api/mcp/asset/2b73daef-cf24-49bc-a855-ab2e6acfa06a";
const imgGroupSuper = "https://www.figma.com/api/mcp/asset/037a5d06-9ce8-48d5-9da2-078430cd2d3d";
const imgMinsGif2 = "https://www.figma.com/api/mcp/asset/bd3f149a-3dfd-4237-8608-724d7547b345";
const imgLayer1 = "https://www.figma.com/api/mcp/asset/6e30dfba-3645-4e90-acbb-3f0f67cd5192";
const imgImage17161 = "https://www.figma.com/api/mcp/asset/d886af62-31b8-4533-9164-1de787cdc817";
const imgIconSend = "https://www.figma.com/api/mcp/asset/37cae217-d680-4351-b926-50509b2b52c0";
const imgSearchPath = "https://www.figma.com/api/mcp/asset/93171f15-e2a4-4e79-ba5d-3051d0a169cb";
const imgCameraVector = "https://www.figma.com/api/mcp/asset/84637116-82c7-495e-bbd9-54e45fec0525";
const imgHomIcon = "https://www.figma.com/api/mcp/asset/4a592631-c5bb-415b-8ca8-8c7c11897677";
const imgIconArrowDown = "https://www.figma.com/api/mcp/asset/ef82bb00-83d3-4003-9ba9-0f415af7aed9";
const imgFrame2147225910 = "https://www.figma.com/api/mcp/asset/aadcd120-2528-4cd0-9cfb-12457ae67f19";
const imgImage350845 = "https://www.figma.com/api/mcp/asset/d50462c9-22ea-4072-b00a-0744175b632b";
const img379 = "https://www.figma.com/api/mcp/asset/e553e838-0736-4db7-9015-58857cc720b5";
const img1601 = "https://www.figma.com/api/mcp/asset/b4046aa1-b5ad-4c6c-b466-857b7ea9f45c";
const imgImage350853 = "https://www.figma.com/api/mcp/asset/c7f66a8e-ad4b-44fa-9392-fbdbef657e07";
const imgImage350824 = "https://www.figma.com/api/mcp/asset/091ccc4b-5b4f-4a31-a0ac-13d8841c0f76";
const imgEllipse24102 = "https://www.figma.com/api/mcp/asset/937d8a2e-787b-4534-8faf-4e73e8749e59";
const imgEllipse24103 = "https://www.figma.com/api/mcp/asset/6954d3d6-cf30-4901-a688-b7e3818ef6ab";
const imgBg = "https://www.figma.com/api/mcp/asset/27c21601-8204-4743-9b94-9ada1020ddd3";
const imgBg1 = "https://www.figma.com/api/mcp/asset/143442a3-285e-4bc3-abdd-d733356bfb37";
const imgBg2 = "https://www.figma.com/api/mcp/asset/1a9c9571-c79b-4d92-8dcc-1a03e5ddd176";
const imgCatBeauty1 = "https://www.figma.com/api/mcp/asset/75b4442e-dcdc-47a9-b372-ed6f2ba2146d";
const imgCatBeauty2 = "https://www.figma.com/api/mcp/asset/acbc1147-dd12-4a9c-9cf3-6fba76b668a7";
const imgCatGrocery = "https://www.figma.com/api/mcp/asset/2895542a-17e1-426b-bb44-c9cc9966b992";
const imgCatAppliance1 = "https://www.figma.com/api/mcp/asset/5297fe91-6494-4d6e-b28d-79be32119ada";
const imgCatAppliance2 = "https://www.figma.com/api/mcp/asset/a330492f-f09c-4d6a-ad23-592ecde19b12";
const imgCatToys1 = "https://www.figma.com/api/mcp/asset/b1985b35-2f36-4d09-a95d-32af2fc8a84b";
const imgCatToys2 = "https://www.figma.com/api/mcp/asset/bb1bd64c-37c4-478d-9500-50782d80ca63";
const imgCatTravel = "https://www.figma.com/api/mcp/asset/fa86e4d8-93a9-45c0-9492-0d4376ed0438";
const imgCatElec = "https://www.figma.com/api/mcp/asset/7427d2cf-f47e-411a-964e-b6cb03615896";
const imgCatHair1 = "https://www.figma.com/api/mcp/asset/14e0e787-2612-4ef9-bf10-43114d28ef5d";
const imgCatHair2 = "https://www.figma.com/api/mcp/asset/f482ac88-e2fe-401d-b60d-7dd5d0e4ec6f";
const imgCatShoes1 = "https://www.figma.com/api/mcp/asset/1dd4863c-20da-404d-91e1-1b3a0e36ef38";
const imgCatShoes2 = "https://www.figma.com/api/mcp/asset/e56a725f-b8eb-4505-91af-d6122e327938";
const imgCatVec1 = "https://www.figma.com/api/mcp/asset/05458f41-4e11-40b8-b2be-35e7ab4fc233";
const imgCatVec2 = "https://www.figma.com/api/mcp/asset/fdd76904-ef75-4670-b62a-9a664f29124b";
const imgTabForYou = "https://www.figma.com/api/mcp/asset/08336d29-4afb-437f-a45a-fe75dbd1a4b8";
const imgTabElec = "https://www.figma.com/api/mcp/asset/21f951f9-d213-4ee7-b9c9-6ad3022dbfee";
const imgTabBeauty = "https://www.figma.com/api/mcp/asset/e6c4b18a-ad75-4e94-ba8b-f88db083e117";
const imgTabFashion = "https://www.figma.com/api/mcp/asset/7d1a1865-9b57-42b1-b4ae-35955fa38531";
const imgTabHome2 = "https://www.figma.com/api/mcp/asset/5f9e8d8c-8ee6-4ce4-b123-e3d73b5b4ed6";
const imgAirpods1 = "https://www.figma.com/api/mcp/asset/bdc00429-1b12-416f-b49e-9a7d67af55ce";
const imgWhirlpool = "https://www.figma.com/api/mcp/asset/7ae0fba8-f26d-4d48-a64d-4e1019028879";
const imgPhoneCase = "https://www.figma.com/api/mcp/asset/3bbf90a3-137a-43b8-83af-35712ab1bbaa";
const imgHeartIcon = "https://www.figma.com/api/mcp/asset/3fee2ab7-856b-44a2-ae5f-1e24632e3b31";
const imgPlusIcon = "https://www.figma.com/api/mcp/asset/11a787cc-b072-42f0-9ace-5ea9f5c28b3f";
const imgStarIcon = "https://www.figma.com/api/mcp/asset/be2fdd89-fa1e-487b-a23f-1a946f8ecf52";
const imgTruckIcon = "https://www.figma.com/api/mcp/asset/109f77b7-6499-4e96-9f54-e2ac2485f55f";
const imgSoldByLogo1 = "https://www.figma.com/api/mcp/asset/b69105c4-a549-4302-a334-12268716dd88";
const imgSoldByLogo2 = "https://www.figma.com/api/mcp/asset/c64c14e0-598d-4101-b3f2-155fc936bb9f";
const imgSoldByLogo3 = "https://www.figma.com/api/mcp/asset/79c1afcb-0660-4079-bd3d-016b4c2dee99";
const imgEllipse1802 = "https://www.figma.com/api/mcp/asset/1b54096e-723b-49be-857e-7e05b5ccab67";
const imgOfferCard = "https://www.figma.com/api/mcp/asset/46835bae-09c4-44b8-9bc1-a0532c1a50fa";
const imgOfferArrow = "https://www.figma.com/api/mcp/asset/eb8f97b6-ef9e-40f2-a899-fb5447b4182d";
const imgOfferLine = "https://www.figma.com/api/mcp/asset/4172e134-40ec-417c-86d2-a70c17af3959";
const imgOfferGroup = "https://www.figma.com/api/mcp/asset/d0ed64af-23bb-4ffe-8e81-984242432a6f";
const imgHourglass = "https://www.figma.com/api/mcp/asset/038669b8-b8e8-4fab-ace3-ec35ecfb4d6e";
const imgTimerVec1 = "https://www.figma.com/api/mcp/asset/baa3838e-9d30-42c8-9bb7-88678718b8d9";
const imgTimerVec2 = "https://www.figma.com/api/mcp/asset/a1bb2f74-5116-49ef-b559-2c1725f5c481";
const imgMegaAirpods1 = "https://www.figma.com/api/mcp/asset/5b907e5c-4f89-4fd3-9823-358eaa056656";
const imgMegaAirpods2 = "https://www.figma.com/api/mcp/asset/a58e0c74-a98f-42e5-b30a-fe77653b058e";
const imgNavArrow = "https://www.figma.com/api/mcp/asset/5ccce315-3c50-4366-baed-8eac3c25962c";
const imgMegaPlus = "https://www.figma.com/api/mcp/asset/6652dbd1-9869-4ae5-ad80-feb5f6288a7e";
const imgSummerVideo = "https://www.figma.com/api/mcp/asset/9f58d7e5-b65a-4f0e-ab9b-423643147046";
const imgSummerBadge = "https://www.figma.com/api/mcp/asset/77072eec-d950-426c-ac57-2475333c273b";
const imgPs5Card = "https://www.figma.com/api/mcp/asset/b5d835f8-7376-4ddc-98e0-e6ff2f1b5522";
const imgPs4Controller = "https://www.figma.com/api/mcp/asset/7976e5c4-b146-40df-b2bc-40c606fc7f9a";
const imgSneaker = "https://www.figma.com/api/mcp/asset/c3076ccc-22cd-4801-a974-d076793aa9ef";
const imgSerum = "https://www.figma.com/api/mcp/asset/bc15c5a2-f4e4-4fe7-85f7-66cc0837aaf7";
const imgKeepSearchIcon = "https://www.figma.com/api/mcp/asset/ff627e29-1ec4-49a6-ac6f-8e2a23151626";
const imgKeepArrow = "https://www.figma.com/api/mcp/asset/ddfa21e5-82c9-421b-810c-aad653d9525f";
const imgNavHome = "https://www.figma.com/api/mcp/asset/8d51554d-3eda-42c1-bf36-970b5ed75d18";
const imgNavCategories = "https://www.figma.com/api/mcp/asset/631d1b0d-823f-42a8-93d8-d0dbf3ea60c3";
const imgNavDeals = "https://www.figma.com/api/mcp/asset/837612b3-d026-4671-a7e6-493548764ac3";
const imgNavAccount = "https://www.figma.com/api/mcp/asset/a5d9d8d4-6a5c-401d-bd38-ef6343b7b189";
const imgNavCart = "https://www.figma.com/api/mcp/asset/ba8cab80-c475-4209-982f-ff79b5bd955b";
const imgNavActiveBar = "https://www.figma.com/api/mcp/asset/4a84763d-2e89-4ff9-9016-42e70e2270c2";

// ─── SKU Product Card ─────────────────────────────────────────────────────────
interface SKUProduct { name: string; img: string; soldByImg: string; badge?: string; adTag?: boolean; }

function SkuCard({ product }: { product: SKUProduct }) {
  return (
    <div className="flex-none flex flex-col gap-1 bg-white rounded-[8px] overflow-visible" style={{ width: 134 }}>
      <div
        className="relative rounded-[10px] overflow-hidden flex items-center justify-center shrink-0"
        style={{ height: 174, background: "linear-gradient(90deg, #2122b8 0%, #2122b8 100%)" }}
      >
        {product.badge && (
          <div className="absolute top-0 left-0 bg-[#343d54] rounded-br-[10px] rounded-tl-[6px] z-10 flex items-center justify-center px-1.5" style={{ height: 20 }}>
            <span className="text-white text-[12px] font-semibold leading-4 tracking-[-0.1px] whitespace-nowrap">{product.badge}</span>
          </div>
        )}
        {product.adTag && (
          <div className="absolute bg-white flex items-center justify-center px-1 py-0.5 rounded z-10" style={{ bottom: 6, left: 6 }}>
            <span className="text-[#666d85] leading-[11px]" style={{ fontSize: 10 }}>Ad</span>
          </div>
        )}
        <img src={product.img} alt={product.name} className="object-cover pointer-events-none" style={{ width: 122, height: 122 }} />
        <button className="absolute top-1 right-1 bg-white rounded-full flex items-center justify-center z-10" style={{ width: 24, height: 24, padding: 4 }}>
          <img src={imgHeartIcon} alt="" style={{ width: 16, height: 16 }} />
        </button>
        <button className="absolute border-[1.2px] border-[#0076ff] bg-white rounded-[8px] flex items-center z-10" style={{ bottom: 6, right: 6, padding: 4 }}>
          <img src={imgPlusIcon} alt="" style={{ width: 24, height: 24 }} />
        </button>
      </div>
      <div className="flex flex-col gap-2 p-1 w-full">
        <p className="text-[#1d2539] leading-[18px] overflow-hidden text-ellipsis tracking-[-0.1px] w-full" style={{ fontSize: 14, fontWeight: 500, height: 36 }}>
          {product.name}
        </p>
        <div className="flex items-center">
          <div className="flex items-center gap-0.5 bg-[#f2f3f7] px-1 py-0.5 rounded">
            <img src={imgStarIcon} alt="" style={{ width: 12, height: 11.5 }} />
            <span className="text-[#1d2539] text-[12px] font-semibold leading-4 tracking-[-0.1px]">4.3</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-[#1d2539] text-[14px] font-bold leading-[18px] tracking-[-0.1px] whitespace-nowrap">dhm899</span>
          <span className="text-[#666d85] text-[12px] leading-4 tracking-[-0.1px] whitespace-nowrap">1399</span>
          <span className="text-[#0f8857] text-[12px] font-semibold leading-4 tracking-[-0.1px] whitespace-nowrap">33%</span>
        </div>
        <div className="flex items-center gap-1">
          <img src={imgTruckIcon} alt="" style={{ width: 14, height: 14 }} />
          <span className="text-[#666d85] text-[12px] leading-4 tracking-[-0.1px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: 12 }}>Free Delivery</span>
        </div>
        <div className="relative" style={{ height: 16, width: 97 }}>
          <img src={product.soldByImg} alt="" className="absolute block w-full h-full max-w-none" style={{ inset: "0 2.06% 0 0" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NewHomepage() {
  const [, setActiveTab] = useState(0);

  const navItems = [
    { label: "Home", img: imgNavHome },
    { label: "Categories", img: imgNavCategories },
    { label: "Deals", img: imgNavDeals },
    { label: "Account", img: imgNavAccount },
    { label: "Cart", img: imgNavCart },
  ];

  const tabItems = [
    { label: "For you", img: imgTabForYou },
    { label: "Electronics", img: imgTabElec },
    { label: "Beauty", img: imgTabBeauty },
    { label: "Fashion", img: imgTabFashion },
    { label: "Home", img: imgTabHome2 },
    { label: "Beauty", img: imgTabBeauty },
  ];

  const skuProducts: SKUProduct[] = [
    { name: "Apple Airpods Pro 2 Wireless Earbuds", img: imgAirpods1, soldByImg: imgSoldByLogo1, badge: "Best Seller" },
    { name: "Whirlpool 7 kg Magic Clean", img: imgWhirlpool, soldByImg: imgSoldByLogo2, adTag: true },
    { name: "MAYNOS Suction Phone Case Mount", img: imgPhoneCase, soldByImg: imgSoldByLogo3 },
  ];

  const categoryRow1 = [
    { label: "Beauty & Skin Care", bg: imgBg, img1: imgCatBeauty1, img2: imgCatBeauty2, vec: true },
    { label: "Grocery \n& Kitchen", bg: imgBg1, img1: imgCatGrocery, img2: imgCatBeauty2 },
    { label: "Home Appliances", bg: imgBg2, img1: imgCatAppliance1, img2: imgCatAppliance2, sale: true },
    { label: "Beauty & Skin Care", bg: imgBg1, img1: imgCatBeauty1, img2: imgCatBeauty2 },
    { label: "Grocery \n& Kitchen", bg: imgBg1, img1: imgCatGrocery, img2: imgCatBeauty2 },
  ];
  const categoryRow2 = [
    { label: "Toys \n& Games", bg: imgBg1, img1: imgCatToys1, img2: imgCatToys2 },
    { label: "Electronics & Tools", bg: imgBg1, img1: imgCatTravel, img2: imgCatElec },
    { label: "Hair Care", bg: imgBg1, img1: imgCatHair1, img2: imgCatHair2 },
    { label: "Shoes & Clothes", bg: imgBg1, img1: imgCatShoes2, img2: imgCatShoes1 },
    { label: "Toys \n& Games", bg: imgBg1, img1: imgCatToys1, img2: imgCatToys2 },
  ];

  const keepItems = [
    { label: "Playstation 5", img: imgPs4Controller, viewed: "2 Viewed", w: 129, h: 67, x: "calc(50% - 2.5px)", y: "calc(50% + 7.1px)" },
    { label: "Adidas Rivalry", img: imgSneaker, viewed: "5 Viewed", w: 100, h: 100, x: 9, y: 16.6 },
    { label: "Body serum", img: imgSerum, viewed: "1 Viewed", w: 80, h: 82, x: "calc(50% - 2.78px)", y: "calc(50% + 3.53px)" },
  ];

  function MegaProductCard({ src }: { src: string }) {
    return (
      <div className="bg-white border-[0.5px] border-[#f2f3f7] flex-1 flex flex-col items-start overflow-hidden relative rounded-[12px] min-w-0">
        <div className="relative overflow-hidden rounded-[8px] shrink-0" style={{ width: 170.5, height: 223.333 }}>
          <div className="absolute overflow-hidden rounded-[6px]"
            style={{ width: 158.5, height: 211.333, left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "#2122b8" }}>
            <img src={src} alt="" className="absolute object-cover pointer-events-none"
              style={{ left: "50%", transform: "translateX(-50%)", top: "50%", marginTop: "-50%", width: "auto", aspectRatio: "1/1", height: "87.5%" }} />
          </div>
          <div className="absolute bg-[#9242f8] flex items-center rounded-br-[10px] rounded-tl-[6px] px-1.5 py-1 z-10" style={{ left: 6, top: 6 }}>
            <span className="text-white text-[12px] font-semibold leading-4 text-center tracking-[-0.1px] whitespace-nowrap">Video Game Deals</span>
          </div>
          <button className="absolute bg-white border-[1.2px] border-[#f2f3f7] flex items-center p-1 rounded-[8px] z-10" style={{ bottom: 12, right: 12 }}>
            <img src={imgMegaPlus} alt="" style={{ width: 24, height: 24 }} />
          </button>
        </div>
        <div className="flex flex-col gap-2 items-start pb-2.5 px-2 w-full">
          <p className="text-[#101628] leading-[18px] tracking-[-0.1px] overflow-hidden text-ellipsis w-full" style={{ fontSize: 14, fontWeight: 500, height: 36 }}>
            Apple Airpods Pro 2 Wireless Earbuds
          </p>
          <div className="flex gap-0.5 items-end whitespace-nowrap">
            <span className="text-[#101628] text-[18px] font-bold leading-6 tracking-[-0.15px]">dhm2,299</span>
            <span className="text-[#989fb3] text-[14px] leading-[18px] tracking-[-0.1px]">dhm3,499</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col bg-white overflow-hidden mx-auto" style={{ width: 375, height: "100vh" }}>

      {/* ── Address Header (375×260) ── */}
      <div className="relative overflow-hidden shrink-0 rounded-bl-[12px] rounded-br-[12px]"
        style={{ width: 375, height: 260, background: "linear-gradient(90deg,#fff 0%,#fff 100%)" }}>
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 375 260' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Cdefs%3E%3CradialGradient id='g' gradientUnits='userSpaceOnUse' cx='188' cy='-205.83' r='70.312'%3E%3Cstop stop-color='%23d4eff6' offset='.1'/%3E%3Cstop stop-color='%23dbe1f9' offset='.5'/%3E%3Cstop stop-color='%23ebf3f9' offset='.7'/%3E%3Cstop stop-color='%23b5e4f2' stop-opacity='.5' offset='.85'/%3E%3Cstop stop-color='%2380d5ea' stop-opacity='0' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E")` }} />

        {/* Status bar */}
        <div className="relative shrink-0" style={{ height: 42.565 }}>
          <p className="absolute text-[#1d2539] text-[15px] font-semibold text-center tracking-[-0.3px]" style={{ top: 7, left: 21, width: 54 }}>9:41</p>
          <div className="absolute flex items-center gap-1" style={{ right: 14.34, top: 17.33 }}>
            <div className="border border-black border-solid opacity-35 rounded-[2.667px]" style={{ width: 22, height: 11.333 }}>
              <div className="bg-black rounded-[1.333px]" style={{ width: 18, height: 7.333, marginTop: 1.333, marginLeft: 2 }} />
            </div>
          </div>
        </div>

        {/* App icon row */}
        <div className="flex gap-1.5 px-3 items-center overflow-x-auto scrollbar-none shrink-0" style={{ width: 592 }}>
          {/* noon – yellow active */}
          <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
            <div className="absolute inset-0 bg-[#feee00] rounded-[20px]" style={{ boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.04)" }} />
            <img src={imgMaskGroup} alt="noon" className="absolute" style={{ width: 39.5, height: 29.5, left: 19, top: 17 }} />
            <img src={imgGroup1437253079} alt="" className="absolute block" style={{ inset: "41.36% 16.93% 41.52% 17.11%" }} />
          </div>
          {/* super */}
          <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
            <div className="absolute inset-0 bg-white opacity-95 rounded-[20px]" />
            <img src={imgGroupSuper} alt="super" className="absolute block" style={{ inset: "28.2% 15.75% 27.06% 14.47%" }} />
          </div>
          {/* noon food */}
          <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
            <div className="absolute inset-0 bg-white rounded-[20px]" />
          </div>
          {/* mins */}
          <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
            <div className="absolute inset-0 bg-white rounded-[20px]" />
            <img src={imgMinsGif2} alt="mins" className="absolute object-cover pointer-events-none" style={{ width: 50, height: 50, left: "50%", top: "50%", transform: "translate(-50%,-50%) translate(0,0.43px)" }} />
          </div>
          {/* namshi */}
          <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
            <div className="absolute inset-0 bg-white opacity-95 rounded-[20px]" />
            <img src={imgImage17161} alt="namshi" className="absolute object-cover pointer-events-none" style={{ inset: "19.53% 30.14% 42.1% 29.91%" }} />
            <p className="absolute text-[#475067] font-bold text-center leading-[10px]" style={{ fontSize: 13, inset: "71.05% 19.18% 15.79% 19.18%" }}>Namshi</p>
          </div>
          {/* pay */}
          <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
            <div className="absolute inset-0 bg-white opacity-95 rounded-[20px]" />
            <div className="absolute rounded-[18.725px] overflow-hidden" style={{ inset: "19.53% 30.14% 42.1% 29.91%", backgroundImage: "linear-gradient(-89.99deg, rgb(70,89,217) 0.99%, rgb(85,35,221) 100%)" }}>
              <img src={imgIconSend} alt="" className="absolute block max-w-none" style={{ inset: "-47.73% -26.51% -40.88% -26.51%" }} />
            </div>
            <p className="absolute text-[#475067] font-bold text-center leading-[10px]" style={{ fontSize: 13, inset: "71.05% 35.62% 15.79% 34.25%" }}>Pay</p>
          </div>
        </div>

        {/* Address bar */}
        <div className="relative shrink-0 mt-3" style={{ height: 49, width: 375 }}>
          <div className="absolute" style={{ left: 16, top: 0, width: 283, height: 49 }}>
            <div className="flex flex-col items-start" style={{ width: 286 }}>
              <div className="flex items-start">
                <div className="overflow-hidden relative" style={{ width: 24, height: 24 }}>
                  <img src={imgHomIcon} alt="" className="absolute block max-w-none" style={{ width: "97.46%", height: "65.9%", left: "-0.75%", top: "17.58%" }} />
                </div>
                <p className="text-[#1d2539] text-[16px] font-semibold leading-6 overflow-hidden text-ellipsis whitespace-nowrap" style={{ textShadow: "0px 8.043px 16.086px rgba(0,0,0,0.07)", letterSpacing: 0 }}>
                  Home -&nbsp;
                </p>
              </div>
              <div className="flex items-center px-1 w-full">
                <p className="flex-1 text-[#343d54] leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap min-w-0" style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.1px", textShadow: "0px 8.043px 16.086px rgba(0,0,0,0.07)", height: 24 }}>
                  BDA Complex, 100 Feet Rd 3rd Block, Kora...
                </p>
                <div className="overflow-hidden relative shrink-0" style={{ width: 20, height: 20 }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div style={{ transform: "rotate(-90deg)" }}>
                      <img src={imgIconArrowDown} alt="" style={{ width: 4.021, height: 8.043 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute block" style={{ left: 323, top: 6.5, width: 36, height: 36 }}>
            <img src={imgFrame2147225910} alt="" className="absolute block inset-0 w-full h-full max-w-none" />
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-3 justify-center mt-3 px-4">
          <div className="flex items-center gap-3 bg-white border-[1.005px] border-[#d0d4dd] rounded-[12px] px-3 flex-1" style={{ height: 48, paddingTop: 16, paddingBottom: 16 }}>
            <div className="overflow-hidden relative shrink-0" style={{ width: 20, height: 20 }}>
              <img src={imgSearchPath} alt="" className="absolute block max-w-none" style={{ width: "17.472px", height: "17.472px", left: "50%", top: "50%", transform: "translate(calc(-50% - 0.17px), calc(-50% - 0.17px))" }} />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <p className="text-[#1d2539] font-medium whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: 15, letterSpacing: "-0.3016px", lineHeight: "19.102px" }}>
                Search for "Maybelline 1014"
              </p>
            </div>
            <div className="flex items-center justify-center" style={{ width: 0, height: 24 }}>
              <div style={{ transform: "rotate(90deg)" }}>
                <div style={{ width: 24, height: 0, borderTop: "1px solid #e0e0e0" }} />
              </div>
            </div>
            <div className="overflow-hidden relative shrink-0" style={{ width: 20, height: 20 }}>
              <img src={imgCameraVector} alt="" className="absolute block max-w-none" style={{ inset: "15.63% 9.38%", width: "auto", height: "auto" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto bg-white" style={{ paddingBottom: 96 }}>

        {/* ─ Section 1: Hero Banners + Cashback Pill ─ */}
        <div className="flex flex-col gap-4 pt-4">
          {/* Banners */}
          <div className="flex gap-2 items-center px-3 overflow-x-auto scrollbar-none">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-[20px] shrink-0 flex-none"
              style={{ width: 330, height: 150, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 330 150' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Cdefs%3E%3CradialGradient id='g' gradientUnits='userSpaceOnUse' cx='165' cy='149.92' r='84.979'%3E%3Cstop stop-color='%23fff1d2' offset='.38849'/%3E%3Cstop stop-color='%23fffef5' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E")` }}>
              <img src={imgImage350845} alt="" className="absolute object-cover pointer-events-none" style={{ width: 137.423, height: 173, left: -35.79, top: 10 }} />
              <img src={img379} alt="" className="absolute object-cover pointer-events-none" style={{ width: 51.433, height: 77.98, left: 31.29, top: 71.88 }} />
              <img src={img1601} alt="" className="absolute object-cover pointer-events-none" style={{ width: 105, height: 121, bottom: -4, left: 230 }} />
              <p className="absolute text-[#1d2539] font-medium text-center" style={{ fontSize: 6, lineHeight: "1.1", bottom: -14.63 + 10, left: "50%", transform: "translate(-50%,50%)", whiteSpace: "nowrap" }}>*T&C Apply</p>
              <div className="absolute flex flex-col items-center gap-1.5" style={{ width: 106, left: 112, top: "50%", transform: "translateY(-50%)" }}>
                <p className="text-[#1d2539] text-[12px] font-bold text-center leading-4 w-full tracking-[-0.1px]">Welcome! Earn</p>
                <p className="text-[rgba(0,0,0,0.08)] text-[32px] font-extrabold text-center leading-10 tracking-[-0.25px] w-full">dhm50</p>
                <p className="text-[#1d2539] text-[12px] text-center tracking-[-0.1px] leading-4">
                  <span className="font-bold">Cashback</span><br /><span style={{ fontWeight: 500 }}>on your first order</span>
                </p>
                <div className="bg-[#feee00] flex items-center justify-center px-2.5 rounded-[6px] w-full" style={{ height: 26 }}>
                  <p className="text-[#1d2539] font-bold text-center leading-4" style={{ fontSize: 10, width: 86 }}>Use Code: FREE50</p>
                </div>
              </div>
            </div>
            {/* Second banner */}
            <div className="relative overflow-hidden rounded-[20px] shrink-0 bg-white flex-none" style={{ width: 327.5, height: 147.081 }}>
              <img src={imgImage350853} alt="" className="absolute object-cover pointer-events-none" style={{ width: 350.586, height: 233.666, left: -18.63, bottom: -17.95 }} />
            </div>
          </div>

          {/* Cashback pill */}
          <div className="bg-white flex flex-col gap-0 items-center justify-center px-3 w-[375px] shrink-0">
            <div className="overflow-hidden relative rounded-[12px] shrink-0 w-full bg-white" style={{ height: 62 }}>
              <div className="absolute flex items-center justify-center" style={{ width: 122.117, height: 123.291, left: -26.49, top: -22.5 }}>
                <div style={{ transform: "rotate(-46.66deg)" }}>
                  <img src={imgImage350824} alt="" className="object-cover pointer-events-none" style={{ width: 101.128, height: 72.475 }} />
                </div>
              </div>
              <div className="absolute" style={{ left: -6.5, top: "50%", transform: "translateY(-50%) translateY(0.5px)", width: 12, height: 12 }}>
                <img src={imgEllipse1802} alt="" className="block w-full h-full" />
              </div>
              <div className="absolute" style={{ right: -5.5, top: "50%", transform: "translateY(-50%) translateY(0.5px)", width: 12, height: 12 }}>
                <img src={imgEllipse1802} alt="" className="block w-full h-full" />
              </div>
              <div className="absolute flex items-center justify-between" style={{ width: 274, left: "50%", top: "50%", transform: "translate(calc(-50% + 21.5px), calc(-50% - 0.09px))" }}>
                <div className="flex flex-col items-center gap-0.5" style={{ width: 189 }}>
                  <p className="text-[#1d2539] text-[20px] font-bold text-center leading-7 min-w-full tracking-[-0.25px]">10% cashback&nbsp;</p>
                  <p className="text-[#1d2539] text-[12px] font-medium text-center leading-4 tracking-[-0.1px] whitespace-nowrap">on every E-Commerce spends</p>
                </div>
                <div className="flex flex-col items-center gap-1" style={{ width: 22 }}>
                  <p className="text-[#1d2539] font-bold text-center tracking-[-0.26px] w-full leading-[1.2]" style={{ fontSize: 13 }}>1/5</p>
                  <div className="flex gap-1.5 items-center justify-center w-full">
                    {[imgEllipse24102, imgEllipse24103, imgEllipse24103].map((src, i) => (
                      <div key={i} className="relative shrink-0" style={{ width: 4, height: 4 }}>
                        <img src={src} alt="" className="absolute block inset-0 w-full h-full max-w-none" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─ Section 2: Shop by category ─ */}
        <div className="bg-white flex flex-col gap-4 items-center justify-center mt-4 w-[375px]">
          <div className="flex flex-col gap-0 items-start px-3.5 w-full">
            <p className="text-[#1d2539] text-[17px] font-bold leading-[22px] tracking-[-0.34px]" style={{ fontFeatureSettings: "'ss04' 1" }}>
              Shop by{" "}<span>category</span>
            </p>
          </div>
          <div className="flex flex-col gap-4 items-start pb-2 w-[375px]">
            {[categoryRow1, categoryRow2].map((row, ri) => (
              <div key={ri} className="flex gap-4 items-center px-4">
                {row.map((cat, ci) => (
                  <div key={ci} className="relative shrink-0" style={{ width: 92, height: 128 }}>
                    <div className="absolute top-0" style={{ left: "50%", transform: "translateX(-50%)", width: 92, height: 92 }}>
                      <img src={cat.bg} alt="" className="absolute block inset-0 w-full h-full max-w-none" />
                    </div>
                    {cat.sale && (
                      <div className="absolute rounded-bl-[5px] rounded-br-[5px] px-1 py-0.5" style={{ left: "50%", transform: "translateX(-50%)", top: 0, backgroundImage: "linear-gradient(128.67deg, #e11111 2.38%, #ff5959 90.81%)" }}>
                        <p className="text-white font-bold text-center tracking-[-0.1px]" style={{ fontSize: 11, lineHeight: "14px" }}>SALE</p>
                      </div>
                    )}
                    {ri === 0 && ci === 0 && (
                      <>
                        <div className="absolute flex items-center justify-center" style={{ width: 4.708, height: 5.947, left: 63.96, top: 0 }}>
                          <img src={imgCatVec1} alt="" style={{ width: 4.708, height: 5.947, transform: "scaleY(-1) rotate(180deg)" }} />
                        </div>
                        <div className="absolute" style={{ width: 4.895, height: 6.049, left: 22.76, top: 0 }}>
                          <img src={imgCatVec2} alt="" className="absolute block inset-0 w-full h-full max-w-none" />
                        </div>
                      </>
                    )}
                    <img src={cat.img1} alt="" className="absolute object-cover pointer-events-none" style={{ width: 66.302, height: 66.302, left: 3.21, top: 18.15, boxShadow: "-2.21px 17.68px 5.525px 0px rgba(0,0,0,0),-2.21px 11.05px 4.42px 0px rgba(0,0,0,0.02),-1.105px 6.63px 4.42px 0px rgba(0,0,0,0.06),0px 3.315px 3.315px 0px rgba(0,0,0,0.1),0px 1.105px 1.105px 0px rgba(0,0,0,0.12)" }} />
                    <img src={cat.img2} alt="" className="absolute object-cover pointer-events-none" style={{ width: 53.041, height: 53.041, left: 37.47, top: 28.31, boxShadow: "-34.256px 0px 9.945px 0px rgba(0,0,0,0),-22.101px 0px 8.84px 0px rgba(0,0,0,0.03),-12.155px 0px 7.735px 0px rgba(0,0,0,0.1),-5.525px 0px 5.525px 0px rgba(0,0,0,0.16),-1.105px 0px 3.315px 0px rgba(0,0,0,0.19)" }} />
                    <p className="absolute text-[#1d2539] text-[12px] font-semibold text-center leading-4 overflow-hidden text-ellipsis tracking-[-0.1px] whitespace-pre-wrap"
                      style={{ width: 92, left: "50%", transform: "translateX(-50%)", top: 96 }}>
                      {cat.label}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ─ Section 3: Recommended for you ─ */}
        <div className="flex flex-col gap-3 items-start mt-4">
          <div className="flex flex-col gap-0 items-start px-3.5 w-full">
            <p className="text-[#1d2539] text-[17px] font-bold leading-[22px] tracking-[-0.34px]" style={{ fontFeatureSettings: "'ss04' 1" }}>Recommended for you</p>
          </div>
          {/* Tab bar */}
          <div className="flex items-center overflow-x-auto pl-3 w-full scrollbar-none shrink-0">
            {tabItems.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`flex flex-col gap-1 items-center justify-center shrink-0 pb-3 pt-1 px-3 relative ${i !== 0 ? "border-b border-[#eaecf0]" : ""}`}
                style={{ minWidth: i === 0 ? 72 : i === 3 ? 70 : 66.129, background: i === 0 ? "linear-gradient(to bottom, #fff 25.534%, #e0efff 117.53%)" : undefined }}>
                <div className="overflow-hidden relative" style={{ width: 28, height: 28 }}>
                  <img src={tab.img} alt={tab.label} className="absolute block max-w-none" style={i === 0 ? { inset: "10.72% 12.6% 11.07% 12.5%" } : { inset: i === 1 ? "40.15% 11.64% 35.61% 78.4%" : i === 2 ? "10.71% 12.88% 10.73% 12.5%" : i === 3 ? "14.29% 10.54% 13.68% 10.71%" : "10.71% 11.3% 10.23% 10.71%" }} />
                </div>
                <p className="text-[12px] leading-4 overflow-hidden text-ellipsis tracking-[-0.1px] whitespace-nowrap max-h-[29.86px]"
                  style={{ fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "#0f61ff" : "#475067" }}>
                  {tab.label}
                </p>
                {i === 0 && <div className="absolute bottom-0 left-0 right-0 bg-[#1155cb] rounded-tl-[4.266px] rounded-tr-[4.266px]" style={{ height: 3.2 }} />}
              </button>
            ))}
          </div>
          {/* Products */}
          <div className="flex gap-3 items-start pt-4 px-3 overflow-x-auto w-[375px] scrollbar-none">
            {skuProducts.map((p, i) => <SkuCard key={i} product={p} />)}
          </div>
        </div>

        {/* ─ Section 4: Offers for you ─ */}
        <div className="bg-white flex flex-col gap-3 items-start mt-4 w-[375px]">
          <div className="flex flex-col gap-0 items-center w-[375px]">
            <div className="flex flex-col gap-0 items-start w-full">
              <div className="flex flex-col gap-0 items-start px-3.5 w-[376px]">
                <p className="text-[#1d2539] text-[17px] font-bold leading-[22px] tracking-[-0.34px]" style={{ fontFeatureSettings: "'ss04' 1" }}>Offers for you</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center px-3 overflow-x-auto w-full scrollbar-none">
            {/* Card 1: Cashback / teal */}
            {[
              { border: "#b73428", bg: "#4de0fd", title: " 10% Cashback ", sub: "on all spends with \nnoon ENBD card", cta: "Apply Now" },
              { border: "#15859b", bg: "#4de0fd", title: "Win dhm 100 ", sub: "Play & win \ninstant rewards", cta: "Play Now" },
              { border: "#830034", bg: "#d92626", title: " 10% Cashback ", sub: "on noon, supermall, food & minutes", cta: "Try Now" },
            ].map((card, i) => (
              <div key={i} className="bg-white flex items-start p-1 relative rounded-[24px] shrink-0" style={{ border: `2.5px solid ${card.border}`, height: 172 }}>
                <div className="flex flex-col gap-2 h-full items-center justify-center overflow-hidden p-2 relative rounded-[18px]" style={{ width: 122, background: card.bg }}>
                  {i === 0 && (
                    <div className="absolute flex items-center justify-center" style={{ width: 106.655, height: 83.47, left: "50%", top: 1.4, transform: "translateX(-50%)" }}>
                      <div style={{ transform: "rotate(19deg)" }}>
                        <div className="relative overflow-hidden" style={{ width: 93.487, height: 56.096 }}>
                          <img src={imgOfferCard} alt="" className="absolute object-cover pointer-events-none" style={{ height: "126.56%", width: "100.19%", top: "-19.92%", left: "-0.09%" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {i === 1 && (
                    <>
                      <p className="absolute text-transparent text-[34.146px] text-center tracking-[-0.6829px]"
                        style={{ backgroundImage: "linear-gradient(to bottom, #f8f7f2 62.789%, #ffeaa2 63.593%)", WebkitBackgroundClip: "text", backgroundClip: "text", fontFamily: "sans-serif", bottom: "64.87%", left: "50%", transform: "translateX(-50%)", width: 80.465, top: "14.33%" }}>
                        DASH
                      </p>
                      <p className="absolute text-[#feee00] text-[13.064px] text-center tracking-[0.3919px] whitespace-nowrap"
                        style={{ lineHeight: "0.86", left: 20.12, top: 20.91 }}>
                        DELIVERY
                      </p>
                    </>
                  )}
                  {i === 2 && (
                    <div className="absolute" style={{ inset: "9.12% 23.78% 66.37% 24.14%" }}>
                      <div className="absolute flex items-center justify-center" style={{ inset: 0 }}>
                        <div style={{ transform: "rotate(-5.23deg) skewX(-0.15deg)" }}>
                          <img src={imgOfferGroup} alt="" style={{ width: 60.471, height: 34.693 }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute flex flex-col items-center text-white text-center" style={{ left: 10.34, top: 67 }}>
                    <p className="text-[14px] font-bold leading-[18px] tracking-[-0.1px] whitespace-nowrap">{card.title}</p>
                    <p className="text-[11px] leading-[14px] tracking-[-0.1px] whitespace-pre-wrap" style={{ width: 101.318 }}>{card.sub}</p>
                  </div>
                  <div className="absolute" style={{ width: 124, height: 0, left: "50%", top: 133, transform: "translateX(-50%)" }}>
                    <img src={imgOfferLine} alt="" className="absolute block w-full" style={{ inset: "-1px 0 0 0" }} />
                  </div>
                  <div className="absolute flex items-center justify-center gap-0 rounded-[6px]" style={{ left: "50%", top: 141, transform: "translateX(-50%)" }}>
                    <p className="text-white text-[12px] font-semibold leading-4 tracking-[-0.1px] w-full">{card.cta}</p>
                    <div className="overflow-hidden relative" style={{ width: 12, height: 12 }}>
                      <img src={imgOfferArrow} alt="" className="absolute block" style={{ inset: "17.19% 27.08% 17.19% 35.42%" }} />
                    </div>
                  </div>
                </div>
                {[{ left: i === 2 ? 116.5 : 118.5 }, { left: -9.5 }].map((hole, hi) => (
                  <div key={hi} className="absolute" style={{ width: 18.134, height: 18.134, left: hole.left, top: "50%", transform: "translateY(calc(-50% + 50px))" }}>
                    <img src={imgEllipse1802} alt="" className="absolute block inset-0 w-full h-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ─ Section 5: Mega Deals (dark bg) ─ */}
        <div className="relative mt-4" style={{ width: 375, height: 667, backgroundImage: "linear-gradient(90.315deg, #111111 0.448%, #414755 51.395%, #111111 99.485%)" }}>
          {/* Inner light panel */}
          <div className="absolute overflow-hidden" style={{ background: "#edeefd", width: 375, height: 760, left: 0, top: 0 }}>
            {/* Header */}
            <div className="absolute flex items-center justify-between left-0 right-0 pr-3" style={{ top: 12 }}>
              <div className="px-3.5">
                <p className="text-[#1d2539] text-[17px] font-bold leading-[22px] text-center tracking-[-0.34px] whitespace-nowrap" style={{ fontFeatureSettings: "'ss04' 1" }}>Mega Deals</p>
              </div>
              <div className="flex items-center justify-center rounded-[10px]" style={{ height: 16 }}>
                <p className="text-[rgba(0,0,0,0.08)] text-[14px] font-semibold leading-[18px] tracking-[-0.1px] w-full">View all</p>
                <div className="overflow-hidden relative" style={{ width: 16.086, height: 16.086 }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div style={{ transform: "rotate(180deg)" }}>
                      <img src={imgNavArrow} alt="" style={{ width: 4.021, height: 8.043 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 2×2 product grid */}
            <div className="absolute flex flex-col gap-2.5 items-start px-3 py-4"
              style={{ bottom: 93.33, left: "50%", transform: "translateX(-50%)", width: 375 }}>
              {[[imgMegaAirpods1, imgMegaAirpods2], [imgMegaAirpods1, imgMegaAirpods2]].map((row, ri) => (
                <div key={ri} className="flex gap-2.5 items-center w-full">
                  {row.map((src, ci) => (
                    <div key={ci} className="bg-white border-[0.5px] border-[#f2f3f7] flex-1 flex flex-col items-start overflow-hidden relative rounded-[12px]">
                      <div className="relative shrink-0 overflow-hidden rounded-[8px]" style={{ width: 170.5, height: 223.333 }}>
                        <div className="absolute overflow-hidden rounded-[6px]"
                          style={{ width: 158.5, height: 211.333, left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "#2122b8" }}>
                          <img src={src} alt="" className="absolute object-cover pointer-events-none"
                            style={{ left: "50%", transform: "translateX(-50%)", bottom: "6.25%", top: "6.25%", height: "87.5%", width: "auto", aspectRatio: "1" }} />
                        </div>
                        <div className="absolute bg-[#9242f8] flex items-center px-1.5 py-1 rounded-br-[10px] rounded-tl-[6px] z-10" style={{ left: 6, top: 6 }}>
                          <span className="text-white text-[12px] font-semibold leading-4 text-center tracking-[-0.1px] whitespace-nowrap">Video Game Deals</span>
                        </div>
                        <button className="absolute bg-white border-[1.2px] border-[#f2f3f7] flex items-center p-1 rounded-[8px] z-10" style={{ bottom: 12, right: 12 }}>
                          <img src={imgMegaPlus} alt="" style={{ width: 24, height: 24 }} />
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 items-start pb-2.5 px-2 w-full">
                        <p className="text-[#101628] leading-[18px] tracking-[-0.1px] overflow-hidden text-ellipsis w-full" style={{ fontSize: 14, fontWeight: 500, height: 36 }}>
                          Apple Airpods Pro 2 Wireless Earbuds
                        </p>
                        <div className="flex gap-0.5 items-end whitespace-nowrap">
                          <span className="text-[#101628] text-[18px] font-bold leading-6 tracking-[-0.15px]">dhm2,299</span>
                          <span className="text-[#989fb3] text-[14px] leading-[18px] tracking-[-0.1px]">dhm3,499</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Timer chip */}
          <div className="absolute" style={{ width: 138.773, height: 35, left: "50%", top: 0, transform: "translateX(-50%)" }}>
            <div className="absolute rounded-bl-[12px] rounded-br-[12px] overflow-hidden bg-[#101628]"
              style={{ width: 118.232, height: 35, left: "50%", transform: "translateX(-50%)" }}>
              <div className="absolute flex gap-1 items-center" style={{ left: "50%", top: 8, transform: "translateX(-50%)" }}>
                <img src={imgHourglass} alt="" style={{ width: 15, height: 15 }} />
                <p className="text-white whitespace-nowrap" style={{ fontSize: 14, lineHeight: "18px" }}>
                  <span style={{ fontWeight: 700 }}>15</span>
                  <span style={{ fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>h</span>
                  <span style={{ fontWeight: 700 }}>{" : 30"}</span>
                  <span style={{ fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>m</span>
                </p>
              </div>
            </div>
            <img src={imgTimerVec1} alt="" className="absolute block" style={{ width: 10.38, height: 14.017, left: 128.39, top: 0 }} />
            <div className="absolute flex items-center justify-center" style={{ width: 10.38, height: 14.011, left: 0, top: 0 }}>
              <img src={imgTimerVec2} alt="" style={{ width: 10.38, height: 14.011, transform: "scaleY(-1) rotate(180deg)" }} />
            </div>
          </div>
        </div>

        {/* ─ Section 6: Bestsellers ─ */}
        <div className="flex flex-col gap-3 items-start mt-4">
          <div className="flex flex-col gap-0 items-start w-[375px]">
            <div className="flex flex-col gap-0 items-start px-3.5 w-[376px]">
              <p className="text-[#1d2539] text-[17px] font-bold leading-[22px] tracking-[-0.34px] whitespace-nowrap" style={{ fontFeatureSettings: "'ss04' 1" }}>Bestsellers&nbsp;</p>
            </div>
          </div>
          <div className="flex gap-3 items-start px-3 overflow-x-auto w-[375px] scrollbar-none">
            {skuProducts.map((p, i) => <SkuCard key={i} product={p} />)}
          </div>
        </div>

        {/* ─ Section 7: Keep shopping for ─ */}
        <div className="flex flex-col gap-3 items-start mt-4 px-3">
          <div className="flex flex-col gap-0 items-start px-0.5">
            <p className="text-[#1d2539] text-[17px] font-bold leading-[22px] tracking-[-0.34px]" style={{ fontFeatureSettings: "'ss04' 1" }}>Keep shopping for</p>
          </div>
          <div className="flex gap-3 items-center overflow-x-auto w-full scrollbar-none">
            {keepItems.map((item, i) => (
              <div key={i} className="flex flex-col gap-2 items-start justify-center shrink-0" style={{ minWidth: 96 }}>
                <div className="bg-[#f9f9fb] border border-[#f2f3f7] relative rounded-[12px] overflow-hidden shrink-0" style={{ width: 114, height: 130 }}>
                  <img src={item.img} alt={item.label} className="absolute object-cover pointer-events-none"
                    style={{ width: item.w, height: item.h, left: item.x, top: item.y, transform: typeof item.x === "string" ? "translate(-50%,-50%)" : undefined }} />
                </div>
                <div className="flex flex-col gap-1 items-start px-0.5 w-full">
                  <div className="flex gap-0.5 items-center w-full">
                    <div className="overflow-hidden relative shrink-0" style={{ width: 14, height: 14 }}>
                      <img src={imgKeepSearchIcon} alt="" className="absolute block" style={{ width: 10.483, height: 10.483, left: "50%", top: "50%", transform: "translate(-50%,-50%) translate(-0.1px,-0.1px)" }} />
                    </div>
                    <p className="text-[#1d2539] leading-[18px] overflow-hidden text-ellipsis tracking-[-0.1px] min-w-0 flex-1" style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
                  </div>
                  <div className="bg-[#f2f3f7] flex gap-1 items-center pl-1 pr-0.5 py-0.5 rounded shrink-0">
                    <p className="text-[#0f7eff] text-[12px] font-medium leading-4 tracking-[-0.1px] whitespace-nowrap">{item.viewed}</p>
                    <div className="flex items-center justify-center shrink-0" style={{ width: 12, height: 12 }}>
                      <div style={{ transform: "rotate(-90deg)" }}>
                        <img src={imgKeepArrow} alt="" style={{ width: 12, height: 12 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─ Section 8: Summer Essentials (dark) ─ */}
        <div className="relative mt-4" style={{ width: 375, height: 418, backgroundImage: "linear-gradient(90.5deg, #111111 0.448%, #414755 51.395%, #111111 99.485%)" }}>
          <div className="absolute flex flex-col gap-6 items-start" style={{ left: 16, top: 24, width: 343 }}>
            <div className="flex items-center justify-between" style={{ width: 343 }}>
              <div className="flex flex-col items-start text-white" style={{ width: 211 }}>
                <p className="text-white font-bold leading-5 tracking-[-0.15px]" style={{ fontSize: 16 }}>SUMMER ESSENTIALS</p>
                <p className="text-white leading-4 tracking-[-0.1px] whitespace-nowrap" style={{ fontSize: 12 }}>Enjoy extra 30% off with no min. spend.</p>
              </div>
              <div className="relative" style={{ width: 56, height: 20 }}>
                <img src={imgSummerBadge} alt="" className="absolute inset-0 object-cover pointer-events-none w-full h-full" />
              </div>
            </div>
            <div className="flex gap-3 items-center w-full">
              <div className="overflow-hidden relative rounded-[8px] shrink-0" style={{ width: 134, height: 308 }}>
                <img src={imgSummerVideo} alt="" className="absolute object-cover pointer-events-none" style={{ width: 200, height: 310, left: -7, top: 0.17 }} />
              </div>
              <div className="flex gap-3 items-start overflow-x-auto scrollbar-none" style={{ width: 375 }}>
                {skuProducts.map((p, i) => <SkuCard key={i} product={p} />)}
              </div>
            </div>
          </div>
        </div>

        {/* ─ Section 9: Selling out fast ─ */}
        <div className="flex flex-col gap-0 items-center mt-4" style={{ width: 375 }}>
          <div className="flex flex-col gap-0 items-start w-full">
            <div className="flex flex-col gap-0 items-start px-3.5 w-[376px]">
              <p className="text-[#1d2539] text-[17px] font-bold leading-[22px] tracking-[-0.34px] whitespace-nowrap" style={{ fontFeatureSettings: "'ss04' 1" }}>Selling out fast</p>
            </div>
          </div>
          <div className="flex gap-3 items-start pt-3 px-3 overflow-x-auto w-[375px] scrollbar-none">
            {skuProducts.map((p, i) => <SkuCard key={i} product={p} />)}
          </div>
        </div>

        {/* ─ Section 10: New Launches ─ */}
        <div className="flex gap-0 items-center px-3 mt-4">
          <div className="bg-[#101628] relative rounded-[20px] shrink-0 overflow-hidden" style={{ width: 351, height: 420 }}>
            <p className="absolute text-[#989fb3] whitespace-nowrap" style={{ fontSize: 16, fontWeight: 100, left: 16.27, top: 53.34, transform: "translateY(-50%)", lineHeight: "1" }}>
              Now available on noon
            </p>
            <p className="absolute text-white whitespace-nowrap" style={{ fontSize: 20, fontWeight: 500, left: 16.27, top: 28.94, transform: "translateY(-50%)", letterSpacing: "-0.5px", lineHeight: "1" }}>
              NEW <span style={{ color: "#e5ff43" }}>LAUNCHES</span>
            </p>
            <div className="absolute flex gap-3.5 items-center overflow-x-auto scrollbar-none" style={{ left: 14, top: 44.5, width: 337, height: 392, paddingTop: 10 }}>
              {[
                { title: "The best Playstation!", desc: "Limitless entertainment with the new Playstation 5 Pro", cta: "Shop Now" },
                { title: "Ready to game on?", desc: "Limitless entertainment with the new Playstation 5 Pro", cta: "Shop Now" },
              ].map((card, i) => (
                <div key={i} className="bg-white border border-[#eaecf0] flex flex-col items-start p-3 relative rounded-[12px] shrink-0" style={{ width: 213, height: 327 }}>
                  <div className="relative shrink-0" style={{ width: 187, height: 187 }}>
                    <img src={imgPs5Card} alt="" className="absolute inset-0 object-cover pointer-events-none w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <div className="flex flex-col gap-1 items-start">
                      <p className="text-[#101628] font-semibold leading-5 tracking-[-0.15px] whitespace-nowrap" style={{ fontSize: 16 }}>{card.title}</p>
                      <p className="text-[#1d2539] leading-[18px] tracking-[-0.1px]" style={{ fontSize: 14, width: 189 }}>{card.desc}</p>
                    </div>
                    <div className="flex flex-col gap-0 items-start justify-center" style={{ width: 189 }}>
                      <div className="flex items-center justify-center rounded-[10px] w-full" style={{ background: "rgba(0,0,0,0.8)", height: 48 }}>
                        <p className="text-white font-medium leading-5 text-center capitalize whitespace-nowrap" style={{ fontSize: 15 }}>{card.cta}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div className="fixed bottom-0 bg-white flex flex-col gap-2 items-start"
        style={{ width: 375, left: "50%", transform: "translateX(-50%)", filter: "drop-shadow(0px -1px 1px rgba(0,0,0,0.05))" }}>
        <div className="flex gap-1 items-center justify-center w-full" style={{ height: 63 }}>
          {navItems.map((item, i) => (
            <div key={i} className="flex flex-col gap-2 h-full items-center shrink-0">
              {i === 0 ? (
                <div className="relative shrink-0" style={{ height: 4, width: 43 }}>
                  <img src={imgNavActiveBar} alt="" className="absolute block inset-0 w-full h-full max-w-none" />
                </div>
              ) : (
                <div className="bg-white rounded-bl-[8px] rounded-br-[7px] shrink-0" style={{ height: 4, width: 56 }} />
              )}
              <div className="flex flex-1 flex-col items-center justify-center" style={{ width: 67, minHeight: 0 }}>
                <div className="relative shrink-0" style={{ width: 32, height: 32 }}>
                  <img src={item.img} alt={item.label} className="absolute block inset-0 w-full h-full max-w-none" />
                </div>
                <p className="text-[12px] leading-4 tracking-[-0.1px] whitespace-nowrap"
                  style={{ fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "#0f61ff" : "#475067" }}>
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Home bar */}
        <div className="bg-white flex flex-col items-center justify-center pb-2 pt-3 w-full">
          <div className="bg-[#343d54] rounded-[8px]" style={{ height: 5, width: 124 }} />
        </div>
      </div>
    </div>
  );
}
