
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
import openai
import json


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
        ai_explanation = await call_azure_openai(
            ingredients,
            user_health,
            product_name
)

    except Exception as e:
        ai_explanation = f"AI call failed: {e}"

    return {
        "analysis": ai_explanation
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
async def call_azure_openai(ingredients, user_health, product_name):
    prompt = f"""
You are a food safety and nutrition AI assistant.

User health profile:
{json.dumps(user_health, indent=2)}

Product name:
{product_name}

Ingredients:
{ingredients}

TASK:
Analyze this product for the user and return a STRICT JSON response
with the following exact structure:

{{
  "verdict": "avoid | caution | safe",
  "riskLevel": "low | medium | high",
  "productName": "{product_name}",
  "summary": "Short 1–2 sentence explanation",
  "flaggedIngredients": [
    {{
      "name": "ingredient name",
      "risk": "low | medium | high",
      "reason": "why it is harmful",
      "affectedCondition": "which health condition it affects",
      "simpleExplanation": "explain like talking to a non-technical person",
      "alternatives": ["healthier alternatives"]
    }}
  ],
  "alternatives": ["overall healthier product suggestions"]
}}

RULES:
- Output ONLY valid JSON
- No markdown
- No explanations outside JSON
- If product is harmful, verdict must be "avoid"
- Be honest and health-focused
"""

    response = openai.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {
                "role": "system",
                "content": "You are a strict JSON-only API. Never add extra text."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=700
    )

    return json.loads(response.choices[0].message.content)

