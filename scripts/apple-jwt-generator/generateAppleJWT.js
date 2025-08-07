// generateAppleJWT.js
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - Replace these with your actual values
const CONFIG = {
  // Your Apple Team ID (10-character string from Apple Developer Account)
  TEAM_ID: 'NHD2X7LA86', // Already in your app.json

  // Your Key ID (10-character string from Apple Developer Account)
  // You can find this in Certificates, Identifiers & Profiles > Keys
  KEY_ID: '45JDH44V38', // REPLACE THIS

  // Your Service ID (usually your bundle ID with .auth suffix)
  // This should match what you configure in Supabase
  CLIENT_ID: 'com.provablemat.zkorp-web2-playground.auth',

  // Path to your private key file (.p8 file from Apple)
  // Place the .p8 file in the same directory as this script
  PRIVATE_KEY_FILE: 'AuthKey_45JDH44V38.p8', // REPLACE THIS with your actual filename
};

// Validation
function validateConfig() {
  const errors = [];

  if (CONFIG.KEY_ID === 'YOUR_KEY_ID_HERE') {
    errors.push(
      '❌ KEY_ID is not configured. Get this from your Apple Developer Account.'
    );
  }

  if (CONFIG.PRIVATE_KEY_FILE.includes('YOUR_KEY_ID')) {
    errors.push(
      '❌ PRIVATE_KEY_FILE is not configured. Update the filename to match your .p8 file.'
    );
  }

  const keyPath = path.join(__dirname, CONFIG.PRIVATE_KEY_FILE);
  if (!fs.existsSync(keyPath)) {
    errors.push(`❌ Private key file not found at: ${keyPath}`);
    errors.push(
      '   Make sure to place your .p8 file in the same directory as this script.'
    );
  }

  if (errors.length > 0) {
    console.log('\n⚠️  Configuration Issues:\n');
    errors.forEach((error) => console.log(error));
    console.log('\n📋 Instructions:');
    console.log(
      '1. Go to https://developer.apple.com/account/resources/authkeys/list'
    );
    console.log('2. Create or select your Sign in with Apple key');
    console.log('3. Note the Key ID (10-character string)');
    console.log('4. Download the .p8 private key file');
    console.log(
      '5. Place the .p8 file in this directory: scripts/apple-jwt-generator/'
    );
    console.log('6. Update the CONFIG values in this script\n');
    process.exit(1);
  }
}

// Generate JWT
function generateJWT() {
  try {
    // Read the private key
    const privateKeyPath = path.join(__dirname, CONFIG.PRIVATE_KEY_FILE);
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    // Generate the JWT
    const jwtToken = jwt.sign(
      {
        iss: CONFIG.TEAM_ID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 15777000, // 6 months (maximum allowed by Apple)
        aud: 'https://appleid.apple.com',
        sub: CONFIG.CLIENT_ID,
      },
      privateKey,
      {
        algorithm: 'ES256',
        keyid: CONFIG.KEY_ID,
      }
    );

    return jwtToken;
  } catch (error) {
    console.error('❌ Error generating JWT:', error.message);
    process.exit(1);
  }
}

// Main execution
function main() {
  console.log('🍎 Apple Sign-In JWT Generator\n');
  console.log('Configuration:');
  console.log(`  Team ID: ${CONFIG.TEAM_ID}`);
  console.log(`  Key ID: ${CONFIG.KEY_ID}`);
  console.log(`  Client ID: ${CONFIG.CLIENT_ID}`);
  console.log(`  Private Key: ${CONFIG.PRIVATE_KEY_FILE}\n`);

  // Validate configuration
  validateConfig();

  // Generate the JWT
  console.log('🔐 Generating JWT...\n');
  const token = generateJWT();

  console.log('✅ JWT Generated Successfully!\n');
  console.log('='.repeat(80));
  console.log('\n📋 YOUR JWT TOKEN (copy everything below):\n');
  console.log(token);
  console.log('\n' + '='.repeat(80));

  console.log('\n📌 Next Steps:');
  console.log('1. Copy the JWT token above');
  console.log('2. Go to your Supabase Dashboard');
  console.log('3. Navigate to Authentication → Providers → Apple');
  console.log('4. Configure with:');
  console.log(`   - Client ID: ${CONFIG.CLIENT_ID}`);
  console.log('   - Secret: [Paste the JWT token]');
  console.log('5. Save the configuration');
  console.log('\n✨ Your Apple Sign-In is now configured!\n');

  // Show expiration info
  const expirationDate = new Date(Date.now() + 15777000 * 1000);
  console.log(
    `⏰ Note: This JWT expires on ${expirationDate.toLocaleDateString()}`
  );
  console.log("   You'll need to regenerate it before then.\n");
}

// Run the script
main();
