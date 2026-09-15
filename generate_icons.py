import zlib
import struct
import math

def create_png(width, height, draw_func):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # Filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            raw_data.extend([r, g, b, a])
    
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png += struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk
    compressed = zlib.compress(bytes(raw_data), 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png

def icon_pixel(x, y, w, h, is_maskable=False):
    # Normalized coords (-1 to 1)
    nx = (x / w) * 2 - 1
    ny = (y / h) * 2 - 1
    
    # Base dark background #0a0c0e
    bg_r, bg_g, bg_b = 10, 12, 14
    
    # Gold accent: #c6a55e (198, 165, 94)
    gold_r, gold_g, gold_b = 198, 165, 94
    # Bright gold: #e2c67c
    bgold_r, bgold_g, bgold_b = 226, 198, 124

    scale = 0.7 if is_maskable else 0.85
    sx = nx / scale
    sy = ny / scale
    
    dist_center = math.sqrt(sx*sx + sy*sy)
    
    # Dome silhouette and crescent
    # Let's draw a crescent moon at the center
    # Crescent: Outer circle radius 0.45 centered at (0, -0.05)
    # Inner circle radius 0.38 centered at (0.15, -0.12)
    c_out = math.sqrt((sx - 0.0)**2 + (sy - (-0.05))**2)
    c_in = math.sqrt((sx - 0.16)**2 + (sy - (-0.14))**2)
    
    is_crescent = (c_out <= 0.46) and (c_in >= 0.36)
    
    # Star near crescent
    star_dist = math.sqrt((sx - 0.18)**2 + (sy - (-0.18))**2)
    is_star = star_dist <= 0.08
    
    # Minaret/base arch at the bottom
    is_arch = (sy >= 0.32) and (sy <= 0.7) and (abs(sx) <= 0.45)
    arch_inner = math.sqrt(sx**2 + ((sy - 0.52)*1.5)**2) <= 0.22 and sy >= 0.42
    if arch_inner:
        is_arch = False

    # Outer rounded border circle for standard icon
    is_ring = abs(dist_center - 0.9) <= 0.04
    
    if is_crescent or is_star:
        # Subtle gradient on gold
        factor = (1.0 - sy * 0.5)
        r = min(255, int(bgold_r * factor))
        g = min(255, int(bgold_g * factor))
        b = min(255, int(bgold_b * factor))
        return (r, g, b, 255)
    elif is_arch or is_ring:
        return (gold_r, gold_g, gold_b, 255)
    else:
        # Background subtle vignette
        vignette = max(0.0, min(1.0, 1.0 - dist_center * 0.3))
        return (int(bg_r * vignette), int(bg_g * vignette), int(bg_b * vignette), 255)

for size in [192, 512]:
    png_data = create_png(size, size, lambda x, y, w, h: icon_pixel(x, y, w, h, is_maskable=False))
    with open(f'public/pwa-{size}x{size}.png', 'wb') as f:
        f.write(png_data)
    print(f"Generated public/pwa-{size}x{size}.png")

maskable_data = create_png(512, 512, lambda x, y, w, h: icon_pixel(x, y, w, h, is_maskable=True))
with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(maskable_data)
print("Generated public/pwa-maskable-512x512.png")

apple_icon = create_png(180, 180, lambda x, y, w, h: icon_pixel(x, y, w, h, is_maskable=False))
with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(apple_icon)
with open('public/favicon.ico', 'wb') as f:
    f.write(apple_icon)
print("Generated apple-touch-icon and favicon")
