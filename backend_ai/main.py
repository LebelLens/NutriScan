from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
import openai

load_dotenv()

app = FastAPI()

# Enable CORS so frontend (different port) can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing, allow all origins. Later restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Azure OpenAI
openai.api_type = "azure"
openai.api_key = os.getenv("AZURE_OPENAI_KEY")
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_version = "2024-02-01"

DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_MODEL_DEPLOYMENT")

# Request model
class ScanRequest(BaseModel):
    product_url: str
    user_health: dict

@app.post("/analyze-product")
async def analyze_product(req: ScanRequest):
    product_url = req.product_url
    user_health = req.user_health

    # 1) Fetch product data
    try:
        res = requests.get(product_url, timeout=5)
        data = res.json()
    except Exception as e:
        return {"error": f"Failed to fetch product data: {e}"}

    if data.get("status") != 1 or "product" not in data:
        return {"error": "Product not found"}

    product = data["product"]
    ingredients = product.get("ingredients_text", "")
    product_name = product.get("product_name", "Unknown")

    # 2) Basic rule analysis (simple logic)
    harmful_simple = check_harm(ingredients, user_health)

    # 3) Call Azure OpenAI for AI explanation
    try:
        ai_explanation = await call_azure_openai(ingredients, user_health)
    except Exception as e:
        ai_explanation = f"AI call failed: {e}"

    return {
        "product_name": product_name,
        "ingredients": ingredients,
        "harmful_simple": harmful_simple,
        "ai_explanation": ai_explanation
    }

# Simple health check logic
def check_harm(ingredients, user_health):
    ingr = ingredients.lower()
    output = []

    if user_health.get("diabetes") and "sugar" in ingr:
        output.append({"ingredient": "Sugar", "reason": "Not good for diabetes."})

    if user_health.get("bp") and ("salt" in ingr or "sodium" in ingr):
        output.append({"ingredient": "Salt/Sodium", "reason": "Bad for blood pressure."})

    if user_health.get("allergies"):
        for allergy in user_health["allergies"]:
            if allergy.lower() in ingr:
                output.append({"ingredient": allergy, "reason": "Allergic reaction risk."})

    return output

# Call Azure OpenAI with new SDK
async def call_azure_openai(ingredients, user_health):
    prompt = f"""
User health profile: {user_health}

Ingredients in the product:
{ingredients}

Provide a structured summary of potentially harmful ingredients for this user and explain why.
"""

    response = openai.chat.completions.create(
        model=DEPLOYMENT_NAME,  # Use model instead of engine
        messages=[
            {"role": "system", "content": "You are a nutrition risk expert."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.3
    )

    return response.choices[0].message.content
