# SuperTokens

## Technologies

* React (v18+)
* NodeJs (v16+)
* Keycloak (optional)

## Getting Started

> Docs: https://supertokens.com/docs
> OpenAPI Specs: https://app.swaggerhub.com/apis/supertokens/CDI/2.16.2
> JWT usage: https://supertokens.com/docs/session/common-customizations/sessions/with-jwt/about


- Run the SuperTokens CORE docker image
```
docker run -p 3567:3567 -d registry.supertokens.io/supertokens/supertokens-postgresql
```
Ref: https://supertokens.com/docs/passwordless/custom-ui/init/core/with-docker

- Test the service is running on `http://localhost:3567/hello`

- Run the SuperTokens frontend and backend API
```
npm i
npm run start
```

## Keycloak integration

We set up the Keycloak integration with SuperTokens for test purposes. 

If you want to try, you need an active instance of Keycloak with the following [realm configuration](realm-export.json)

> Think about changing the Keycloak url if needed 
