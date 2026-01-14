const mongoose = require('mongoose');

const TierGameSchema = new mongoose.Schema({
    igdbId: { type: String, required: true },
    title: { type: String, required: true },
    coverUrl: { type: String },
});

const TierRowSchema = new mongoose.Schema({
    label: { type: String, default: 'New Tier' },
    color: { type: String, default: '#ff7f7f' }, 
    games: [TierGameSchema] 
});

const TierListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'Untitled Tier List'
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['Games', 'Characters', 'Series', 'Other'],
        default: 'Games'
    },

    tiers: {
        type: [TierRowSchema],
        default: [
            { label: 'S', color: '#ff7f7f', games: [] },
            { label: 'A', color: '#ffbf7f', games: [] },
            { label: 'B', color: '#ffff7f', games: [] },
            { label: 'C', color: '#7fff7f', games: [] },
            { label: 'D', color: '#7fbfff', games: [] }
        ]
    },
    unrankedPool: [TierGameSchema],
    
    isPublic: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true
    }
}, { timestamps: true });

TierListSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
    next();
});

module.exports = mongoose.model('TierList', TierListSchema);