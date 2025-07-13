// Script de test pour vérifier les logins Keycloak
// À exécuter dans la console du navigateur

console.log('🔐 Test des Logins Keycloak - Social Media App');

// Configuration des utilisateurs de test
const testUsers = [
  {
    name: 'Super Admin',
    username: 'admin',
    password: 'admin123',
    email: 'admin@socialmedia.com',
    expectedRole: 'superAdmin'
  },
  {
    name: 'Développeur',
    username: 'aminfradi',
    password: 'user123',
    email: 'user1@example.com',
    expectedRole: 'user'
  },
  {
    name: 'Utilisateur Test 1',
    username: 'johndoe',
    password: 'user123',
    email: 'user2@example.com',
    expectedRole: 'user'
  },
  {
    name: 'Utilisateur Test 2',
    username: 'janesmith',
    password: 'user123',
    email: 'user3@example.com',
    expectedRole: 'user'
  }
];

// Test 1: Vérifier l'accessibilité de Keycloak
async function testKeycloakAccess() {
  console.log('\n🧪 Test 1: Vérification de l\'accessibilité Keycloak');
  
  try {
    const response = await fetch('http://localhost:8081/realms/libertalk/.well-known/openid_configuration');
    const data = await response.json();
    console.log('✅ Keycloak accessible:', data.issuer);
    return true;
  } catch (error) {
    console.error('❌ Keycloak inaccessible:', error.message);
    console.log('💡 Solution: Démarrer Keycloak avec Docker');
    return false;
  }
}

// Test 2: Vérifier l'authentification d'un utilisateur
async function testUserAuthentication(username, password) {
  console.log(`\n🔐 Test d'authentification pour: ${username}`);
  
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', 'social-media-frontend');
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch('http://localhost:8081/realms/libertalk/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Authentification réussie pour ${username}`);
      console.log('📋 Token reçu:', data.access_token ? 'OUI' : 'NON');
      console.log('📋 Refresh token:', data.refresh_token ? 'OUI' : 'NON');
      
      // Décoder le token pour vérifier les claims
      const tokenParts = data.access_token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('👤 User info:', {
          subject: payload.sub,
          username: payload.preferred_username,
          email: payload.email,
          roles: payload.realm_access?.roles || []
        });
      }
      
      return data;
    } else {
      const error = await response.text();
      console.error(`❌ Échec d'authentification pour ${username}:`, error);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erreur d'authentification pour ${username}:`, error.message);
    return null;
  }
}

// Test 3: Vérifier l'état de l'authentification frontend
function testFrontendAuth() {
  console.log('\n🌐 Test 3: Vérification de l\'état frontend');
  
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('auth_user');
  
  if (token && user) {
    console.log('✅ Token stocké dans localStorage');
    console.log('✅ User info stocké dans localStorage');
    
    try {
      const userData = JSON.parse(user);
      console.log('👤 User data:', userData);
      console.log('🔑 Rôles:', userData.roles || []);
    } catch (error) {
      console.error('❌ Erreur parsing user data:', error);
    }
  } else {
    console.log('⚠️ Aucun token ou user data trouvé dans localStorage');
    console.log('💡 Solution: Se connecter via l\'interface utilisateur');
  }
}

// Test 4: Vérifier la connexion backend
async function testBackendConnection() {
  console.log('\n🔗 Test 4: Vérification de la connexion backend');
  
  try {
    const response = await fetch('http://localhost:8084/api/public/test');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend accessible:', data.message);
      return true;
    } else {
      console.error('❌ Backend inaccessible:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur de connexion backend:', error.message);
    console.log('💡 Solution: Démarrer le backend Spring Boot');
    return false;
  }
}

// Test 5: Vérifier l'authentification backend avec token
async function testBackendAuth(token) {
  console.log('\n🔐 Test 5: Vérification de l\'authentification backend');
  
  if (!token) {
    console.log('⚠️ Aucun token disponible pour le test backend');
    return false;
  }
  
  try {
    const response = await fetch('http://localhost:8084/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Authentification backend réussie');
      console.log('👤 User backend:', data);
      return true;
    } else {
      console.error('❌ Échec authentification backend:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur authentification backend:', error.message);
    return false;
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'authentification...\n');
  
  // Test 1: Keycloak accessible
  const keycloakOk = await testKeycloakAccess();
  
  // Test 2: Authentification des utilisateurs
  if (keycloakOk) {
    for (const user of testUsers) {
      const authResult = await testUserAuthentication(user.username, user.password);
      if (authResult) {
        // Test 5: Backend avec token
        await testBackendAuth(authResult.access_token);
        break; // Test avec le premier utilisateur qui fonctionne
      }
    }
  }
  
  // Test 3: Frontend auth
  testFrontendAuth();
  
  // Test 4: Backend accessible
  await testBackendConnection();
  
  console.log('\n🎯 Résumé des tests terminé !');
  console.log('📋 Vérifiez les résultats ci-dessus pour identifier les problèmes.');
}

// Instructions d'utilisation
console.log(`
📋 Instructions d'utilisation:

1. Ouvrir la console du navigateur (F12)
2. Copier-coller ce script
3. Exécuter: runAllTests()

Ou tester individuellement:
- testKeycloakAccess()
- testUserAuthentication('admin', 'admin123')
- testFrontendAuth()
- testBackendConnection()
`);

// Exporter les fonctions pour utilisation manuelle
window.testKeycloakAccess = testKeycloakAccess;
window.testUserAuthentication = testUserAuthentication;
window.testFrontendAuth = testFrontendAuth;
window.testBackendConnection = testBackendConnection;
window.testBackendAuth = testBackendAuth;
window.runAllTests = runAllTests; 