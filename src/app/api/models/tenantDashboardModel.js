import property from "@/data/property";
import mongoose from "mongoose";

const tenantDashboardSchema = new mongoose.Schema({
sidebar: {
    menuItems: [{
        dashboard: { 
            type: String,
            route: { type: String, required: true },
            ref: 'Dashboard' 
        },
        helpCenter: { 
            type: String,
            route: { type: String, required: true },
            ref: 'helpCenter' 
        },
            savedHomes: { 
            type: String,
            route: { type: String, required: true },
            ref: 'savedHomes' 
        },
            messages: { 
            type: String,
            route: { type: String, required: true },
            notification: { type: Boolean, default: false },
            ref: 'Messages' 
        },
            property: { 
            type: String,
            route: { type: String, required: true },
            ref: 'Property' 
        },
            verfication: { 
            type: String,
            route: { type: String, required: true },
            ref: 'Verfication' 
        },
        homeInterest: { 
            type: String,
            route: { type: String, required: true },
            icon: { type: String }, // optional
            notification: { type: Boolean, default: false },
            ref: 'HomeInterest'
        }
    }]
},
mainContent: {
    sectionTitle: {type: String, required: true }, desc: { type: String},

    cards: [
        {
            kyc: { type: String, required: true },
            desc: { type: String },
            action: {
                label: { type: String, required: true },
                route: { type: String, required: true }
            }
        },
        {
            property: { type: String, required: true },
            desc: { type: String },
            action: {
                label: { type: String, required: true },
                route: { type: String, required: true }
            }
        },
        {
            addressVerification: { type: String, required: true },
            desc: { type: String },
            action: {
                label: { type: String, required: true },
                route: { type: String, required: true }
            }
        },
        {
            profilePic: { type: String, required: true },
            desc: { type: String },
            action: {
            label: { type: String, required: true },
            route: { type: String, required: true }
            }
        },
        {
            title: { type: String, required: true },
            desc: { type: String },
            action: {
            label: { type: String, required: true },
            route: { type: String, required: true }
        }
    }]
},
    tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tenant"}],
    tenantKyc: { type: mongoose.Schema.Types.ObjectId, enum: ['Pending', 'Approved', 'Rejected'], ref: "LandlordKyc", required: false},
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message", default: [], required: false }],
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property", default: [], required: false}],
    savedHomes: [{ type: mongoose.Schema.Types.ObjectId, ref: "SavedHomes", default: [], required: false}],
    addressVerification: { type: mongoose.Schema.Types.ObjectId, ref: "AddressVerification"},    
    homeInterests: [{ type: mongoose.Schema.Types.ObjectId, ref: "HomeInterest", default: [], required: false }],
    
}, { timestamps: true });

const TenantDashboard = mongoose.model("tenantDashboard", tenantDashboardSchema);
export default TenantDashboard;