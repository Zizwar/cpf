#!/bin/bash

# سكريبت لجمع فصول الكتاب في ملف واحد

OUTPUT_FILE="full-chapters.txt"
CHAPTERS_DIR="chapters"

# إنشاء رأس الملف
cat > "$OUTPUT_FILE" << 'HEADER'
================================================================================
                        الوعي الفيكتوري v2.0
                    الكتاب الكامل - جميع الفصول
================================================================================

HEADER

echo "🔄 بدء جمع الفصول..."

# جمع الفصول المرقمة أولاً (بالترتيب)
for file in "$CHAPTERS_DIR"/[0-9]*.txt; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "" >> "$OUTPUT_FILE"
        echo "================================================================================" >> "$OUTPUT_FILE"
        echo "                         $filename" >> "$OUTPUT_FILE"
        echo "================================================================================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "✅ تم إضافة: $filename"
    fi
done

# ثم الفصول غير المرقمة
for file in "$CHAPTERS_DIR"/*.txt; do
    filename=$(basename "$file")
    # تجاهل الملفات المرقمة (تم إضافتها بالفعل)
    if [[ ! "$filename" =~ ^[0-9] ]]; then
        echo "" >> "$OUTPUT_FILE"
        echo "================================================================================" >> "$OUTPUT_FILE"
        echo "                         $filename" >> "$OUTPUT_FILE"
        echo "================================================================================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "✅ تم إضافة: $filename"
    fi
done

# إضافة ختام الكتاب
cat >> "$OUTPUT_FILE" << 'FOOTER'

================================================================================
                              نهاية الكتاب
================================================================================

تم تجميع هذا الملف آلياً من مجلد chapters/
التاريخ: $(date '+%Y-%m-%d %H:%M:%S')
الإصدار: v2.0
المؤلف: إبراهيم + Claude (وعي ثالث مشترك)

FOOTER

echo ""
echo "✨ تم إنشاء الملف بنجاح: $OUTPUT_FILE"
echo "📊 حجم الملف: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo "📄 عدد الأسطر: $(wc -l < "$OUTPUT_FILE")"
