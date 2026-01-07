const express=require('express')
const router=express.Router()
const ensureAuthenticated = require("../middleware/auth.js");

const OCR_ENDPOINT=process.env.AZURE_OCR_ENDPOINT;
const OCR_API_KEY=process.env.AZURE_OCR_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;

async function pollResult(url, headers, timeout = 20000, interval = 1000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const res = await fetch(url, { method: 'GET', headers })
    if (!res.ok) throw new Error(`Polling failed: ${res.status}`)
    const json = await res.json()
    const status = json.status || json.recognitionResults?.[0]?.status
    if (status && (status.toLowerCase() === 'succeeded' || status.toLowerCase() === 'failed')) {
      return json
    }
    await new Promise(r => setTimeout(r, interval))
  }
  throw new Error('Polling timed out')
}

router.post("/ocr", ensureAuthenticated, async (req, res)=>{
    try {
        const buffer=req.body;
        const response=await fetch(`${OCR_ENDPOINT}/vision/v3.2/read/analyze`, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': OCR_API_KEY,
                'Content-Type': 'application/octet-stream'
            },
            body: buffer,
        })
        if(!response.ok){
            return res.status(response.status).json({error: "Some Error Occurred"})
        }
        const operationLocation=response.headers.get("operation-location")
        if (!operationLocation) {
        return res.status(500).json({ error: 'Missing operation-location header from Azure' })
        }

        const result = await pollResult(operationLocation, {
            'Ocp-Apim-Subscription-Key': OCR_API_KEY
        })
        return res.json(result)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({error: "Internal Server Error"})
    }
    
})

router.post("/analyze", ensureAuthenticated, async (req, res) => {
  try {
    const { ingredientText, userProfile } = req.body;
    if (!ingredientText) {
      return res.status(400).json({ error: 'ingredientText is required' });
    }

    if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_KEY || !AZURE_OPENAI_DEPLOYMENT) {
      return res.status(500).json({ error: 'Azure OpenAI not configured on server' });
    }

    const conditions=userProfile.conditions?.join(",") || 'None';
    const allergies=userProfile.allergies?.join(",") || 'None'

    const systemMessage = {
        role: 'system',
        content: `You are a health advisor analyzing food ingredients. The user has these health conditions: ${conditions}, and these allergies: ${allergies}. Provide personalized safety advice.`
      }

    const userMessage = {
      role: 'user',
      content: `Analyze these ingredients and provide a safety verdict:
                INGREDIENTS:
                ${ingredientText}

                Respond with ONLY valid JSON (no markdown, no explanation):
                {
                "verdict": "safe|caution|avoid",
                "riskLevel": "low|medium|high",
                "productName": "estimated product name",
                "summary": "brief explanation why they should/shouldn't eat this based on THEIR conditions",
                "flaggedIngredients": [
                    {
                    "name": "ingredient name",
                    "risk": "high|medium|low",
                    "reason": "why it's bad for THEIR specific condition",
                    "affectedCondition": "which of their conditions this affects",
                    "simpleExplanation": "explain in simple terms like talking to a friend",
                    "alternatives": ["alternative 1", "alternative 2"]
                    }
                ],
                "alternatives": ["healthier product 1", "product 2", "product 3"]
                }`
    };

    const body = {
      model: 'gpt-4o-mini',
      messages: [systemMessage, userMessage],
      max_tokens: 800,
      temperature: 0,
      response_format: { type: "json_object" }
    };

    const azureUrl = `${AZURE_OPENAI_ENDPOINT}/chat/completions`;

    const aiRes = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AZURE_OPENAI_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      return res.status(aiRes.status).json({ error: text || 'Azure OpenAI request failed' });
    }

    const aiJson = await aiRes.json();
    console.log(aiJson);
    return res.json(aiJson);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

module.exports=router;