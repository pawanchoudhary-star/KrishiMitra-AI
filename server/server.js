import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Deal from './models/Deal.js';
import User from './models/User.js';
import Crop from './models/Crop.js';
import SupportTicket from './models/SupportTicket.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  // We remove the <db_password> check or handle it in catch
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('🚀 Connected to MongoDB successfully!'))
    .catch(err => {
      console.error('❌ MongoDB connection error:');
      console.error(err.message);
      console.log('⚠️ Please ensure your database password is correctly set in server/.env');
    });
} else {
  console.warn('⚠️ MONGODB_URI is not defined in server/.env file.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Helper function to fetch with a timeout using AbortController
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 6000 } = options; // 6 seconds timeout
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Simple API status check route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'KrishiMitra AI Server is running smoothly!',
    timestamp: new Date()
  });
});

// Mandi Prices Endpoint
app.get('/api/mandi', (req, res) => {
  res.json([
    { crop: 'Wheat', prices: [{ mandi: 'Jaipur Mandi', price: 2350 }, { mandi: 'Sikar Mandi', price: 2310 }] },
    { crop: 'Mustard', prices: [{ mandi: 'Jaipur Mandi', price: 5400 }, { mandi: 'Alwar Mandi', price: 5420 }] }
  ]);
});

// Chat Proxy Endpoint to bypass browser CORS / fetch blockages with automatic failover and timeouts
app.post('/api/chat', async (req, res) => {
  const { messages, userMsg } = req.body;

  if (!userMsg) {
    return res.status(400).json({ error: 'userMsg is required' });
  }

  try {
    const groqKey = process.env.GROK_API_KEY;
    const geminiKey = process.env.AI_API_KEY;

    const isGrokActive = groqKey && groqKey !== 'your_xai_grok_api_key_here' && groqKey.trim() !== '';
    const isGeminiActive = geminiKey && geminiKey !== 'your_gemini_or_openai_api_key_here' && geminiKey.trim() !== '';

    let responseText = "";

    if (isGrokActive) {
      // Use Grok API with a timeout
      const apiMessages = [
        {
          role: "system",
          content: "You are KrishiMitra AI, a highly intelligent, polite, and expert agricultural assistant for Indian farmers. Respond with highly accurate, reliable, and correct information. Respond in Hindi or simple English (Hinglish) as appropriate. Use bullet points and clear formatting."
        },
        ...messages.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.text
        })),
        {
          role: 'user',
          content: userMsg
        }
      ];

      try {
        const gRes = await fetchWithTimeout("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            messages: apiMessages,
            model: "grok-2",
            stream: false
          }),
          timeout: 5000 // 5 seconds for Grok
        });

        if (gRes.ok) {
          const data = await gRes.json();
          responseText = data?.choices?.[0]?.message?.content || "";
        }
      } catch (err) {
        console.warn("Grok API call timed out or failed:", err.message);
      }
    }

    // Failover to Gemini if Grok didn't respond or isn't active
    if (!responseText && isGeminiActive) {
      // Sequence of models to try in case of rate limiting or high demand spikes on Google's free tier
      const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-flash-latest",
        "gemini-pro-latest"
      ];

      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting API call with model: ${modelName} (timeout 5s)...`);
          
          const historyText = messages.map(msg => `${msg.role === 'model' ? 'AI' : 'User'}: ${msg.text}`).join('\n');
          const systemInstruction = `You are KrishiMitra AI, a highly intelligent, polite, and expert agricultural assistant designed specifically for Indian farmers. 
Your goal is to provide extremely accurate, practical, and highly correct advice.
- If the user asks about crops, suggest local Indian varieties, planting times, and care tips.
- If the user asks about crop diseases, provide clear biological or organic remedies, and safe chemical remedies with precautions.
- Respond in Hindi or simple English (Hinglish) as appropriate to make it easily understandable for the farmer.
- Always be respectful, encouraging, and clear. Use bullet points to keep information readable.`;

          const prompt = `${systemInstruction}\n\nConversation History:\n${historyText}\n\nUser's query: ${userMsg}`;
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;

          const gRes = await fetchWithTimeout(geminiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt
                    }
                  ]
                }
              ]
            }),
            timeout: 5000 // 5 seconds timeout per model! Fast failover!
          });

          if (!gRes.ok) {
            const errData = await gRes.json().catch(() => ({}));
            const errMsg = errData?.error?.message || `API error with status ${gRes.status}`;
            console.warn(`Model ${modelName} encountered error: ${errMsg}`);
            throw new Error(errMsg);
          }

          const data = await gRes.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (generatedText) {
            responseText = generatedText;
            console.log(`Successfully generated response using model: ${modelName}`);
            break; // Success! Exit the failover loop
          } else {
            throw new Error("Empty response returned from Gemini candidate parts");
          }
        } catch (err) {
          lastError = err;
          console.warn(`Failover: Model ${modelName} failed or timed out: ${err.message}. Trying next model...`);
          // Continue to retry with the next model in the sequence
        }
      }
    }

    // Ultimate agricultural expert database fallback if both API calls fail
    if (!responseText) {
      console.warn("All live AI models are rate-limited, timed out or failed. Serving highly correct expert agricultural local database response.");
      const lowerMsg = userMsg.toLowerCase();
      
      if (lowerMsg.includes("mustard") || lowerMsg.includes("sarson") || lowerMsg.includes("सरसों")) {
        responseText = `🌾 **सरसों की खेती की संपूर्ण गाइड (Mustard / Sarson 120-Day Crop Calendar & Planning Guide)**

सरसों (Mustard) एक प्रमुख रबी फसल है। यहाँ 120 दिनों का चरण-दर-चरण कैलेंडर और प्रबंधन गाइड दी गई है:

### 1. बुवाई और प्रारंभिक चरण (दिन 1 से 15)
* **भूमि की तैयारी:** मिट्टी को 2-3 बार अच्छी तरह से जोतें। प्रति एकड़ 4-5 टन सड़ी हुई गोबर की खाद (FYM) मिलाएं।
* **उन्नत किस्में:** RH-30, Pusa Karishma, Giriraj या RH-749।
* **बीज दर:** 1.5 से 2 किलोग्राम प्रति एकड़।
* **बुवाई का तरीका:** कतार से कतार की दूरी 30-45 सेमी और पौधे से पौधे की दूरी 10-15 सेमी रखें। गहराई 3-5 सेमी होनी चाहिए।

### 2. विकास और छंटनी चरण (दिन 16 से 30)
* **छंटनी (Thinning):** बुवाई के 20-25 दिन बाद घने पौधों को निकालकर आपसी दूरी 12-15 सेमी करें ताकि पौधों को हवा और धूप मिल सके।
* **सिंचाई:** पहली सिंचाई बुवाई के 25-30 दिन बाद (फूल आने से पहले) करें।

### 3. खरपतवार नियंत्रण और पोषण (दिन 31 से 50)
* **निराई-गुड़ाई:** पहली सिंचाई के बाद हल्की निराई-गुड़ाई करें।
* **उर्वरक:** Nitrogen की दूसरी खुराक (यूरिया @ 30-40 किलो प्रति एकड़) सिंचाई के बाद दें।

### 4. फूल आने और फली बनने का चरण (दिन 51 से 80)
* **सिंचाई:** दूसरी सिंचाई बुवाई के 60-70 दिन बाद (फली बनते समय) करें।
* **रोग नियंत्रण (Aphids/चेपा):** इस समय सरसों पर चेपा या माहू का हमला हो सकता है। नियंत्रण के लिए नीम का तेल (5ml प्रति लीटर) या डाईमेथोएट (Dimethoate 30 EC @ 1ml/लीटर) का छिड़काव करें।

### 5. परिपक्वता और कटाई (दिन 81 से 120)
* **दिन 81-100:** फलियां (Siliqua) विकसित होती हैं और बीज सख्त होने लगते हैं।
* **दिन 101-120 (कटाई):** जब सरसों के पौधे और फलियां 75% पीली हो जाएं, तो फसल की कटाई कर लें। अधिक सूखने पर बीज बिखरने लगते हैं। कटाई के बाद धूप में 4-5 दिन सुखाकर गहाई (Threshing) करें।

*प्रतिक्रिया गुणवत्ता सुनिश्चित करने के लिए यह कृषि-विशेषज्ञ स्थानीय डेटाबेस द्वारा प्रदान किया गया बैकअप उत्तर है।*`;
      } else if (lowerMsg.includes("weather") || lowerMsg.includes("mausam") || lowerMsg.includes("मौसम")) {
        responseText = `🌦️ **मौसम और कृषि सलाह (Mausam & Farming Advice):**
- **आज का मौसम:** गर्म और सामान्य मौसम रहेगा। कटाई और मड़ाई के लिए उत्तम समय है।
- **कृषि सलाह:** शाम के समय फसलों की हल्की सिंचाई करें। तेज़ हवा चलने की स्थिति में कीटनाशकों या उर्वरक का छिड़काव न करें।

*प्रतिक्रिया गुणवत्ता सुनिश्चित करने के लिए यह कृषि-विशेषज्ञ स्थानीय डेटाबेस द्वारा प्रदान किया गया बैकअप उत्तर है।।*`;
      } else if (lowerMsg.includes("disease") || lowerMsg.includes("rog") || lowerMsg.includes("रोग")) {
        responseText = `🛡️ **फसल सुरक्षा / मुख्य रोग और उनके उपचार:**
1. **चेपा या माहू (Aphids):** सरसों, गोभी आदि में लगने वाला छोटा हरा-काला कीट।
   * **उपचार:** नीम का तेल (5ml प्रति लीटर) छिड़कें या अधिक गंभीर स्थिति में Imidacloprid (0.5ml प्रति लीटर) का छिड़काव करें।
2. **झुलसा रोग (Late Blight / Downy Mildew):** पत्तियों पर धब्बे पड़ना और सूखना।
   * **उपचार:** जलभराव से बचें और खेत को साफ रखें। Mancozeb (2 ग्राम प्रति लीटर पानी) का छिड़काव करें।

*प्रतिक्रिया गुणवत्ता सुनिश्चित करने के लिए यह कृषि-विशेषज्ञ स्थानीय डेटाबेस द्वारा प्रदान किया गया बैकअप उत्तर है।*`;
      } else {
        responseText = `नमस्ते! वर्तमान में AI सर्वर पर अत्यधिक लोड (high demand) है, लेकिन मैं आपकी सहायता के लिए तैयार हूँ।

आप निम्नलिखित विषयों पर विस्तृत सलाह ले सकते हैं (जो हमारे स्थानीय डेटाबेस में उपलब्ध है):
- **सरसों (Sarson / Mustard) की खेती**
- **मौसम सलाह (Mausam / Weather)**
- **मुख्य फसल रोग और इलाज (Disease / Rog)**

कृपया इनमें से किसी भी विषय के बारे में पूछें, मैं आपको तुरंत और सही जानकारी प्रदान करूँगा!`;
      }
    }

    res.json({ text: responseText });
  } catch (error) {
    console.error("Backend Proxy Chat Error:", error.message);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// User Auth - Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'All fields (name, phone, password) are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this phone number already exists' });
    }

    const newUser = new User({
      name,
      phone,
      password
    });

    await newUser.save();
    console.log(`👤 New user registered successfully: ${name} (${phone})`);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      user: { name: newUser.name, phone: newUser.phone }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Server error during registration: ' + error.message });
  }
});

// User Auth - Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ error: 'Invalid phone number or password' });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid phone number or password' });
    }

    console.log(`🔓 User logged in successfully: ${user.name} (${phone})`);

    res.json({
      success: true,
      message: 'Login successful!',
      user: { name: user.name, phone: user.phone }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error during login: ' + error.message });
  }
});

// POST Endpoint to save a new Direct Buyer Deal
app.post('/api/deals', async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      pricePerQuintal,
      totalPrice,
      buyerName,
      farmerName,
      farmerPhone,
      paymentMethod,
      paymentDetails,
      cropPhoto
    } = req.body;

    // Simple validation
    if (!cropName || !quantity || !totalPrice || !farmerName || !farmerPhone || !paymentDetails) {
      return res.status(400).json({ error: 'All required fields (cropName, quantity, totalPrice, farmerName, farmerPhone, paymentDetails) must be filled' });
    }

    const newDeal = new Deal({
      cropName,
      quantity,
      pricePerQuintal,
      totalPrice,
      buyerName: buyerName || 'ITC e-Choupal',
      farmerName,
      farmerPhone,
      paymentMethod: paymentMethod || 'UPI',
      paymentDetails,
      cropPhoto,
      status: 'Pending Verification'
    });

    await newDeal.save();
    console.log(`✅ New Deal saved successfully! ID: ${newDeal._id}, Farmer: ${farmerName}, Crop: ${cropName}`);

    res.status(201).json({
      success: true,
      message: 'Deal submitted successfully! Our representative will contact you within 24 hours.',
      dealId: newDeal._id,
      deal: newDeal
    });
  } catch (error) {
    console.error('Error saving deal:', error.message);
    res.status(500).json({ error: 'Internal Server Error while saving deal: ' + error.message });
  }
});

// GET Endpoint to retrieve recent deals
app.get('/api/deals', async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 }).limit(10);
    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error.message);
    res.status(500).json({ error: 'Internal Server Error while fetching deals: ' + error.message });
  }
});

// GET Endpoint to retrieve crops for a specific farmer
app.get('/api/crops', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ error: 'phone query parameter is required' });
    }
    const crops = await Crop.find({ farmerPhone: phone }).sort({ sowingDate: -1 });
    res.json(crops);
  } catch (error) {
    console.error('Error fetching crops:', error.message);
    res.status(500).json({ error: 'Internal Server Error while fetching crops: ' + error.message });
  }
});

// POST Endpoint to save a new Crop entry
app.post('/api/crops', async (req, res) => {
  try {
    const { cropName, sowingDate, area, healthStatus, farmerPhone } = req.body;

    if (!cropName || !sowingDate || !area || !farmerPhone) {
      return res.status(400).json({ error: 'cropName, sowingDate, area, and farmerPhone are required fields' });
    }

    const newCrop = new Crop({
      cropName,
      sowingDate,
      area: Number(area),
      healthStatus: healthStatus || 'Healthy',
      farmerPhone
    });

    await newCrop.save();
    console.log(`🌾 New Crop saved: ${cropName} for farmer: ${farmerPhone}`);

    res.status(201).json({
      success: true,
      message: 'Crop added successfully!',
      crop: newCrop
    });
  } catch (error) {
    console.error('Error saving crop:', error.message);
    res.status(500).json({ error: 'Internal Server Error while saving crop: ' + error.message });
  }
});

// DELETE Endpoint to remove/harvest a Crop entry
app.delete('/api/crops/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCrop = await Crop.findByIdAndDelete(id);
    
    if (!deletedCrop) {
      return res.status(404).json({ error: 'Crop entry not found' });
    }

    console.log(`🗑️ Crop entry deleted: ${deletedCrop.cropName} (ID: ${id})`);
    res.json({
      success: true,
      message: 'Crop entry harvested/removed successfully!'
    });
  } catch (error) {
    console.error('Error deleting crop:', error.message);
    res.status(500).json({ error: 'Internal Server Error while deleting crop: ' + error.message });
  }
});

// POST Endpoint to log support queries (Support Tickets)
app.post('/api/tickets', async (req, res) => {
  try {
    const { farmerName, farmerPhone, category, description } = req.body;

    if (!farmerName || !farmerPhone || !category || !description) {
      return res.status(400).json({ error: 'All fields (farmerName, farmerPhone, category, description) are required' });
    }

    const newTicket = new SupportTicket({
      farmerName,
      farmerPhone,
      category,
      description,
      status: 'Open'
    });

    await newTicket.save();
    console.log(`🎫 New Support Ticket filed: Category: ${category} by Farmer: ${farmerName} (${farmerPhone})`);

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully!',
      ticket: newTicket
    });
  } catch (error) {
    console.error('Error saving ticket:', error.message);
    res.status(500).json({ error: 'Internal Server Error while saving support ticket: ' + error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 KrishiMitra AI Backend server running on: http://localhost:${PORT}`);
  console.log(`Check status: http://localhost:${PORT}/api/status`);
});
