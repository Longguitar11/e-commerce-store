import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: "No active coupon found" });
        }
        res.json({ coupon });
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code, isActive: true, userId: req.user._id });
        if (!coupon) {
            return res.status(404).json({ message: "Invalid or expired coupon" });
        }

        if (coupon.expiryDate < Date.now()) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

        res.json({ message: "Coupon is valid", data: { code: coupon.code, discount: coupon.discount } });

    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}