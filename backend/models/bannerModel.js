import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

// Banner Schema
const bannerSchema = mongoose.Schema(
  {
    // ব্যানারের নাম (অ্যাডমিনের জন্য)
    name: {
      type: String,
      required: true,
    },

    // ব্যানারের ধরন
    type: {
      type: String,
      enum: [
        "hero", // মেইন স্লাইডার
        "category", // ক্যাটাগরি ব্যানার
        "promotional", // প্রমোশনাল/অফার ব্যানার
        "sidebar", // সাইডবার ব্যানার
        "popup", // পপ-আপ ব্যানার
        "footer", // ফুটার ব্যানার
        "top-bar", // টপ বার অ্যানাউন্সমেন্ট
        "middle", // মিডল ব্যানার
      ],
      required: true,
    },

    buttonType: {
      type: String,
      enum: [
        "default", // সাধারণ Shop Now
        "weekend-deal", // Weekend Deal
        "flash-sale", // Flash Sale
        "big-sale", // Big Sale
        "limited-offer", // Limited Offer
        "special-offer", // Special Offer
        "clearance", // Clearance Sale
        "new-arrival", // New Arrival
        "best-seller", // Best Seller
        "trending-now", // Trending Now
        "hot-deal", // Hot Deal
        "mega-sale", // Mega Sale
        "seasonal-offer", // Seasonal Offer
        "exclusive", // Exclusive
        "last-chance", // Last Chance
        "doorbuster", // Doorbuster
        "early-bird", // Early Bird
        "member-exclusive", // Member Exclusive
        "bundle-deal", // Bundle Deal
        "buy-one-get-one", // Buy 1 Get 1
      ],
      default: "default",
    },

    // ব্যানারের শিরোনাম
    headline: {
      type: String,
      required: true,
    },

    // সাব-শিরোনাম
    subHeadline: {
      type: String,
      default: "",
    },

    // ব্যানার ইমেজ
    image: {
      type: String,
      required: true,
    },

    // মোবাইল ভার্সনের ইমেজ (ঐচ্ছিক)
    mobileImage: {
      type: String,
      default: "",
    },

    // বাটন টেক্সট
    buttonText: {
      type: String,
      default: "Shop Now",
    },

    // লিংক (ক্লিক করলে কোথায় যাবে)
    link: {
      type: String,
      default: "",
    },

    // প্রোডাক্ট লিংক (যদি নির্দিষ্ট প্রোডাক্টে যেতে চায়)
    product: {
      type: ObjectId,
      ref: "Product",
      default: null,
    },

    // ক্যাটাগরি লিংক (যদি নির্দিষ্ট ক্যাটাগরিতে যেতে চায়)
    category: {
      type: ObjectId,
      ref: "Category",
      default: null,
    },

    // ব্যানারের অবস্থান (পজিশন)
    position: {
      type: Number,
      default: 0,
    },

    // ব্যাকগ্রাউন্ড কালার
    backgroundColor: {
      type: String,
      default: "#ffffff",
    },

    // টেক্সট কালার
    textColor: {
      type: String,
      default: "#000000",
    },

    // বাটন কালার
    buttonColor: {
      type: String,
      default: "#ff6b6b",
    },

    // বাটন টেক্সট কালার
    buttonTextColor: {
      type: String,
      default: "#ffffff",
    },

    // স্টার্ট ডেট (কখন থেকে দেখাবে)
    startDate: {
      type: Date,
      default: Date.now,
    },

    // এন্ড ডেট (কখন পর্যন্ত দেখাবে)
    endDate: {
      type: Date,
      default: null,
    },

    // সক্রিয় আছে কিনা
    isActive: {
      type: Boolean,
      default: true,
    },

    // পপ-আপ ব্যানারের জন্য বিশেষ সেটিংস
    popupSettings: {
      // কত সেকেন্ড পর দেখাবে
      delay: {
        type: Number,
        default: 5,
      },
      // কত ঘন্টা পর আবার দেখাবে
      showAgainAfter: {
        type: Number,
        default: 24,
      },
      // কুপন কোড (যদি থাকে)
      couponCode: {
        type: String,
        default: "",
      },
      // ডিসকাউন্ট পরিমাণ
      discountAmount: {
        type: Number,
        default: 0,
      },
    },

    // অফার ব্যানারের জন্য বিশেষ সেটিংস
    offerSettings: {
      // অফার টাইপ
      offerType: {
        type: String,
        enum: ["percentage", "fixed", "bogo", "free-shipping"],
        default: "percentage",
      },
      // অফার ভ্যালু
      offerValue: {
        type: Number,
        default: 0,
      },
      // লিমিটেড টাইম অফার
      isLimitedTime: {
        type: Boolean,
        default: false,
      },
      // কাউন্টডাউন টাইমার
      countdownEndTime: {
        type: Date,
        default: null,
      },
    },

    // ডিসপ্লে পেজ (কোন পেজে দেখাবে)
    displayPages: [
      {
        type: String,
        enum: ["home", "category", "product", "cart", "checkout", "all"],
        default: "all",
      },
    ],

    // ডিভাইস টাইপ (কোন ডিভাইসে দেখাবে)
    displayOn: {
      desktop: {
        type: Boolean,
        default: true,
      },
      mobile: {
        type: Boolean,
        default: true,
      },
      tablet: {
        type: Boolean,
        default: true,
      },
    },

    // ক্লিক সংখ্যা
    clicks: {
      type: Number,
      default: 0,
    },

    // ইমপ্রেশন সংখ্যা
    impressions: {
      type: Number,
      default: 0,
    },

    // অতিরিক্ত তথ্য
    metaData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

// ইন্ডেক্স তৈরি
bannerSchema.index({ type: 1, isActive: 1 });
bannerSchema.index({ position: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

// Creating Banner Model
const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
