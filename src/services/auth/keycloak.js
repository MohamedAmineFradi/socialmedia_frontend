import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8081',
  realm: 'libertalk',
  clientId: 'social-media-frontend',
};

console.log('Keycloak config:', keycloakConfig);

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;