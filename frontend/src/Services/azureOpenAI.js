const apiUrl=import.meta.env.VITE_API_URL || "http://localhost:5000"

export const analyzeIngredientsWithAzure = async (ingredientText, userProfile) => {
  try {
    const response = await fetch(`${apiUrl}/api/ai/analyze`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ingredientText, userProfile})
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure OpenAI Error:', errorText);
      throw new Error(`Azure OpenAI API failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text
    const responseText = data.choices[0].message.content;
    
    // Clean and parse JSON
    const cleanText = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const analysis = JSON.parse(cleanText);
    
    console.log('Azure OpenAI Analysis:', analysis);
    return analysis;

  } catch (error) {
    console.error('Azure OpenAI Error:', error);
    throw new Error('Failed to analyze ingredients');
  }
};