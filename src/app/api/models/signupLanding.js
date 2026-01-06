import mongoose from 'mongoose';

const SignupLandingSchema = new mongoose.Schema(
    {
    selectOne: {
        type: String,
        required: true,
        enum: ['SelectOne', 'Permanent Resident', 'Work permit', 'Student Visa', 'Citizen'],
        unique: true,
    },

    },{timestamps: true},
);        
const SignupLanding = mongoose.models.SignupLanding || mongoose.model('SignupLanding', SignupLandingSchema);

export default SignupLanding;