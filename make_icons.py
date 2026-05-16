"""
לוגו לתוסף YouTube Wait
רקע כהה עם משולש play ניאון ירוק + טבעת ספירה
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os, math

OUT_DIR = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(OUT_DIR, exist_ok=True)

GREEN = (0, 255, 136)
GREEN_SOFT = (140, 255, 200)
BG_TOP = (8, 24, 14)
BG_BOTTOM = (0, 0, 0)

def make_icon(size):
    # supersample 4x ואז downsample לקבלת קצוות חלקים
    s = size * 4
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))

    # ===== רקע: ריבוע מעוגל עם גרדיאנט =====
    bg_layer = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    for y in range(s):
        t = y / s
        r = int(BG_TOP[0] * (1 - t) + BG_BOTTOM[0] * t)
        g = int(BG_TOP[1] * (1 - t) + BG_BOTTOM[1] * t)
        b = int(BG_TOP[2] * (1 - t) + BG_BOTTOM[2] * t)
        ImageDraw.Draw(bg_layer).line([(0, y), (s, y)], fill=(r, g, b, 255))

    # מסכת פינות מעוגלות
    mask = Image.new("L", (s, s), 0)
    corner = s // 5
    ImageDraw.Draw(mask).rounded_rectangle([(0, 0), (s - 1, s - 1)], radius=corner, fill=255)
    bg = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    bg.paste(bg_layer, (0, 0), mask)
    img = Image.alpha_composite(img, bg)

    # ===== טבעת ספירה (כמעט סגורה) =====
    ring_layer = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring_layer)
    pad = int(s * 0.13)
    ring_w = max(4, s // 22)
    # קשת מ-130° ל-50° עם השמטה למעלה (חתך נראה כמו טיימר)
    ring_draw.arc([(pad, pad), (s - pad, s - pad)],
                  start=130, end=410, fill=GREEN + (255,), width=ring_w)
    # זוהר על הטבעת
    ring_glow = ring_layer.filter(ImageFilter.GaussianBlur(s // 30))
    img = Image.alpha_composite(img, ring_glow)
    img = Image.alpha_composite(img, ring_layer)

    # ===== משולש play במרכז =====
    play_layer = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    play_draw = ImageDraw.Draw(play_layer)
    cx, cy = s // 2, s // 2
    tri_size = int(s * 0.22)
    # משולש שמופנה ימינה (RTL פלייבק)
    # נקודות: נקודה ימנית, פינה שמאלית-עליונה, פינה שמאלית-תחתונה
    # מעט שיפט שמאלה לאיזון אופטי
    offset_x = int(tri_size * 0.12)
    p1 = (cx + tri_size - offset_x, cy)
    p2 = (cx - int(tri_size * 0.7) - offset_x, cy - tri_size)
    p3 = (cx - int(tri_size * 0.7) - offset_x, cy + tri_size)
    play_draw.polygon([p1, p2, p3], fill=GREEN_SOFT + (255,))

    # זוהר חזק על המשולש
    play_glow_big = play_layer.filter(ImageFilter.GaussianBlur(s // 12))
    play_glow_small = play_layer.filter(ImageFilter.GaussianBlur(s // 30))

    img = Image.alpha_composite(img, play_glow_big)
    img = Image.alpha_composite(img, play_glow_small)
    img = Image.alpha_composite(img, play_layer)

    # ===== bezel פנימי דק =====
    bezel = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    bezel_w = max(2, s // 60)
    bezel_inset = max(4, s // 35)
    ImageDraw.Draw(bezel).rounded_rectangle(
        [(bezel_inset, bezel_inset), (s - 1 - bezel_inset, s - 1 - bezel_inset)],
        radius=corner - bezel_inset,
        outline=(0, 255, 136, 50),
        width=bezel_w,
    )
    img = Image.alpha_composite(img, bezel)

    # ===== downsample =====
    return img.resize((size, size), Image.LANCZOS)


for sz in [16, 32, 48, 128]:
    icon = make_icon(sz)
    path = os.path.join(OUT_DIR, f"icon{sz}.png")
    icon.save(path)
    print(f"  [OK] {path}")

print("\nDone.")
