import mongoose from "mongoose";

const landlordDashboardSchema = new mongoose.Schema(
  {
    sidebar: {
      menuItems: [
        {
          dashboard: {
            type: String,
            route: { type: String, required: true },
            ref: "Dashboard",
          },
          helpCenter: {
            type: String,
            route: { type: String, required: true },
            ref: "helpCenter",
          },
          savedHomes: {
            type: String,
            route: { type: String, required: true },
            ref: "savedHomes",
          },
          message: {
            type: String,
            route: { type: String, required: true },
            icon: { type: String },
            notification: { type: Boolean, default: false },
            ref: "Message",
          },
          property: {
            type: String,
            route: { type: String, required: true },
            ref: "Property",
          },
          verfication: {
            type: String,
            route: { type: String, required: true },
            ref: "Verfication",
          },
          homeInterest: {
            type: String,
            route: { type: String, required: true },
            icon: { type: String },
            notification: { type: Boolean, default: false },
            ref: "HomeInterest",
          },
        },
      ],
    },
    mainContent: {
      sectionTitle: { type: String, required: true },
      desc: { type: String },

      cards: [
        {
          kyc: { type: String, required: true },
          desc: { type: String },
          action: {
            label: { type: String, required: true },
            route: { type: String, required: true },
          },
          ref: "KYC",
        },
        {
          property: { type: String, required: true },
          desc: { type: String },
          action: {
            label: { type: String, required: true },
            route: { type: String, required: true },
          },
        },
        {
          addressVerification: { type: String, required: true },
          desc: { type: String },
          action: {
            label: { type: String, required: true },
            route: { type: String, required: true },
          },
        },
        {
          profilePicture: { type: String, required: true },
          desc: { type: String },
          action: {
            label: { type: String, required: true },
            route: { type: String, required: true },
          },
        },
        {
          accountDetails: { type: String, required: true },
          desc: { type: String },
          action: {
            label: { type: String, required: true },
            route: { type: String, required: true },
          },
        },
      ],
    },

    landlords: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
    ],
    landlordKyc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandlordKyc",
      required: false,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
        required: false,
      },
    ],
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        default: [],
        required: false,
      },
    ],
    savedHomes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavedHomes",
        default: [],
        required: false,
      },
    ],
    addressVerification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddressVerification",
    },
    homeInterests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HomeInterest",
        default: [],
        required: false,
      },
    ],

    //Pending Schemas
    payments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: false },
    ],
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const LandlordDashboard = mongoose.model(
  "LandlordDashboard",
  landlordDashboardSchema
);
export default LandlordDashboard;
