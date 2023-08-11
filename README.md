# Dance Class Aggregator

## Description
A resourceful tool for finding the right dance classes for you, wherever you are. 

Compiles dance classes from various studios in specific cities (i.e. NY, LA, ATL, CHI) into one central interface. The aggregator scrapes the websites of independent studios and assembles their publicly available class information for all to see. It provides filtering options based on studio location, instructor, dance style, time, and more so dancers can easily find classes that are right for them without having to comb through many websites and independent mobile apps.

## Design
The application uses a MEVN stack—that is, an Express.js backend, Vue.js frontend, MongoDB database, and Node.js runtime environment. Authentication is done via Keycloak. A Docker container runs the database and Keycloak server and will soon run the app in its entirety.

## How to Set Up and Run
After cloning, run `npm install` in both the ui/ and server/ directories to install the appropriate modules.

If you are a not an administrator, please skip to the section labeled **Non-administrator Setup**.

### Administrator Setup

If you are an administrator, you will need to login via Keycloak and thus have a Keycloak container running in Docker. To do this, first build a keycloak18 image. See [Keycloak documentation](https://www.keycloak.org/server/containers) for assistance. Run `Compose Up` on compose.yaml to get the aggregator's Docker container running. If you'd like to see the Keycloak administration console (not necessary for setup), navigate to the keycloak site from the keycloak image in Docker and log in with your provided credentials. Please see **Final Steps** below.

### Non-administrator Setup

If you are not an administrator, you do not need Keycloak set up to use this application successfully. Navigate to compose.yaml and delete the following section 
```
volumes:
  keycloak:
    driver: local
  mongo:
    driver: local

services:
    server1:
        ...
        depends_on:
            - keycloak
        ...

keycloak:
    image: keycloak18
    container_name: keycloakDanceClassAggregator
    environment:
      - KEYCLOAK_USER=
      - KEYCLOAK_PASSWORD=
    restart: always
    networks:
      - danceClassAggregator
    volumes:
      - keycloak:/opt/jboss/keycloak/standalone/data
    ports:
      - "127.0.0.1:8081:8080"
```

Now run `Compose Up` on compose.yaml to get the aggregator's Docker container running.

### Final Steps
After successfully building your Docker container, run `npm run setup` from the server directory to set up the mongo database. Optionally, open MongoDB Compass for visual confirmation that the setup worked. To do this, confirm that the starter data has collecetions for admins, classes, instructors, and studios.

You should now be set up to run the app. Start the server and ui in separate terminals using `npm start` and navigate to **127.0.0.1:8094** on your machine. 


## Development Plan
    1) Implement filtering options.
    2) Build out admin console with editing/app-oversight abilities.
    3) Complete web scraper.
    4) Host on public domain.