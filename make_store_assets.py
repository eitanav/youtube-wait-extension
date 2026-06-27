"""
מייצר גרפיקות לחנות Chrome Web Store:
- promo small tile 440x280
- marquee 1400x560
- screenshot mock 1280x800 (מסך ההמתנה)
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

OUT = r"C:\Users\USER\Downloads\store-assets"
os.makedirs(OUT, exist_ok=True)

GREEN = (0, 255, 136)
GREEN_SOFT = (140, 255, 200)
RED = (255, 85, 119)
BG_TOP = (8, 26, 16)
BG_BOTTOM = (0, 0, 0)

def load_font(size, bold=False):
    candidates = [
        ("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
        ("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size)
        except:
            pass
    return ImageFont.load_default()

def load_mono(size):
    for p in ["C:/Windows/Fonts/consolab.ttf", "C:/Windows/Fonts/consola.ttf"]:
        try:
            return ImageFont.truetype(p, size)
        except: pass
    return ImageFont.load_default()

def radial_bg(w, h):
    img = Image.new("RGB", (w, h), BG_BOTTOM)
    cx, cy = w // 2, h // 2
    max_r = (cx**2 + cy**2) ** 0.5
    pixels = img.load()
    for y in range(h):
        for x in range(w):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            t = min(d / max_r, 1)
            r = int(BG_TOP[0] * (1 - t) + BG_BOTTOM[0] * t)
            g = int(BG_TOP[1] * (1 - t) + BG_BOTTOM[1] * t)
            b = int(BG_TOP[2] * (1 - t) + BG_BOTTOM[2] * t)
            pixels[x, y] = (r, g, b)
    return img

def fast_radial_bg(w, h):
    # גרסה מהירה: ליניארי
    img = Image.new("RGB", (w, h))
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = abs(y - h/2) / (h/2)
        r = int(BG_TOP[0] * (1 - t) + BG_BOTTOM[0] * t)
        g = int(BG_TOP[1] * (1 - t) + BG_BOTTOM[1] * t)
        b = int(BG_TOP[2] * (1 - t) + BG_BOTTOM[2] * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return img

def add_glow_text(img, xy, text, font, color, glow_radius):
    s = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(s)
    d.text(xy, text, font=font, fill=color + (255,))
    glow = s.filter(ImageFilter.GaussianBlur(glow_radius))
    img.paste(glow, (0, 0), glow)
    img.paste(glow, (0, 0), glow)
    img.paste(s, (0, 0), s)

# ============ promo small tile 440x280 ============
def make_promo():
    img = fast_radial_bg(440, 280).convert("RGBA")

    # countdown big 5
    f = load_mono(150)
    add_glow_text(img, (60, 60), "5", f, GREEN, 12)

    # title
    add_glow_text(img, (180, 75), "YouTube", load_font(34, bold=True), (255, 255, 255), 4)
    add_glow_text(img, (180, 115), "Wait", load_font(34, bold=True), GREEN_SOFT, 6)

    # tagline
    add_glow_text(img, (60, 200), "Mindful browsing.", load_font(20), (200, 200, 200), 2)
    add_glow_text(img, (60, 228), "Stop the reflex.", load_font(20), (200, 200, 200), 2)

    img.save(os.path.join(OUT, "promo_small_440x280.png"))
    print("[OK] promo_small_440x280.png")

# ============ marquee 1400x560 ============
def make_marquee():
    img = fast_radial_bg(1400, 560).convert("RGBA")

    # big countdown left
    f = load_mono(360)
    add_glow_text(img, (140, 90), "5", f, GREEN, 28)

    # title
    add_glow_text(img, (480, 160), "YouTube Wait", load_font(82, bold=True), (255, 255, 255), 10)
    add_glow_text(img, (480, 260), "Breathe before you scroll.", load_font(42), GREEN_SOFT, 6)

    # tagline list
    d = ImageDraw.Draw(img)
    items = ["Pick why you're entering.", "Sit still for 10 seconds.", "Choose: yes, take my day - or no, I have a life."]
    f_small = load_font(28)
    for i, txt in enumerate(items):
        add_glow_text(img, (480, 370 + i * 42), "* " + txt, f_small, (180, 220, 200), 2)

    img.save(os.path.join(OUT, "marquee_1400x560.png"))
    print("[OK] marquee_1400x560.png")

# ============ screenshot mock - countdown 1280x800 ============
def make_screenshot_countdown():
    img = fast_radial_bg(1280, 800).convert("RGBA")
    d = ImageDraw.Draw(img)

    # stats bar top
    d.rectangle([(0, 0), (1280, 70)], fill=(40, 8, 12, 255))
    add_glow_text(img, (40, 12), "Today on YouTube", load_font(16), (200, 100, 120), 0)
    add_glow_text(img, (40, 32), "47 min", load_mono(26), RED, 4)
    add_glow_text(img, (1100, 28), "This week: 5:23 h", load_font(16), (200, 120, 140), 0)

    # title
    add_glow_text(img, (430, 130), "Sit still", load_font(54), (255, 255, 255), 4)
    add_glow_text(img, (290, 200), "Don't move the mouse. One moment of presence.", load_font(22), (180, 180, 180), 2)

    # big countdown
    add_glow_text(img, (560, 300), "8", load_mono(280), GREEN, 30)

    # hint
    add_glow_text(img, (440, 620), "Any movement resets the counter", load_font(22), (180, 230, 200), 3)

    # intent badge
    badge_w, badge_h = 380, 50
    bx = (1280 - badge_w) // 2
    by = 690
    d.rounded_rectangle([(bx, by), (bx + badge_w, by + badge_h)], radius=25,
                        outline=(0, 255, 136, 100), width=2, fill=(0, 80, 50, 60))
    add_glow_text(img, (bx + 50, by + 14), "You came for: Learn something specific", load_font(18), (200, 255, 220), 0)

    img.save(os.path.join(OUT, "screenshot_countdown_1280x800.png"))
    print("[OK] screenshot_countdown_1280x800.png")

# ============ screenshot mock - choice 1280x800 ============
def make_screenshot_choice():
    img = fast_radial_bg(1280, 800).convert("RGBA")
    d = ImageDraw.Draw(img)

    # stats bar
    d.rectangle([(0, 0), (1280, 70)], fill=(40, 8, 12, 255))
    add_glow_text(img, (40, 12), "Today on YouTube", load_font(16), (200, 100, 120), 0)
    add_glow_text(img, (40, 32), "47 min", load_mono(26), RED, 4)
    add_glow_text(img, (1100, 28), "This week: 5:23 h", load_font(16), (200, 120, 140), 0)

    # title
    add_glow_text(img, (380, 180), "So... entering YouTube?", load_font(50), (255, 255, 255), 4)

    # pun
    add_glow_text(img, (390, 280), "The algorithm's hungry. You're the bait.", load_font(24), (180, 180, 180), 1)

    # two buttons
    btn_w, btn_h = 320, 140
    gap = 60
    total_w = btn_w * 2 + gap
    start_x = (1280 - total_w) // 2
    y = 430

    # yes button (red)
    d.rounded_rectangle([(start_x, y), (start_x + btn_w, y + btn_h)], radius=10,
                        outline=RED + (200,), width=2)
    add_glow_text(img, (start_x + 28, y + 30), "Yes, take my day", load_font(26, bold=True), (255, 150, 180), 3)
    add_glow_text(img, (start_x + 28, y + 75), "I forfeit the next two hours", load_font(16), (200, 150, 170), 0)

    # no button (green)
    x2 = start_x + btn_w + gap
    d.rounded_rectangle([(x2, y), (x2 + btn_w, y + btn_h)], radius=10,
                        outline=GREEN + (200,), width=3)
    add_glow_text(img, (x2 + 28, y + 30), "No, I have a life", load_font(26, bold=True), GREEN_SOFT, 4)
    add_glow_text(img, (x2 + 28, y + 75), "Close this tab right now", load_font(16), (180, 220, 200), 0)

    img.save(os.path.join(OUT, "screenshot_choice_1280x800.png"))
    print("[OK] screenshot_choice_1280x800.png")

make_promo()
make_marquee()
make_screenshot_countdown()
make_screenshot_choice()
print(f"\nAll assets saved to: {OUT}")
