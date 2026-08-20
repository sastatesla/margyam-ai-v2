"""
constants.py — Global AI Engine Constants, Model Selection Matrix, Multi-lingual Fallback Questions & Progress Translations.
Ported with 100% fidelity from monolith margyam-be/src/utils/constants.js and progressTranslator.js.
"""

MODELS = {
    "GEMINI": {
        "FLASH": "gemini-3.5-flash",
        "FLASH_LOW_LATENCY": "gemini-2.5-flash",
        "PRO": "gemini-3.1-pro-preview",
        "PRO_PREVIEW": "gemini-3.1-pro-preview",
    },
    "EMBEDDING": {
        "GEMINI_TEXT": "text-embedding-005",
    },
    "USE_CASES": {
        "INTENT_CLASSIFICATION": "gemini-2.5-flash",
        "QUERY_REFRAMING": "gemini-2.5-flash",
        "GENERAL_CHAT": "gemini-2.5-flash",
        "CONVERSATIONAL_SYNTHESIS": "gemini-2.5-flash",
        "DAILY_GUIDANCE": "gemini-2.5-flash",
        "CRITIC_VERIFICATION": "gemini-2.5-flash",
        "DEEP_ASTRO_RESEARCH": "gemini-3.5-flash",
        "HOROSCOPE_SYNTHESIS": "gemini-3.1-pro-preview",
        "FEEDBACK_OPTIMIZATION": "gemini-3.1-pro-preview",
    },
}

FALLBACK_QUESTIONS = {
    "en": {
        "CAREER": [
            "When will I change my job or get career growth?",
            "What professional remedies should I perform?",
            "Is business or job better for my career?",
        ],
        "WEALTH": [
            "When will my financial situation improve?",
            "How can I strengthen my wealth houses?",
            "What planets are blocking my financial growth?",
        ],
        "RELATIONSHIP": [
            "Why is there a delay in my marriage or relationship?",
            "When is the most favorable time for marriage?",
            "What planetary remedies can resolve relationship delays?",
        ],
        "HEALTH": [
            "What planetary placements affect my physical energy?",
            "What wellness remedies do you suggest?",
            "Which dasha period is best for recovery?",
        ],
        "DAILY": [
            "How will my day unfold tomorrow?",
            "What precautions should I take today?",
            "Which planets are influencing my daily transit?",
        ],
        "GENERAL": [
            "How does my current Mahadasha affect me?",
            "What are the key remedies for my chart?",
            "Tell me more about my Ascendant lord.",
        ],
    },
    "hi": {
        "CAREER": [
            "Job change aur career growth kab tak hogi?",
            "Mujhe kaun se professional remedies karne chahiye?",
            "Mere career ke liye business achha hai ya job?",
        ],
        "WEALTH": [
            "Meri financial situation kab tak improve hogi?",
            "Main apne wealth houses ko kaise majboot kar sakta hoon?",
            "Kaun se grah meri financial growth ko rok rahe hain?",
        ],
        "RELATIONSHIP": [
            "Shaadi ya relationship mein delay kyun ho raha hai?",
            "Shaadi ke liye sabse favorable time kab hai?",
            "Relationship delay ko door karne ke kya remedies hain?",
        ],
        "HEALTH": [
            "Kaun se grah meri physical energy ko affect kar rahe hain?",
            "Aap mere liye kya wellness remedies suggest karte hain?",
            "Recovery ke liye kaun si dasha period sabse achhi hai?",
        ],
        "DAILY": [
            "Mera kal ka din kaisa rahega?",
            "Aaj mujhe kya precautions lene chahiye?",
            "Kaun se grah mere daily transit ko affect kar rahe hain?",
        ],
        "GENERAL": [
            "Mera current Mahadasha mujhe kaise affect kar raha hai?",
            "Meri kundli ke key remedies kya hain?",
            "Mujhe mere Ascendant lord ke baare mein aur batayein.",
        ],
    },
    "ta": {
        "CAREER": [
            "வேலை மாற்றம் மற்றும் தொழில் வளர்ச்சி எப்போது ஏற்படும்?",
            "நான் என்ன பரிகாரங்கள் செய்ய வேண்டும்?",
            "என் தொழிலுக்கு வியாபாரம் சிறந்ததா அல்லது வேலையா?",
        ],
        "WEALTH": [
            "என் நிதி நிலைமை எப்போது மேம்படும்?",
            "தன ஸ்தானத்தை பலப்படுத்துவது எப்படி?",
            "என் நிதி வளர்ச்சியை தடுக்கும் கிரகங்கள் எவை?",
        ],
        "RELATIONSHIP": [
            "திருமணத்தில் ஏன் தாமதம் ஏற்படுகிறது?",
            "திருமணத்திற்கு மிகவும் சாதகமான நேரம் எப்போது?",
            "திருமண தாமதத்தை நீக்க என்ன பரிகாரம் செய்ய வேண்டும்?",
        ],
        "HEALTH": [
            "என் உடலாரோக்கியத்தை பாதிக்கும் கிரகங்கள் எவை?",
            "உடல் நலத்திற்கு என்ன பரிகாரங்கள் செய்ய வேண்டும்?",
            "நோய் குணமாக எந்த தசா காலம் சிறந்தது?",
        ],
        "DAILY": [
            "ನಾಳೆ ಎನ್ ನಾಳ್ ಎಪ್ಪಿಡಿ ಇರುಕ್ಕುಮ್?",
            "ಇಂದು ನಾನ್ ಎನ್ ಮುನ್ನೆಚ್ಚರಿಕ್ಕೆ ನಡವಡಿಕ್ಕೆ ಎಡುಕ್ಕ ವೇಂಡುಮ್?",
            "ಇನ್ರೆಯ ಕೋಚಾರ ಗ್ರಹಙ್ಗಳ್ ಎನ್ನೈ ಎಪ್ಪಿಡಿ ಬಾತಿಕ್ಕುಮ್?",
        ],
        "GENERAL": [
            "ತರ್ಪೋದೈಯ ಮಹಾದಿಶೈ ಎನ್ನೈ ಎಪ್ಪಿಡಿ ಬಾತಿಕ್ಕುಮ್?",
            "ಎನ್ ಜಾತಕತ್ತಿರ್ಕಾಣ ಮುಖ್ಯ ಪರಿಹಾರಙ್ಗಳ್ ಎನ್ನ?",
            "ಎನ್ ಲಕ್ನಾತಿಪತಿ ಪಟ್ರಿ ಮೇಲುಮ್ ಕೂறவுಮ್.",
        ],
    },
    "bn": {
        "CAREER": [
            "চাকরি পরিবর্তন ও পেশাগত উন্নতি কবে হবে?",
            "পেশাগত উন্নতির জন্য কী প্রতিকার করা উচিত?",
            "আমার ক্যারিয়ারের জন্য ব্যবসা নাকি চাকরি কোনটি ভালো?",
        ],
        "WEALTH": [
            "আমার আর্থিক অবস্থার উন্নতি কবে হবে?",
            "আর্থিক ভাব বা ধনাধিকে কীভাবে শক্তিশালী করব?",
            "কোন গ্রহগুলি আমার আর্থিক উন্নতিতে বাধা দিচ্ছে?",
        ],
        "RELATIONSHIP": [
            "বিয়ে বা সম্পর্কে বিলম্ব কেন হচ্ছে?",
            "বিয়ের জন্য সবচেয়ে শুভ সময় কখন?",
            "সম্পর্কের সমস্যা দূর করার জন্য কী প্রতিকার আছে?",
        ],
        "HEALTH": [
            "কোন গ্রহের অবস্থান আমার শারীরিক শক্তিকে প্রভাবিত করছে?",
            "শারীরিক সুস্থতার জন্য কী প্রতিকার করা উচিত?",
            "আরোগ্য লাভের জন্য কোন দশা সবচেয়ে ভালো?",
        ],
        "DAILY": [
            "আমার আগামী দিন কেমন যাবে?",
            "আজকে আমার কী সতর্কতা নেওয়া উচিত?",
            "আজ কোন গ্রহের প্রভাব আমার ওপর বেশি?",
        ],
        "GENERAL": [
            "আমার বর্তমান মহাদশা আমাকে কীভাবে প্রভাবিত করছে?",
            "আমার কুষ্ঠির প্রধান প্রতিকারগুলি কী কী?",
            "আমার লগ্নপতি সম্পর্কে আরও কিছু বলুন।",
        ],
    },
    "pa": {
        "CAREER": [
            "ਨੌਕਰੀ ਵਿੱਚ ਬਦਲਾਅ ਅਤੇ ਕਰੀਅਰ ਗ੍ਰੋਥ ਕਦੋਂ ਤੱਕ ਹੋਵੇਗੀ?",
            "ਮੈਨੂੰ ਕਿਹੜੇ ਉਪਾਅ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ?",
            "ਮੇਰੇ ਕਰੀਅਰ ਲਈ ਬਿਜ਼ਨੈੱਸ ਚੰਗਾ ਹੈ ਜਾਂ ਨੌਕਰੀ?",
        ],
        "WEALTH": [
            "ਮੇਰੀ ਵਿੱਤੀ ਸਥਿਤੀ ਕਦੋਂ ਤੱਕ ਸੁਧਰੇਗੀ?",
            "ਮੈਂ ਆਪਣੇ ਧਨ ਭਾਵ ਨੂੰ ਕਿਵੇਂ ਮਜ਼ਬੂਤ ਕਰ ਸਕਦਾ ਹਾਂ?",
            "ਕਿਹੜੇ ਗ੍ਰਹਿ ਮੇਰੀ ਵਿੱਤੀ ਤਰੱਕੀ ਨੂੰ ਰੋਕ ਰਹੇ ਹਨ?",
        ],
        "RELATIONSHIP": [
            "ਵਿਆਹ ਜਾਂ ਰਿਸ਼ਤੇ ਵਿੱਚ ਦੇਰੀ ਕਿਉਂ ਹੋ ਰਹੀ ਹੈ?",
            "ਵਿਆਹ ਲਈ ਸਭ ਤੋਂ ਅਨੁਕੂਲ ਸਮਾਂ ਕਦੋਂ ਹੈ?",
            "ਰਿਸ਼ਤੇ ਦੀ ਦੇਰੀ ਨੂੰ ਦੂਰ ਕਰਨ ਲਈ ਕੀ ਉਪਾਅ ਹਨ?",
        ],
        "HEALTH": [
            "ਕਿਹੜੇ ਗ੍ਰਹਿ ਮੇਰੀ ਸਿਹਤ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਰਹੇ ਹਨ?",
            "ਸਿਹਤ ਲਈ ਤੁਸੀਂ ਕੀ ਉਪਾਅ ਸੁਝਾਉਂਦੇ ਹੋ?",
            "ਠੀਕ ਹੋਣ ਲਈ ਕਿਹੜਾ ਦਸ਼ਾ ਕਾਲ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ?",
        ],
        "DAILY": [
            "ਮੇਰਾ ਕੱੱਲ੍ਹ ਦਾ ਦਿਨ ਕਿਹੋ ਜਿਹਾ ਰਹੇਗਾ?",
            "ਅੱਜ ਮੈਨੂੰ ਕੀ ਸਾਵਧਾਨੀ ਵਰਤਣੀ ਚਾਹੀਦੀ ਹੈ?",
            "ਕਿਹੜੇ ਗ੍ਰਹਿ ਮੇਰੇ ਰੋਜ਼ਾਨਾ ਗੋਚਰ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਰਹੇ ਹਨ?",
        ],
        "GENERAL": [
            "ਮੇਰਾ ਮੌਜੂਦਾ ਮਹਾਦਸ਼ਾ ਮੈਨੂੰ ਕਿਵੇਂ ਪ੍ਰਭਾਵਿਤ ਕਰ ਰਿਹਾ ਹੈ?",
            "ਮੇਰੀ ਕੁੰਡਲੀ ਦੇ ਮੁੱਖ ਉਪਾਅ ਕੀ ਹਨ?",
            "ਮੈਨੂੰ ਮੇਰੇ ਲਗਨ ਦੇ ਸਵਾਮੀ ਬਾਰੇ ਹੋਰ ਦੱਸੋ।",
        ],
    },
    "kn": {
        "CAREER": [
            "ಉದ್ಯೋಗ ಬದಲಾವಣೆ ಮತ್ತು ವೃತ್ತಿ ಬೆಳವಣಿಗೆ ಯಾವಾಗ ಆಗುತ್ತದೆ?",
            "ಯಾವ ವೃತ್ತಿಪರ ಪರಿಹಾರಗಳನ್ನು ನಾನು ಮಾಡಬೇಕು?",
            "ನನ್ನ ವೃತ್ತಿಜೀವನಕ್ಕೆ ವ್ಯಾಪಾರ ಒಳ್ಳೆಯದೇ ಅಥವಾ ಉದ್ಯೋಗವೇ?",
        ],
        "WEALTH": [
            "ನನ್ನ ಆರ್ಥಿಕ ಪರಿಸ್ಥಿತಿ ಯಾವಾಗ ಸುಧಾರಿಸುತ್ತದೆ?",
            "ನನ್ನ ಧನ ಸ್ಥಾನವನ್ನು ಬಲಪಡಿಸುವುದು ಹೇಗೆ?",
            "ಯಾವ ಗ್ರಹಗಳು ನನ್ನ ಆರ್ಥಿಕ ಬೆಳವಣಿಗೆಯನ್ನು ತಡೆಯುತ್ತಿವೆ?",
        ],
        "RELATIONSHIP": [
            "ಮದುವೆ ಅಥವಾ ಸಂಬಂಧದಲ್ಲಿ ವಿಳಂಬ ಏಕೆ ಆಗುತ್ತಿದೆ?",
            "ಮದುವೆಗೆ ಅತ್ಯಂತ ಅನುಕೂಲಕರ ಸಮಯ ಯಾವಾಗ?",
            "ಮದುವೆ ವಿಳಂಬವನ್ನು ನಿವಾರಿಸಲು ಯಾವ ಪರಿಹಾರಗಳಿವೆ?",
        ],
        "HEALTH": [
            "ಯಾವ ಗ್ರಹಗಳ ಸ್ಥಾನಗಳು ನನ್ನ ಆರೋಗ್ಯದ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುತ್ತವೆ?",
            "ಆರೋಗ್ಯಕ್ಕಾಗಿ ನೀವು ಯಾವ ಪರಿಹಾರಗಳನ್ನು ಸೂಚಿಸುತ್ತೀರಿ?",
            "ಚೇತರಿಕೆಗೆ ಯಾವ ದಶಾ ಅವಧಿ ಅತ್ಯುತ್ತಮವಾಗಿದೆ?",
        ],
        "DAILY": [
            "ನನ್ನ ನಾಳಿನ ದಿನ ಹೇಗಿರಲಿದೆ?",
            "ಇಂದು ನಾನು ಯಾವ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಬೇಕು?",
            "ಇಂದಿನ ಗೋಚಾರ ಗ್ರಹಗಳು ನನ್ನನ್ನು ಹೇಗೆ ಬಾಧಿಸಲಿವೆ?",
        ],
        "GENERAL": [
            "ನನ್ನ ಪ್ರಸ್ತುತ ಮಹಾದಶೆ ನನ್ನ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
            "ನನ್ನ ಜಾತಕದ ಪ್ರಮುಖ ಪರಿಹಾರಗಳು ಯಾವುವು?",
            "ನನ್ನ ಲಗ್ನಾಧಿಪತಿಯ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು ತಿಳಿಸಿ.",
        ],
    },
}

PROGRESS_TRANSLATIONS = {
    "Determining query intent...": {
        "en": "Analyzing question...",
        "hi": "प्रश्न का विश्लेषण कर रहे हैं...",
        "hinglish": "Question analyze kar rahe hai...",
        "ta": "கேள்வியை பகுப்பாய்வு செய்கிறது...",
        "te": "ప్రశ్నను విశ్లేషిస్తోంది...",
        "kn": "ಪ್ರಶ್ನೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "প্রশ্ন বিশ্লেষণ করা হচ্ছে...",
    },
    "Responding...": {
        "en": "Writing answer...",
        "hi": "उत्तर लिख रहे हैं...",
        "hinglish": "Answer likh rahe hai...",
        "ta": "பதிலளிக்கிறது...",
        "te": "స్పందిస్తోంది...",
        "kn": "ಪ್ರತಿಕ್ರಿಯಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "প্রতিক্রিয়া জানানো হচ্ছে...",
    },
    "Synthesizing cached insight...": {
        "en": "Getting saved response...",
        "hi": "सुरक्षित उत्तर निकाल रहे हैं...",
        "hinglish": "Saved response nikal rahe hai...",
        "ta": "சேமித்த பதிலை எடுக்கிறது...",
        "te": "భద్రపరిచిన సమాధానం తీసుకుంటోంది...",
        "kn": "ಉಳಿಸಿದ ಉತ್ತರವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
        "bn": "সংরক্ষিত উত্তর আনা হচ্ছে...",
    },
    "Synthesizing concise cosmic insights...": {
        "en": "Preparing quick answer...",
        "hi": "तुरंत उत्तर तैयार कर रहे हैं...",
        "hinglish": "Quick answer taiyar kar rahe hai...",
        "ta": "விரைவான பதிலை உருவாக்குகிறது...",
        "te": "త్వరిత సమాధానం సిద్ధం చేస్తోంది...",
        "kn": "ತ್ವರಿತ ಉತ್ತರವನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "ঝটপট উত্তর প্রস্তুত করা হচ্ছে...",
    },
    "Formulating specialized astrological query...": {
        "en": "Analyzing your birth chart...",
        "hi": "आपकी कुंडली का विश्लेषण कर रहे हैं...",
        "hinglish": "Aapki kundli analyze kar rahe hai...",
        "ta": "பிறப்பு ஜாதகத்தை ஆராய்கிறது...",
        "te": "జన్మ పట్టికను విశ్లేషిస్తోంది...",
        "kn": "ಜನ್ಮ ಜಾತಕವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "জন্মকুণ্ডলী বিশ্লেষণ করা হচ্ছে...",
    },
    "Searching classical texts and planetary records...": {
        "en": "Searching astrology books...",
        "hi": "ज्योतिष ग्रंथों में खोज रहे हैं...",
        "hinglish": "Astrology books me search kar rahe hai...",
        "ta": "ஜோதிட புத்தகங்களைத் தேடுகிறது...",
        "te": "జ్యోతిష్య పుస్తకాలను వెతుకుతోంది...",
        "kn": "ಜ್ಯೋತಿಷ್ಯ ಪುಸ್ತಕಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
        "bn": "জ্যোতিষশাস্ত্রের বই খোঁজা হচ্ছে...",
    },
    "Synthesizing cosmic insights...": {
        "en": "Formulating detailed analysis...",
        "hi": "विस्तृत विश्लेषण तैयार कर रहे हैं...",
        "hinglish": "Detailed analysis taiyar kar rahe hai...",
        "ta": "விவரமான பகுப்பாய்வை உருவாக்குகிறது...",
        "te": "వివరణాత్మక విశ్లేషణను సిద్ధం చేస్తోంది...",
        "kn": "ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "বিস্তারিত বিশ্লেষণ প্রস্তুত করা হচ্ছে...",
    },
    "Classifying user intent...": {
        "en": "Analyzing question...",
        "hi": "प्रश्न का विश्लेषण कर रहे हैं...",
        "hinglish": "Question analyze kar rahe hai...",
        "ta": "கேள்வியை பகுப்பாய்வு செய்கிறது...",
        "te": "ప్రశ్నను విశ్లేషిస్తోంది...",
        "kn": "ಪ್ರಶ್ನೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "প্রশ্ন বিশ্লেষণ করা হচ্ছে...",
    },
    "Synthesizing conversational response...": {
        "en": "Writing answer...",
        "hi": "उत्तर लिख रहे हैं...",
        "hinglish": "Answer likh rahe hai...",
        "ta": "பதிலளிக்கிறது...",
        "te": "స్పందిస్తోంది...",
        "kn": "ಪ್ರತಿಕ್ರಿಯಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "প্রতিক্রিয়া জানানো হচ্ছে...",
    },
    "Formulating search parameters and querying classical texts...": {
        "en": "Searching astrology books...",
        "hi": "ज्योतिष ग्रंथों में खोज रहे हैं...",
        "hinglish": "Astrology books me search kar rahe hai...",
        "ta": "ஜோதிட புத்தகங்களைத் தேடுகிறது...",
        "te": "జ్యోతిష్య పుస్తகాలను వెతుకుతోంది...",
        "kn": "ಜ್ಯೋತಿಷ್ಯ ಪುಸ್ತಕಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
        "bn": "জ্যোতিষশাস্ত্রের বই খোঁজা হচ্ছে...",
    },
    "Analyzing user birth chart coordinates and alignments...": {
        "en": "Analyzing your birth chart...",
        "hi": "आपकी कुंडली का विश्लेषण कर रहे हैं...",
        "hinglish": "Aapki kundli analyze kar rahe hai...",
        "ta": "பிறப்பு ஜாதகத்தை ஆராய்கிறது...",
        "te": "జన్మ పట్టికను విశ్లేషిస్తోంది...",
        "kn": "ಜನ್ಮ ಜಾತಕವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "জন্মকুণ্ডলী বিশ্লেষণ করা হচ্ছে...",
    },
    "Performing web research for real-time transits...": {
        "en": "Checking planetary transits...",
        "hi": "ग्रहों के गोचर की जांच कर रहे हैं...",
        "hinglish": "Planetary transits check kar rahe hai...",
        "ta": "கிரக பெயர்ச்சியை சரிபார்க்கிறது...",
        "te": "గ్రహ సంచారాన్ని తనిਖీ చేస్తోంది...",
        "kn": "ಗ್ರಹಗಳ ಗೋಚಾರವನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "গ্রহের ট্রানজিট পরীক্ষা করা হচ্ছে...",
    },
    "Aggregating worker results and finalizing insights...": {
        "en": "Formulating detailed analysis...",
        "hi": "विस्तृत विश्लेषण तैयार कर रहे हैं...",
        "hinglish": "Detailed analysis taiyar kar rahe hai...",
        "ta": "விவரமான பகுப்பாய்வை உருவாக்குகிறது...",
        "te": "விவరణాత్మక విశ్లేషణను సిద్ధం చేస్తోంది...",
        "kn": "ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "বিস্তারিত বিশ্লেষণ প্রস্তুত করা হচ্ছে...",
    },
    "Analyzing data...": {
        "en": "Analyzing data...",
        "hi": "डेटा का विश्लेषण कर रहे हैं...",
        "hinglish": "Data analyze kar rahe hai...",
        "ta": "தரவை ஆராய்கிறது...",
        "te": "డేటాను విశ్లేషిస్తోంది...",
        "kn": "ಮಾಹಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "উপাত্ত বিশ্লেষণ করা হচ্ছে...",
    },
    "Gathering sources...": {
        "en": "Gathering sources...",
        "hi": "स्रोतों को एकत्र कर रहे हैं...",
        "hinglish": "Sources collect kar rahe hai...",
        "ta": "ஆதாரங்களை சேகரிக்கிறது...",
        "te": "ఆధారాలను సేకరిస్తోంది...",
        "kn": "ಆಕರಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "উৎস সংগ্রহ করা হচ্ছে...",
    },
    "Processing query...": {
        "en": "Processing query...",
        "hi": "प्रश्न पर काम कर रहे हैं...",
        "hinglish": "Query process kar rahe hai...",
        "ta": "கேள்வி செயலாக்கப்படுகிறது...",
        "te": "ప్రశ్నను ప్రాసెస్ చేస్తోంది...",
        "kn": "ಪ್ರಶ್ನೆಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
        "bn": "প্রশ্ন প্রক্রিয়াকরণ করা হচ্ছে...",
    },
}


def translate_progress_message(msg: str, lang: str = "en") -> str:
    if not msg:
        return ""
    code = lang.lower() if lang else "en"
    if msg in PROGRESS_TRANSLATIONS:
        translations = PROGRESS_TRANSLATIONS[msg]
        return translations.get(code, translations.get("en", msg))
    return msg
