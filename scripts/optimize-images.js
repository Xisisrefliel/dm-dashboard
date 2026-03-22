#!/usr/bin/env bun
/**
 * Image Optimization Script
 *
 * Converts all JPG/PNG images in src/assets/ to WebP format with
 * appropriate resizing per category. Outputs to src/assets-optimized/
 * mirroring the original directory structure.
 *
 * Usage: bun scripts/optimize-images.js
 */

import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { join, parse } from "path";

const ASSETS_DIR = "src/assets";
const OUTPUT_DIR = "src/assets-optimized";

// Max width per category (height auto-scales to preserve aspect ratio)
const CATEGORY_CONFIG = {
  races: { maxWidth: 600, quality: 80 },
  classes: { maxWidth: 600, quality: 80 },
  backgrounds: { maxWidth: 600, quality: 80 },
  "race-landscapes": { maxWidth: 1920, quality: 80 },
};

async function optimizeDirectory(category) {
  const config = CATEGORY_CONFIG[category];
  if (!config) {
    console.log(`⏭️  Skipping unknown category: ${category}`);
    return;
  }

  const inputDir = join(ASSETS_DIR, category);
  const outputDir = join(OUTPUT_DIR, category);

  await mkdir(outputDir, { recursive: true });

  const files = await readdir(inputDir);
  const imageFiles = files.filter((f) =>
    /\.(jpg|jpeg|png)$/i.test(f)
  );

  console.log(`\n📁 ${category}/ — ${imageFiles.length} images`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of imageFiles) {
    const inputPath = join(inputDir, file);
    const { name } = parse(file);
    const outputPath = join(outputDir, `${name}.webp`);

    const inputFile = Bun.file(inputPath);
    const originalSize = inputFile.size;
    totalOriginal += originalSize;

    await sharp(inputPath)
      .resize({ width: config.maxWidth, withoutEnlargement: true })
      .webp({ quality: config.quality })
      .toFile(outputPath);

    const outputFile = Bun.file(outputPath);
    const optimizedSize = outputFile.size;
    totalOptimized += optimizedSize;

    const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    console.log(
      `  ✅ ${file} → ${name}.webp  (${formatBytes(originalSize)} → ${formatBytes(optimizedSize)}, -${reduction}%)`
    );
  }

  return { totalOriginal, totalOptimized };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function main() {
  console.log("🖼️  Image Optimization — JPG/PNG → WebP\n");

  const categories = await readdir(ASSETS_DIR);
  const dirs = [];
  for (const cat of categories) {
    const stat = await Bun.file(join(ASSETS_DIR, cat, ".")).exists?.() ?? false;
    // Check if it's a directory by trying to readdir
    try {
      await readdir(join(ASSETS_DIR, cat));
      dirs.push(cat);
    } catch {
      // Not a directory, skip
    }
  }

  let grandOriginal = 0;
  let grandOptimized = 0;

  for (const dir of dirs) {
    const result = await optimizeDirectory(dir);
    if (result) {
      grandOriginal += result.totalOriginal;
      grandOptimized += result.totalOptimized;
    }
  }

  const totalReduction = ((1 - grandOptimized / grandOriginal) * 100).toFixed(1);
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Total: ${formatBytes(grandOriginal)} → ${formatBytes(grandOptimized)} (-${totalReduction}%)`);
  console.log(`\n✨ Optimized images written to ${OUTPUT_DIR}/`);
  console.log(`   Update src/data/character-images.js imports to use these.`);
}

main().catch(console.error);
