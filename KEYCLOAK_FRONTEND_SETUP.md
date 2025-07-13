# Keycloak Frontend Client Setup Guide

## 🚨 **Current Issue: Keycloak Initialization Error**

The error `Keycloak initialization failed: undefined` indicates that the frontend client `social-media-frontend` is not properly configured in Keycloak.

## 📋 **Step-by-Step Frontend Client Setup**

### Step 1: Create Frontend Client in Keycloak

1. **Login to Keycloak Admin Console**
   - Go to `http://localhost:8081`
   - Login with `admin` / `admin`

2. **Navigate to Clients**
   - In left sidebar, click "Clients"
   - Click "Create"

3. **Configure Frontend Client**
   - **Client ID**: `social-media-frontend`
   - **Client Protocol**: `openid-connect`
   - Click "Save"

### Step 2: Configure Client Settings

1. **Basic Settings Tab**
   - **Access Type**: `public` (for frontend applications)
   - **Valid Redirect URIs**: 
     - `http://localhost:3000/*`
     - `http://localhost:3001/*`
     - `http://localhost:3000/silent-check-sso.html`
   - **Web Origins**: 
     - `http://localhost:3000`
     - `http://localhost:3001`
   - **Client authentication**: `OFF` (for public clients)
   - Click "Save"

2. **Advanced Settings Tab**
   - **Proof Key for Code Exchange (PKCE)**: `ON`
   - **Implicit flow**: `OFF`
   - **Standard flow**: `ON`
   - Click "Save"

### Step 3: Configure Client Scopes

1. **Go to Client Scopes Tab**
   - Click on "Client Scopes" tab

2. **Assign Default Client Scopes**
   - In "Assigned Default Client Scopes" section, add:
     - `openid`
     - `profile`
     - `email`
     - `basic`

### Step 4: Configure Token Settings

1. **Go to Client Scopes Tab**
   - Click on "Client Scopes" tab

2. **Configure Token Mappers**
   - Click on "Mappers" tab
   - Click "Create"
   - **Name**: `realm roles`
   - **Mapper Type**: `User Realm Role`
   - **Token Claim Name**: `realm_access.roles`
   - **Full group path**: `OFF`
   - **Add to ID token**: `ON`
   - **Add to access token**: `ON`
   - **Add to userinfo**: `ON`
   - Click "Save"

### Step 5: Create Silent Check SSO Page

Create a file for silent SSO checking:

```html
<!-- public/silent-check-sso.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Silent SSO Check</title>
</head>
<body>
    <script>
        parent.postMessage(location.href, location.origin);
    </script>
</body>
</html>
```

## 🔧 **Frontend Configuration Files**

### 1. **Keycloak Configuration** (`src/services/auth/keycloak.js`)
```javascript
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8081',
  realm: 'libertalk',
  clientId: 'social-media-frontend',
};

console.log('Keycloak config:', keycloakConfig);

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
```

### 2. **AuthService Configuration** (`src/services/auth/authService.js`)
```javascript
// Keycloak initialization options
const authenticated = await this.keycloak.init({
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false,
  enableLogging: true,
  pkceMethod: 'S256' // Enable PKCE for better security
});
```

## 🧪 **Testing the Setup**

### 1. **Test Keycloak Connection**
```javascript
// In browser console
fetch('http://localhost:8081/realms/libertalk/.well-known/openid_configuration')
  .then(response => response.json())
  .then(data => console.log('Keycloak config:', data))
  .catch(error => console.error('Keycloak not accessible:', error));
```

### 2. **Test Frontend Authentication**
1. Start your React app: `npm run dev`
2. Navigate to login page
3. Should redirect to Keycloak login
4. After login, should return to your app

### 3. **Debug Steps**
```javascript
// Add to your AuthProvider for debugging
console.log('Keycloak instance:', keycloak);
console.log('Keycloak config:', keycloakConfig);
```

## 🔍 **Troubleshooting Common Issues**

### Issue 1: "Client not found"
**Solution**: Create the `social-media-frontend` client in Keycloak

### Issue 2: "CORS error"
**Solution**: Add proper Web Origins in Keycloak client settings

### Issue 3: "Invalid redirect URI"
**Solution**: Add your app URLs to Valid Redirect URIs

### Issue 4: "Network error"
**Solution**: Ensure Keycloak is running on `http://localhost:8081`

## ✅ **Configuration Checklist**

- [ ] Keycloak server running on port 8081
- [ ] Realm `libertalk` exists
- [ ] Client `social-media-frontend` created
- [ ] Client access type set to `public`
- [ ] Valid redirect URIs configured
- [ ] Web origins configured
- [ ] PKCE enabled
- [ ] Client scopes assigned
- [ ] Token mappers configured
- [ ] Silent check SSO page created
- [ ] Frontend Keycloak config updated

## 🎯 **Two-Client Architecture Explained**

### Backend Client (`social-media-backend`)
- **Access Type**: `confidential`
- **Purpose**: Backend API authentication
- **Token Type**: Access tokens for API calls
- **Configuration**: Server-side only

### Frontend Client (`social-media-frontend`)
- **Access Type**: `public`
- **Purpose**: User authentication in browser
- **Token Type**: ID tokens and access tokens
- **Configuration**: Client-side JavaScript

This is the **standard OAuth2/OIDC architecture** for web applications!

## 🚀 **Quick Fix Commands**

If you need to quickly test:

```bash
# 1. Start Keycloak
docker run -p 8081:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev

# 2. Follow the setup steps above

# 3. Start your frontend
cd front_end_social_media
npm run dev
```

Your frontend should now connect to Keycloak successfully! 🎉 