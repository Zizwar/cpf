const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

async function convertDocxToTxt(docxPath) {
    try {
        const result = await mammoth.extractRawText({ path: docxPath });
        const txtPath = docxPath.replace(/\.docx?$/i, '.txt');

        fs.writeFileSync(txtPath, result.value, 'utf8');
        console.log(`✓ تم تحويل: ${path.basename(docxPath)}`);
        return true;
    } catch (error) {
        console.error(`✗ فشل تحويل ${path.basename(docxPath)}:`, error.message);
        return false;
    }
}

async function findAndConvertDocx(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let converted = 0;

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            converted += await findAndConvertDocx(fullPath);
        } else if (file.name.match(/\.docx?$/i)) {
            const success = await convertDocxToTxt(fullPath);
            if (success) converted++;
        }
    }

    return converted;
}

async function main() {
    console.log('بدء تحويل ملفات .docx إلى .txt...\n');

    const sourceDir = path.join(__dirname, 'source/book');
    const totalConverted = await findAndConvertDocx(sourceDir);

    console.log(`\n✓ تم تحويل ${totalConverted} ملف بنجاح!`);
}

main().catch(console.error);
