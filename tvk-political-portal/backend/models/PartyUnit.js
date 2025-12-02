import mongoose from 'mongoose';

const PartyUnitSchema = new mongoose.Schema({
    // Tamil name for the unit (e.g., Union name)
    nameTa: {
        type: String,
        required: true,
        trim: true
    },
    // Type of the unit (union, village, ward, booth)
    type: {
        type: String,
        required: true,
        enum: ['union', 'village', 'ward', 'booth'],
        lowercase: true,
        trim: true
    },
    // ID of the parent unit (null for 'union')
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartyUnit',
        default: null
    },
    // Person's name (பொறுப்பாளர் பெயர்)
    person: {
        type: String,
        trim: true
    },
    // Role (பதவி)
    roleTa: {
        type: String,
        trim: true
    },
    // Phone number (தொடர்புக்கு)
    phone: {
        type: String,
        trim: true
    },
    // Base64 or URL for the person's photo
    photo: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const PartyUnit = mongoose.model('PartyUnit', PartyUnitSchema);
export default PartyUnit;