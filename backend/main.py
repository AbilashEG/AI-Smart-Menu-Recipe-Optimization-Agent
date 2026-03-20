import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from dynamo import get_all_menu_items, get_all_orders, get_all_reviews
from prompt import build_prompt
from bedrock import invoke_nova_pro

# Load .env relative to this script
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

BEDROCK_MODEL_ID = os.getenv('BEDROCK_MODEL_ID')


# --- Request model ---
class AnalyzeRequest(BaseModel):
    question: str


# --- Startup: verify DynamoDB connections ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        menu = get_all_menu_items()
        orders = get_all_orders()
        reviews = get_all_reviews()
        print(f"[startup] DynamoDB OK — menu: {len(menu)}, orders: {len(orders)}, reviews: {len(reviews)}")
    except Exception as e:
        print(f"[startup] DynamoDB connection check failed: {e}")
    yield


# --- FastAPI app ---
app = FastAPI(title="AI Smart Menu Agent", lifespan=lifespan)

# CORS — allow React frontend on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- ENDPOINT 1: Health check ---
@app.get("/health")
def health():
    return {"status": "ok", "model": BEDROCK_MODEL_ID}


# --- ENDPOINT 2: AI analysis ---
@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    try:
        # Fetch all 3 data sources
        menu = get_all_menu_items()
        orders = get_all_orders()
        reviews = get_all_reviews()

        # Build prompt and invoke Nova Pro
        prompt_text = build_prompt(menu, orders, reviews, req.question)
        analysis = invoke_nova_pro(prompt_text)

        return {
            "question": req.question,
            "analysis": analysis,
            "menu_count": len(menu),
            "order_count": len(orders),
            "review_count": len(reviews),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- ENDPOINT 3: Raw menu data ---
@app.get("/data/menu")
def data_menu():
    try:
        return get_all_menu_items()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- ENDPOINT 4: Raw order data ---
@app.get("/data/orders")
def data_orders():
    try:
        return get_all_orders()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- ENDPOINT 5: Raw review data ---
@app.get("/data/reviews")
def data_reviews():
    try:
        return get_all_reviews()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
