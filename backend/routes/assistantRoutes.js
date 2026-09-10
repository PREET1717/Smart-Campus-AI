const express = require("express");
const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

async function supabaseFetch(table, query = "") {
    const response = await fetch(
        `${supabaseUrl}/rest/v1/${table}${query}`,
        {
            headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
}

router.post("/", async (req, res) => {
    try {
        const message = (req.body.message || "").trim();
        const userId = req.body.user_id || null;

        if (!message) {
            return res.json({
                success: false,
                reply: "Please enter a message."
            });
        }

        const text = message.toLowerCase();

        // --------------------------------
        // MY COMPLAINTS
        // --------------------------------
        if (
            text.includes("my complaints") ||
            text.includes("meri complaints") ||
            text.includes("mere complaints") ||
            text.includes("my complaint")
        ) {
            if (!userId) {
                return res.json({
                    success: false,
                    reply: "User information is missing. Please login again."
                });
            }

            const complaints = await supabaseFetch(
                "complaints",
                `?user_id=eq.${userId}&order=created_at.desc`
            );

            if (!complaints.length) {
                return res.json({
                    success: true,
                    reply: "Aapki koi complaint nahi mili."
                });
            }

            let reply = `Aapki total ${complaints.length} complaints hain:\n\n`;

            complaints.slice(0, 5).forEach((c, index) => {
                reply += `${index + 1}. ${c.complaint_text}\n`;
                reply += `Status: ${c.status}\n`;
                reply += `Category: ${c.category || "N/A"}\n`;
                reply += `Priority: ${c.priority || "N/A"}\n`;
                reply += `Department: ${c.department || "N/A"}\n\n`;
            });

            return res.json({
                success: true,
                reply
            });
        }

        // --------------------------------
        // COMPLAINT STATUS
        // --------------------------------
        if (
            text.includes("complaint status") ||
            text.includes("status of my complaint") ||
            text.includes("meri complaint ka status") ||
            text.includes("my complaint status")
        ) {
            if (!userId) {
                return res.json({
                    success: false,
                    reply: "User information is missing. Please login again."
                });
            }

            const complaints = await supabaseFetch(
                "complaints",
                `?user_id=eq.${userId}&order=created_at.desc&limit=1`
            );

            if (!complaints.length) {
                return res.json({
                    success: true,
                    reply: "Aapki koi complaint nahi mili."
                });
            }

            const complaint = complaints[0];

            return res.json({
                success: true,
                reply:
                    `Aapki latest complaint ka status: ${complaint.status}\n\n` +
                    `Complaint: ${complaint.complaint_text}\n` +
                    `Category: ${complaint.category || "N/A"}\n` +
                    `Priority: ${complaint.priority || "N/A"}\n` +
                    `Department: ${complaint.department || "N/A"}`
            });
        }

        // --------------------------------
        // NOTICES
        // --------------------------------
        if (
            text.includes("notice") ||
            text.includes("notices") ||
            text.includes("announcement")
        ) {
            const notices = await supabaseFetch(
                "notices",
                `?order=created_at.desc&limit=5`
            );

            if (!notices.length) {
                return res.json({
                    success: true,
                    reply: "Abhi koi notice available nahi hai."
                });
            }

            let reply = "Latest Notices:\n\n";

            notices.forEach((notice, index) => {
                reply += `${index + 1}. ${notice.title}\n`;
                reply += `${notice.description || ""}\n\n`;
            });

            return res.json({
                success: true,
                reply
            });
        }

        // --------------------------------
        // EVENTS
        // --------------------------------
        if (
            text.includes("event") ||
            text.includes("events") ||
            text.includes("function")
        ) {
            const events = await supabaseFetch(
                "events",
                `?order=event_date.asc&limit=5`
            );

            if (!events.length) {
                return res.json({
                    success: true,
                    reply: "Abhi koi upcoming event available nahi hai."
                });
            }

            let reply = "Upcoming Events:\n\n";

            events.forEach((event, index) => {
                reply += `${index + 1}. ${event.title}\n`;
                reply += `Date: ${event.event_date || "N/A"}\n`;
                reply += `Location: ${event.location || "N/A"}\n`;
                reply += `${event.description || ""}\n\n`;
            });

            return res.json({
                success: true,
                reply
            });
        }

        // --------------------------------
        // LOST AND FOUND
        // --------------------------------
        if (
            text.includes("lost") ||
            text.includes("found") ||
            text.includes("lost and found") ||
            text.includes("lost & found")
        ) {
            const items = await supabaseFetch(
                "lost_found",
                `?order=created_at.desc&limit=10`
            );

            if (!items.length) {
                return res.json({
                    success: true,
                    reply: "Lost & Found mein abhi koi item nahi hai."
                });
            }

            let reply = "Lost & Found Items:\n\n";

            items.forEach((item, index) => {
                reply += `${index + 1}. ${item.title}\n`;
                reply += `Type: ${item.item_type || "N/A"}\n`;
                reply += `Location: ${item.location || "N/A"}\n`;
                reply += `Status: ${item.status || "N/A"}\n\n`;
            });

            return res.json({
                success: true,
                reply
            });
        }

        // --------------------------------
        // EMERGENCY
        // --------------------------------
        if (
            text.includes("emergency") ||
            text.includes("sos") ||
            text.includes("danger")
        ) {
            return res.json({
                success: true,
                reply:
                    "Emergency ke liye Emergency SOS page open karein aur alert send karein."
            });
        }

        // --------------------------------
        // LIBRARY
        // --------------------------------
        if (
            text.includes("library") ||
            text.includes("book")
        ) {
            return res.json({
                success: true,
                reply:
                    "Library related issue ke liye Library section check karein ya complaint submit karein."
            });
        }

        // --------------------------------
        // THANKS
        // --------------------------------
        if (
            text.includes("thank") ||
            text.includes("thanks")
        ) {
            return res.json({
                success: true,
                reply: "You're welcome! 😊"
            });
        }

        // --------------------------------
        // DEFAULT AI ASSISTANT
        // --------------------------------
        return res.json({
            success: true,
            reply:
                "Main Smart Campus AI Assistant hoon. Aap complaints, notices, events, Lost & Found, Emergency SOS aur campus services ke baare mein pooch sakte hain."
        });

    } catch (error) {
        console.error("Assistant Error:", error);

        return res.status(500).json({
            success: false,
            reply: "Assistant server mein error aa gaya.",
            error: error.message
        });
    }
});

module.exports = router;