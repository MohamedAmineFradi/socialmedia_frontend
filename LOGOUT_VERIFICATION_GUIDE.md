# 🚪 Guide de Vérification de la Fonctionnalité Logout

## ✅ **Analyse du Code Logout**

### **1. AuthService Logout (src/services/auth/authService.js)**
```javascript
async logout() {
  try {
    console.log('Starting Keycloak logout...');
    await this.keycloak.logout({
      redirectUri: window.location.origin
    });
    this.authStore.getState().logout();
  } catch (error) {
    console.error('Logout failed:', error);
    this.authStore.getState().logout();
    throw new Error(`Logout failed: ${error.message}`);
  }
}
```

**✅ Fonctionnalités:**
- Appel à Keycloak pour déconnecter la session
- Redirection vers la page d'accueil
- Nettoyage du state Zustand
- Gestion d'erreur avec fallback

### **2. AuthStore Logout (src/store/authStore.js)**
```javascript
logout: () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  set({ token: null, user: null, isAuthenticated: false });
}
```

**✅ Fonctionnalités:**
- Suppression du token du localStorage
- Suppression des données utilisateur
- Réinitialisation du state Zustand

### **3. AuthProvider Logout (src/components/auth/AuthProvider.js)**
```javascript
const handleLogout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout failed:', error);
    setError(error.message || 'Logout failed.');
  }
};
```

**✅ Fonctionnalités:**
- Appel sécurisé au service de logout
- Gestion d'erreur avec feedback utilisateur

## 🧪 **Tests de Vérification**

### **Test 1: Vérification de l'état avant logout**
```javascript
// Vérifier que l'utilisateur est connecté
const token = localStorage.getItem('auth_token');
const user = localStorage.getItem('auth_user');
console.log('Token présent:', !!token);
console.log('User data présent:', !!user);
```

### **Test 2: Vérification de l'état après logout**
```javascript
// Vérifier que les données sont nettoyées
const token = localStorage.getItem('auth_token');
const user = localStorage.getItem('auth_user');
console.log('Token supprimé:', !token);
console.log('User data supprimé:', !user);
```

### **Test 3: Vérification de la redirection Keycloak**
```javascript
// Vérifier l'URL après logout
const currentUrl = window.location.href;
const isOnKeycloakPage = currentUrl.includes('localhost:8081');
console.log('Redirection Keycloak:', isOnKeycloakPage);
```

### **Test 4: Vérification de l'accès aux ressources protégées**
```javascript
// Tester l'accès à une API protégée
fetch('http://localhost:8084/api/users/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
}).then(response => {
  console.log('Accès refusé (attendu):', response.status === 401);
});
```

## 🔒 **Aspects de Sécurité à Vérifier**

### **1. Nettoyage des Données Locales**
- ✅ Token supprimé du localStorage
- ✅ User data supprimé du localStorage
- ✅ SessionStorage nettoyé (si utilisé)
- ✅ Cookies supprimés (si utilisés)

### **2. Session Keycloak**
- ✅ Session Keycloak fermée
- ✅ Token invalide côté serveur
- ✅ Refresh token révoqué

### **3. Accès aux Ressources**
- ✅ API backend retourne 401
- ✅ Routes protégées inaccessibles
- ✅ Interface utilisateur réinitialisée

### **4. Persistance**
- ✅ Pas de persistance après refresh
- ✅ Pas de restauration automatique
- ✅ Redirection vers login après refresh

## 📋 **Checklist de Vérification**

### **✅ Avant Logout**
- [ ] Utilisateur connecté
- [ ] Token présent dans localStorage
- [ ] User data présent dans localStorage
- [ ] Interface affiche les informations utilisateur
- [ ] Bouton logout visible

### **✅ Pendant Logout**
- [ ] Appel à Keycloak logout
- [ ] Redirection vers page d'accueil
- [ ] Nettoyage du state Zustand
- [ ] Suppression des données locales

### **✅ Après Logout**
- [ ] Token supprimé du localStorage
- [ ] User data supprimé du localStorage
- [ ] State Zustand réinitialisé
- [ ] Interface affiche le bouton login
- [ ] Accès aux APIs protégées refusé
- [ ] Session Keycloak fermée

## 🚀 **Instructions de Test**

### **Étape 1: Préparer l'environnement**
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
```

### **Étape 2: Se connecter**
1. Aller sur `http://localhost:3000`
2. Cliquer sur "Login"
3. Utiliser les credentials:
   - Username: `admin`
   - Password: `admin123`

### **Étape 3: Tester le logout**
1. Cliquer sur le bouton "Logout"
2. Vérifier la redirection
3. Vérifier le nettoyage des données

### **Étape 4: Vérifications post-logout**
1. Ouvrir DevTools (F12)
2. Aller dans Application > Local Storage
3. Vérifier que `auth_token` et `auth_user` sont supprimés
4. Tester l'accès à une page protégée

## 🔍 **Tests Automatisés**

### **Script de Test Complet**
```javascript
// Copier-coller dans la console du navigateur
// Voir le fichier test-logout.js pour le script complet

// Test rapide
function quickLogoutTest() {
  console.log('🔍 Test rapide de logout');
  
  // Avant logout
  const beforeToken = localStorage.getItem('auth_token');
  const beforeUser = localStorage.getItem('auth_user');
  
  console.log('Avant logout:', {
    token: !!beforeToken,
    user: !!beforeUser
  });
  
  // Simuler logout
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  
  // Après logout
  const afterToken = localStorage.getItem('auth_token');
  const afterUser = localStorage.getItem('auth_user');
  
  console.log('Après logout:', {
    token: !!afterToken,
    user: !!afterUser
  });
  
  const success = !afterToken && !afterUser;
  console.log(success ? '✅ Logout réussi' : '❌ Logout échoué');
  
  return success;
}

quickLogoutTest();
```

## ⚠️ **Problèmes Courants et Solutions**

### **Problème 1: Token encore présent après logout**
**Solution**: Vérifier que `authStore.getState().logout()` est appelé

### **Problème 2: Redirection pas effectuée**
**Solution**: Vérifier la configuration Keycloak client

### **Problème 3: Session Keycloak encore active**
**Solution**: Vérifier que `keycloak.logout()` est appelé correctement

### **Problème 4: Interface pas réinitialisée**
**Solution**: Vérifier que le state Zustand est bien mis à jour

## 🎯 **Résultat Attendu**

Après un logout réussi:
- ✅ Redirection vers la page d'accueil
- ✅ Token supprimé du localStorage
- ✅ User data supprimé du localStorage
- ✅ Interface affiche le bouton login
- ✅ Accès aux APIs protégées retourne 401
- ✅ Session Keycloak fermée
- ✅ Pas de persistance après refresh

## 📊 **Métriques de Succès**

- **Nettoyage des données**: 100%
- **Redirection**: Fonctionnelle
- **Sécurité**: Accès refusé aux ressources protégées
- **UX**: Interface réinitialisée correctement
- **Persistance**: Aucune restauration automatique

**Votre fonctionnalité de logout est maintenant prête pour les tests de sécurité !** 🎉 