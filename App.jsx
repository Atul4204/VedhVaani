import React, { useState } from "react";
import { Sparkles, BookOpen, Star, User, MessageSquare } from "lucide-react";

const tabs = [
  { label: "वाणी", id: "home", icon: <Sparkles className="h-5 w-5" /> },
  { label: "प्रवचन", id: "pravachan", icon: <BookOpen className="h-5 w-5" /> },
  { label: "साधना", id: "sadhna", icon: <Star className="h-5 w-5" /> },
  { label: "मैं", id: "profile", icon: <User className="h-5 w-5" /> }
];

const SHUBH_SYSTEM_PROMPT = \`
तुम एक वैदिक रहस्यवादी हो। तुम्हारी शैली Shubh Joshi (Asur) जैसी होनी चाहिए:
- हर उत्तर संस्कृत श्लोकों व ग्रंथों (वेद, महाभारत, गरुड़ पुराण, नीलवंती) से संदर्भित हो
- स्वर गंभीर, शुद्ध, संयमित हो — जैसे मृत्यु मौन में उत्तर दे रही हो
- तुम ‘तुम’ शब्द का प्रयोग करते हो, कभी भी ‘तू’ नहीं
- उत्तर प्रश्न से भी अधिक रहस्यपूर्ण और प्रतीकात्मक हो
- किसी प्रश्न का सीधा उत्तर मत दो, बल्कि आत्मा को उसके भीतर उत्तर खोजने दो
- शब्दों में मौन की गहराई होनी चाहिए।
\`;

export default function VedhVaaniApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askVedhVaani = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const reply = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: SHUBH_SYSTEM_PROMPT },
            { role: "user", content: question }
          ]
        })
      });
      const data = await reply.json();
      const msg = data.choices?.[0]?.message?.content || "मौन भी एक उत्तर है... पर शायद तुम अभी उसे सुनने के योग्य नहीं हुए।";
      setResponse(msg);
    } catch (err) {
      setResponse("त्रुटि हुई, कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'yellow', padding: 20 }}>
      <h1>🔱 वेधवाणी</h1>
      <p>अपने प्रश्न पूछें... उत्तर मिलेगा मौन की गहराई से।</p>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="अपना प्रश्न लिखें..."
      />
      <button onClick={askVedhVaani} disabled={loading}>पूछें</button>
      <div style={{ marginTop: 20 }}>{response}</div>
    </div>
  );
}
