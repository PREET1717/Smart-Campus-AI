from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


# ==========================================
# TRAINING DATA
# ==========================================

texts = [
    "water is not coming in washroom",
    "washroom tap is broken",
    "toilet is dirty",
    "classroom fan is not working",
    "classroom fan stopped",
    "ac is broken",
    "air conditioner is not working",
    "electricity problem in classroom",
    "light is not working",
    "power problem in laboratory",
    "college wifi is not working",
    "internet connection is slow",
    "wifi is disconnected",
    "student wants scholarship information",
    "scholarship application problem",
    "fee payment problem",
    "fees issue",
    "exam timetable problem",
    "exam schedule issue",
    "library book is missing",
    "need a new library book",
    "library book issue"
]


labels = [
    "Maintenance",
    "Maintenance",
    "Cleanliness",
    "Maintenance",
    "Maintenance",
    "Maintenance",
    "Maintenance",
    "Electrical",
    "Electrical",
    "Electrical",
    "IT",
    "IT",
    "IT",
    "Student Services",
    "Student Services",
    "Accounts",
    "Accounts",
    "Examination",
    "Examination",
    "Library",
    "Library",
    "Library"
]


# ==========================================
# MODEL
# ==========================================

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(texts)


model = LogisticRegression(
    max_iter=1000
)

model.fit(
    X,
    labels
)


# ==========================================
# CATEGORY PREDICTION
# ==========================================

def predict_category(text):

    X_test = vectorizer.transform(
        [text]
    )

    prediction = model.predict(
        X_test
    )[0]

    return prediction


# ==========================================
# PRIORITY
# ==========================================

def predict_priority(text):

    text = text.lower()

    high_words = [
        "fire",
        "accident",
        "danger",
        "emergency",
        "urgent",
        "immediately",
        "injury",
        "unsafe",
        "gas leak"
    ]

    low_words = [
        "request",
        "suggestion",
        "information",
        "general",
        "need"
    ]


    for word in high_words:

        if word in text:

            return "HIGH"


    for word in low_words:

        if word in text:

            return "LOW"


    return "MEDIUM"


# ==========================================
# DEPARTMENT
# ==========================================

def get_department(category):

    departments = {

        "Maintenance": "Maintenance",

        "Cleanliness": "Housekeeping",

        "Electrical": "Electrical",

        "IT": "IT Department",

        "Library": "Library",

        "Accounts": "Accounts",

        "Examination": "Examination",

        "Student Services": "Student Services"

    }


    return departments.get(
        category,
        "General"
    )


# ==========================================
# SUGGESTED ACTION
# ==========================================

def get_suggested_action(
    category,
    priority
):

    actions = {

        "Maintenance":
            "Assign the complaint to the maintenance team for physical inspection and repair.",

        "Cleanliness":
            "Forward the complaint to housekeeping staff for immediate cleaning and inspection.",

        "Electrical":
            "Assign an electrician to inspect the electrical equipment and resolve the issue.",

        "IT":
            "Forward the issue to the IT support team for network or system troubleshooting.",

        "Library":
            "Forward the complaint to library staff for checking book availability or records.",

        "Accounts":
            "Forward the issue to the accounts department for verification of the fee or payment record.",

        "Examination":
            "Forward the issue to the examination department for timetable or examination verification.",

        "Student Services":
            "Forward the request to student services for assistance."
    }


    action = actions.get(
        category,
        "Forward the complaint to the appropriate campus department."
    )


    if priority == "HIGH":

        action += " Treat this complaint as high priority."

    elif priority == "MEDIUM":

        action += " Handle this complaint within the normal service priority."

    else:

        action += " Handle this request during routine service hours."


    return action