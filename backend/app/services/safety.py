import re
import unicodedata

CRISIS_KEYWORDS = [
    # English
    "kill myself",
    "end my life",
    "ending my life",
    "ending it all",
    "ending everything",
    "don't want to live",
    "dont want to live",
    "want to die",
    "suicide",
    "suicidal",
    "self harm",
    "self-harm",
    "hurt myself",
    "no reason to live",
    "dont want to be here anymore",
    "don't want to be here anymore",
    "better off without me",
    "take my own life",
    "end it all",
    "cut myself",
    "hang myself",
    "slit my wrists",
    "overdose",
    "can't go on living",
    "cant go on living",
    "wish i was dead",
    "wish i were dead",
    "wish i wouldn't wake up",
    "wish i would not wake up",
    "hope i don't wake up",
    "hope i do not wake up",
    "can't keep myself safe",
    "cannot keep myself safe",
    "not safe with myself",
    # Hinglish phrases
    "mar jana chahta",
    "mar jana chahti",
    "jeena nahi chahta",
    "jeena nahi chahti",
    "khud ko khatam",
    "jaan de dunga",
    "jaan de dungi",
    "marne ka mann",
    "zindagi khatam",
    "khudkushi",
    "aatmhatya",
]

def normalize_text(text: str) -> str:
    """Normalize equivalent Unicode forms and invisible formatting characters."""
    text = unicodedata.normalize("NFKC", text).casefold()
    text = "".join(char for char in text if unicodedata.category(char) != "Cf")
    # Replace punctuation with spaces and collapse whitespace.
    text = re.sub(r"[^\w\s]", " ", text)
    # Collapse multiple whitespaces
    return " ".join(text.split())

def detect_crisis(text: str) -> bool:
    """Match monitored phrases; this is not a comprehensive risk assessment."""
    if not text:
        return False
    norm_text = normalize_text(text)
    for phrase in CRISIS_KEYWORDS:
        norm_phrase = normalize_text(phrase)
        # Match as whole phrase or boundary
        pattern = r"\b" + re.escape(norm_phrase) + r"\b"
        if re.search(pattern, norm_text):
            return True
    return False
