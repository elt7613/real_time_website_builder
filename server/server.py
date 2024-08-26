# --- START OF FILE server.py ---
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn
from llm import generate_website, modify_website, extract_partial_code

load_dotenv()

app = FastAPI()

# Middleware 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
def root():
    return {"message": "Real-Time Website Builder API is running"}

class WebsiteRequest(BaseModel):
    description: str

class ModifyWebsiteRequest(BaseModel):
    modification_description: str
    current_html: str
    current_css: str

@app.post("/api/generate-website")
def generate_website_api(request: WebsiteRequest):
    print('Received generate-website request:', request)

    if not request.description:
        raise HTTPException(status_code=400, detail="Description is required")

    try:
        print('Calling LLM API...')
        response = generate_website(request.description)
        
        # Extract the text content from the Groq response 
        content = response.content 

        html = extract_partial_code(content, 'html')
        css = extract_partial_code(content, 'css')
        print("LLM Response:", response)
        print("HTML:", html)
        print("CSS:", css)
        return {"html": html, "css": css}
    except Exception as error:
        print('Error generating website:', str(error))
        raise HTTPException(status_code=500, detail=f"Failed to generate website: {str(error)}")

@app.post("/api/modify-website")
def modify_website_api(request: ModifyWebsiteRequest):
    print('Received modify-website request:', request)

    if not request.modification_description or not request.current_html or not request.current_css:
        raise HTTPException(status_code=400, detail="Modification description, current HTML, and current CSS are required")

    try:
        print('Calling LLM API for modification...')
        response = modify_website(request.modification_description, request.current_html, request.current_css)

        # Extract the text content from the Groq response
        content = response.content 

        html = extract_partial_code(content, 'html')
        css = extract_partial_code(content, 'css')
        return {"html": html, "css": css}
    except Exception as error:
        print('Error modifying website:', str(error))
        raise HTTPException(status_code=500, detail=f"Failed to modify website: {str(error)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
# --- END OF FILE server.py ---