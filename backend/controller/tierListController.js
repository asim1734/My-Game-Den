const TierList = require('../models/TierList');

exports.createTierList = async (req, res) => {
    try {
        const { title, category } = req.body;
        
        const newList = new TierList({
            user: req.user.id,
            title: title || "Untitled Tier List",
            category: category || "Games"
        });

        const savedList = await newList.save();
        res.status(201).json(savedList);
    } catch (error) {
        console.error("Create Tier List Error:", error);
        res.status(500).json({ message: "Failed to create tier list" });
    }
};

exports.getTierListBySlug = async (req, res) => {
    try {
        const list = await TierList.findOne({ slug: req.params.slug })
            .populate('user', 'username avatar');

        if (!list) return res.status(404).json({ message: "Tier list not found" });

        if (!list.isPublic) {
            
            if (!req.user || list.user._id.toString() !== req.user.id) {
                return res.status(403).json({ message: "This tier list is private." });
            }
        }

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tier list" });
    }
};

exports.updateTierList = async (req, res) => {
    try {
        const { id } = req.params;
        const { tiers, unrankedPool, title, description, isPublic, category } = req.body;

        const updatedList = await TierList.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { 
                $set: { 
                    tiers, 
                    unrankedPool, 
                    title, 
                    description, 
                    isPublic, 
                    category 
                } 
            },
            { new: true, runValidators: true }
        );

        if (!updatedList) {
            return res.status(403).json({ 
                message: "You do not have permission to edit this list or it does not exist." 
            });
        }

        res.status(200).json(updatedList);
    } catch (error) {
        console.error("Update Tier List Error:", error);
        res.status(500).json({ message: "Failed to save tier list" });
    }
};

exports.getMyTierLists = async (req, res) => {
    try {
        const lists = await TierList.find({ user: req.user.id }).sort({ updatedAt: -1 });
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your lists" });
    }
};

exports.deleteTierList = async (req, res) => {
    try {
        const list = await TierList.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        
        if (!list) {
            return res.status(403).json({ message: "Permission denied or list not found" });
        }

        res.status(200).json({ message: "Tier list deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting tier list" });
    }
};