from fastapi import FastAPI
from pydantic import BaseModel

from model import (
    predict_category,
    predict_priority,
    get_department,
    get_suggested_action
)


app = FastAPI()


# ==========================================
# REQUEST MODEL
# ==========================================

class Complaint(BaseModel):
    text: str


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "success": True,
        "message": "Smart Campus AI Model is Working!"
    }


# ==========================================
# AI PREDICTION
# ==========================================

@app.post("/predict")
def predict(complaint: Complaint):

    text = complaint.text.strip()

    if not text:
        return {
            "success": False,
            "message": "Complaint text is required."
        }

    # CATEGORY
    category = predict_category(text)

    # PRIORITY
    priority = predict_priority(text)

    # DEPARTMENT
    department = get_department(category)

    # SUGGESTED ACTION
    suggested_action = get_suggested_action(
        category,
        priority
    )

    return {
        "success": True,
        "complaint": text,
        "category": category,
        "priority": priority,
        "department": department,
        "suggested_action": suggested_action
    }