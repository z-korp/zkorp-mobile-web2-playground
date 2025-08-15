# Apple Sign-In JWT Generator

This tool generates JWT tokens required for configuring Apple Sign-In with Supabase.

## Prerequisites

1. **Apple Developer Account** with Sign in with Apple capability enabled
2. **Service ID** created in Apple Developer portal
3. **Private Key** (.p8 file) for Sign in with Apple

## Setup Instructions

### 1. Get Your Apple Credentials

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/authkeys/list)
2. Create a new key for "Sign in with Apple"
3. Note down:
   - **Key ID**: 10-character string (e.g., `ABC123DEFG`)
   - **Team ID**: Already in your app.json (`NHD2X7LA86`)
4. Download the private key (.p8 file)
   - ⚠️ **Important**: Apple only lets you download this once!

### 2. Configure the Script

1. Place your `.p8` file in this directory (`scripts/apple-jwt-generator/`)
2. Edit `generateAppleJWT.js` and update:
   ```javascript
   KEY_ID: 'YOUR_KEY_ID_HERE',  // Replace with your 10-character Key ID
   PRIVATE_KEY_FILE: 'AuthKey_YOUR_KEY_ID.p8'  // Replace with your actual filename
   ```

### 3. Generate the JWT

Run the script:
```bash
cd scripts/apple-jwt-generator
npm run generate
# or
node generateAppleJWT.js
```

### 4. Configure Supabase

1. Copy the generated JWT token
2. Go to [Supabase Dashboard](https://supabase.com/dashboard)
3. Navigate to **Authentication → Providers → Apple**
4. Configure:
   - **Client ID**: `com.provablemat.zkorp-web2-playground.auth`
   - **Secret**: Paste your JWT token here
5. Click **Save**

## Important Notes

- **JWT Expiration**: The token expires after 6 months (Apple's maximum)
- **Security**: Never commit your `.p8` file or JWT token to version control
- **Service ID**: Must match between Apple Developer portal and Supabase configuration

## Troubleshooting

### "Private key file not found"
- Ensure the `.p8` file is in the same directory as the script
- Check the filename matches exactly in the configuration

### "Invalid key format"
- Make sure you're using the correct `.p8` file from Apple
- The file should start with `-----BEGIN PRIVATE KEY-----`

### Sign-in fails after configuration
- Verify the Client ID matches in both Supabase and your app
- Check that your bundle identifier is correct
- Ensure the Service ID is properly configured in Apple Developer portal

## Files in this Directory

- `generateAppleJWT.js` - The JWT generation script
- `package.json` - Node.js dependencies
- `README.md` - This documentation
- `.gitignore` - Ensures sensitive files aren't committed
- Your `.p8` file (add this yourself, not tracked by git)