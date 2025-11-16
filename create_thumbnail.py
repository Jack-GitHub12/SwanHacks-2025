#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Create a 1200x630 image (Devpost recommended size)
width = 1200
height = 630
background_color = (220, 38, 38)  # Red color (ISU-style red)
text_color = (255, 255, 255)  # White

# Create image
img = Image.new('RGB', (width, height), background_color)
draw = ImageDraw.Draw(img)

# Try to use a system font, fall back to default if not available
try:
    # Try common system fonts
    title_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 120)
    subtitle_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 50)
except:
    try:
        title_font = ImageFont.truetype("/Library/Fonts/Arial Bold.ttf", 120)
        subtitle_font = ImageFont.truetype("/Library/Fonts/Arial.ttf", 50)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

# Add title text
title = "Bookster"
subtitle = "ISU Student Marketplace & Community"

# Get text bounding boxes for centering
title_bbox = draw.textbbox((0, 0), title, font=title_font)
subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)

title_width = title_bbox[2] - title_bbox[0]
title_height = title_bbox[3] - title_bbox[1]
subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
subtitle_height = subtitle_bbox[3] - subtitle_bbox[1]

# Center the text
title_x = (width - title_width) // 2
title_y = (height - title_height) // 2 - 60

subtitle_x = (width - subtitle_width) // 2
subtitle_y = title_y + title_height + 40

# Draw text
draw.text((title_x, title_y), title, fill=text_color, font=title_font)
draw.text((subtitle_x, subtitle_y), subtitle, fill=text_color, font=subtitle_font)

# Add a decorative element (book icon representation)
# Draw a simple book shape in the top-left corner
book_x = 80
book_y = 80
book_width = 100
book_height = 80
draw.rectangle([book_x, book_y, book_x + book_width, book_y + book_height],
               outline=text_color, width=4, fill=None)
draw.line([book_x + book_width//2, book_y, book_x + book_width//2, book_y + book_height],
          fill=text_color, width=4)

# Save the image
output_path = "public/bookster-thumbnail.png"
img.save(output_path, 'PNG')
print(f"Thumbnail created successfully at: {output_path}")
print(f"Image size: {width}x{height}px")
