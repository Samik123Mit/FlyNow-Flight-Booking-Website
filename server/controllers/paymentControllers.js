const dotenv = require("dotenv");
dotenv.config();

const crypto = require("crypto");
const User = require("../model/User.model");
const Flight = require("../model/Flight.model");
const Payment = require("../model/Payment.model");

let instance = null;

// Initialize Razorpay ONLY if keys exist
if (process.env.RAZOR_KEY && process.env.RAZOR_SECRET) {
    const Razorpay = require("razorpay");
    instance = new Razorpay({
        key_id: process.env.RAZOR_KEY,
        key_secret: process.env.RAZOR_SECRET,
    });
    console.log("Razorpay enabled");
} else {
    console.log("Razorpay disabled (no keys provided)");
}

// Send key to frontend
const sendkey = async (req, res) => {
    if (!process.env.RAZOR_KEY) {
        return res.status(503).json({ message: "Payments disabled in demo" });
    }
    return res.status(200).json({ key: process.env.RAZOR_KEY });
};

// Create order
const checkout = async (req, res) => {
    if (!instance) {
        return res.status(503).json({ message: "Payments disabled in demo" });
    }

    try {
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };

        const order = await instance.orders.create(options);
        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Payment error" });
    }
};

// Verify payment
const paymentVerification = async (req, res) => {
    if (!process.env.RAZOR_SECRET) {
        return res.status(503).json({ message: "Payments disabled in demo" });
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body.response;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZOR_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false });
        }

        const username = req.user.username;
        const { flightNo } = req.body;

        const user = await User.findOne({ username });
        const flight = await Flight.findOne({ flightNo });

        user.flights.push(flight._id);
        await user.save();

        const newPayment = new Payment({
            user,
            flight,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        await newPayment.save();

        return res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};

module.exports = { checkout, sendkey, paymentVerification };
