import toast from "react-hot-toast";

const apiUrl=import.meta.env.VITE_API_URL || "http://localhost:5000"

export const extractTextWithAzure = async (blob, onProgress) => {
  try {
    if (onProgress) onProgress(10);

    // Converting blob to array buffer
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    if (onProgress) onProgress(30);

    // Sending to Azure Read API
    const res = await fetch(`${apiUrl}/api/ai/ocr`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-Type': 'application/octet-stream'
        },
        body: uint8Array
      }
    );
    const data= await res.json()
    if(data.error){
      throw new Error(data.error)
    }
    
    if(onProgress) onProgress(100)
      const extractedText=data.analyzeResult.readResults
            .map(page=>page.lines.map(line=>line.text).join(' ')).join('\n').trim()
    return extractedText;
  } catch (error) {
    console.error(error.message)
    toast.error('Azure OCR Error:', error.message);
    return null;
  }
};

export default extractTextWithAzure;