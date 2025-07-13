# 🔐 Guide des Logins Valides - Test d'Authentification

## ✅ **Logins Valides pour Tester**

### **1. Super Admin (Administrateur)**
```
Username: admin
Password: admin123
Email: admin@socialmedia.com
Rôle: superAdmin
```

### **2. Utilisateur Développeur**
```
Username: aminfradi
Password: user123
Email: user1@example.com
Rôle: user
```

### **3. Utilisateur Test 1**
```
Username: johndoe
Password: user123
Email: user2@example.com
Rôle: user
```

### **4. Utilisateur Test 2**
```
Username: janesmith
Password: user123
Email: user3@example.com
Rôle: user
```

## 🚀 **Étapes de Configuration Keycloak**

### **Étape 1: Créer les Utilisateurs dans Keycloak**

1. **Accéder à Keycloak Admin Console**
   - URL: `http://localhost:8081`
   - Login: `admin` / `admin`

2. **Créer l'utilisateur Super Admin**
   - **Users** → **Add User**
   - **Username**: `admin`
   - **Email**: `admin@socialmedia.com`
   - **First Name**: `Super`
   - **Last Name**: `Admin`
   - **Email Verified**: `ON`
   - **Save**

3. **Définir le mot de passe Super Admin**
   - **Credentials** tab
   - **Password**: `admin123`
   - **Temporary**: `OFF`
   - **Set Password**

4. **Assigner le rôle Super Admin**
   - **Role Mappings** tab
   - **Realm Roles**: Assigner `superAdmin`

5. **Créer les autres utilisateurs**
   - Répéter pour `aminfradi`, `johndoe`, `janesmith`
   - Mot de passe: `user123`
   - Rôle: `user`

## 🧪 **Tests de Vérification**

### **Test 1: Vérifier Keycloak**
```bash
# Test de connexion Keycloak
curl -X POST http://localhost:8081/realms/libertalk/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=social-media-frontend" \
  -d "username=admin" \
  -d "password=admin123"
```

### **Test 2: Vérifier le Backend**
```bash
# Test avec token
curl -X GET http://localhost:8084/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Test 3: Test Frontend**
1. Démarrer le frontend: `npm run dev`
2. Aller sur `http://localhost:3000`
3. Cliquer sur "Login"
4. Utiliser les credentials ci-dessus

## 🔍 **Vérification dans le Navigateur**

### **Console JavaScript - Tests**
```javascript
// Test 1: Vérifier Keycloak
fetch('http://localhost:8081/realms/libertalk/.well-known/openid_configuration')
  .then(response => response.json())
  .then(data => console.log('✅ Keycloak accessible:', data))
  .catch(error => console.error('❌ Keycloak inaccessible:', error));

// Test 2: Vérifier l'authentification
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('auth_user'));

// Test 3: Vérifier les rôles
const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
console.log('Rôles:', user.roles);
```

### **Network Tab - Vérifications**
1. **Ouvrir DevTools** (F12)
2. **Network tab**
3. **Tester la connexion**:
   - Vérifier les appels vers `localhost:8081`
   - Vérifier les appels vers `localhost:8084`
   - Vérifier les tokens dans les headers

## 📋 **Checklist de Vérification**

### **✅ Keycloak Configuration**
- [ ] Keycloak running sur `http://localhost:8081`
- [ ] Realm `libertalk` créé
- [ ] Client `social-media-frontend` configuré
- [ ] Utilisateurs créés avec bons mots de passe
- [ ] Rôles assignés correctement

### **✅ Backend Configuration**
- [ ] Backend running sur `http://localhost:8084`
- [ ] Base de données PostgreSQL connectée
- [ ] JWT validation configurée
- [ ] CORS configuré

### **✅ Frontend Configuration**
- [ ] Frontend running sur `http://localhost:3000`
- [ ] Keycloak client configuré
- [ ] AuthProvider fonctionnel
- [ ] Token storage working

## 🎯 **Tests Spécifiques par Rôle**

### **Test Super Admin**
```javascript
// Vérifier les privilèges admin
const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
console.log('Is Super Admin:', user.roles?.includes('superAdmin'));
```

### **Test Utilisateur Normal**
```javascript
// Vérifier les privilèges utilisateur
const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
console.log('Is User:', user.roles?.includes('user'));
```

## 🔧 **Dépannage Rapide**

### **Problème: "Client not found"**
**Solution**: Créer le client `social-media-frontend` dans Keycloak

### **Problème: "Invalid credentials"**
**Solution**: Vérifier les mots de passe dans Keycloak Admin Console

### **Problème: "CORS error"**
**Solution**: Ajouter les Web Origins dans la configuration du client

### **Problème: "Token expired"**
**Solution**: Vérifier la configuration du refresh token

## 🚀 **Commandes de Test Rapide**

```bash
# 1. Démarrer Keycloak
docker run -p 8081:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev

# 2. Démarrer le backend
cd socialMediaBackend
mvn spring-boot:run

# 3. Démarrer le frontend
cd front_end_social_media
npm run dev

# 4. Tester avec un utilisateur
# Aller sur http://localhost:3000
# Login: admin / admin123
```

## ✅ **Résultat Attendu**

Après connexion réussie:
- ✅ Redirection vers Keycloak login
- ✅ Authentification avec credentials
- ✅ Retour vers l'application
- ✅ Token stocké dans localStorage
- ✅ User info affiché dans l'interface
- ✅ Rôles disponibles pour l'autorisation

**Vos logins sont maintenant prêts pour tester l'authentification complète !** 🎉 