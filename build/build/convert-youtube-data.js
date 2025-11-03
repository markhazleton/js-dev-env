const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvFilePath = path.join(__dirname, '..', '..', 'src', 'data', 'youtube-top-100-songs-2025.csv');
const jsonFilePath = path.join(__dirname, '..', '..', 'docs', 'data', 'youtube-top-100-songs-2025.json');

// Ensure output directory exists
const outputDir = path.dirname(jsonFilePath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const results = [];

console.log('Converting YouTube songs CSV to JSON...');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => {
    // Transform and clean the data
    results.push({
      title: data.title || '',
      channel: data.channel || '',
      views: parseInt(data.view_count) || 0,
      duration: data.duration_string || '',
      followers: parseInt(data.channel_follower_count) || 0,
      category: data.categories || 'Music',
      thumbnail: data.thumbnail || '',
      channelUrl: data.channel_url || ''
    });
  })
  .on('end', () => {
    // Write JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2));
    console.log(`✅ Converted ${results.length} songs to JSON`);
    console.log(`📁 Output: ${jsonFilePath}`);
  })
  .on('error', (error) => {
    console.error('❌ Error converting CSV to JSON:', error);
    process.exit(1);
  });
